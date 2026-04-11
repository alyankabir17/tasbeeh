import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";


export const dynamic = "force-dynamic";


interface CounterRow {
  id: string;
  user_id: string;
  current_count: number;
  target: number;
  lifetime_count: number;
  last_updated: string;
}


/** Map snake_case DB row to camelCase for the frontend */
function toJson(row: CounterRow) {
  return {
    id: row.id,
    userId: row.user_id,
    currentCount: row.current_count,
    target: row.target,
    lifetimeCount: row.lifetime_count,
    lastUpdated: row.last_updated,
  };
}

async function getOrCreateCounter(userId: string): Promise<CounterRow> {
  let counter = await queryOne<CounterRow>(
    "SELECT * FROM counters WHERE user_id = $1 LIMIT 1",
    [userId]
  );

  if (!counter) {
    const rows = await query<CounterRow>(
      "INSERT INTO counters (id, user_id, current_count, target, lifetime_count) VALUES (gen_random_uuid(), $1, 0, 100, 0) RETURNING *",
      [userId]
    );
    counter = rows[0];
  }

  return counter;
}

// GET /api/counter — fetch the user's counter
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const counter = await getOrCreateCounter(session.user.id);
  return NextResponse.json(toJson(counter));
}

// PUT /api/counter — update count / target / reset
export async function PUT(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, target } = body as {
    action?: "increment" | "reset" | "setTarget";
    target?: number;
  };

  const counter = await getOrCreateCounter(session.user.id);
  let updated: CounterRow;

  switch (action) {
    case "increment": {
      const rows = await query<CounterRow>(
        "UPDATE counters SET current_count = current_count + 1, lifetime_count = lifetime_count + 1, last_updated = NOW() WHERE id = $1 RETURNING *",
        [counter.id]
      );
      updated = rows[0];
      break;
    }

    case "reset": {
      const rows = await query<CounterRow>(
        "UPDATE counters SET current_count = 0, last_updated = NOW() WHERE id = $1 RETURNING *",
        [counter.id]
      );
      updated = rows[0];
      break;
    }

    case "setTarget": {
      if (!target || target < 1) {
        return NextResponse.json(
          { error: "Target must be a positive number" },
          { status: 400 }
        );
      }
      const rows = await query<CounterRow>(
        "UPDATE counters SET target = $1, last_updated = NOW() WHERE id = $2 RETURNING *",
        [target, counter.id]
      );
      updated = rows[0];
      break;
    }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json(toJson(updated));
}
