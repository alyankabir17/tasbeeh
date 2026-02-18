import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
      {/* Hero */}
      <div className="mb-6">
        <span className="text-6xl">☪</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-emerald-100 leading-tight">
        Tasbeeh Counter
      </h1>

      <p className="mt-4 text-lg text-emerald-300/70 max-w-md">
        Count your dhikr, track your progress, and pick up right where you left
        off — on any device.
      </p>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 w-full max-w-lg">
        {[
          { icon: "📿", label: "Track Dhikr" },
          { icon: "🔄", label: "Sync Across Devices" },
          { icon: "🎯", label: "Set Targets" },
        ].map((f) => (
          <div
            key={f.label}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-emerald-900/30 border border-emerald-800/30"
          >
            <span className="text-2xl">{f.icon}</span>
            <span className="text-sm text-emerald-300">{f.label}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 mt-10">
        <Link
          href="/register"
          className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition"
        >
          Get Started — Free
        </Link>
        <Link
          href="/login"
          className="px-8 py-3 rounded-xl border border-emerald-700 text-emerald-300 hover:bg-emerald-900/50 transition"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
