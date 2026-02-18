import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import TasbeehCounter from "@/components/TasbeehCounter";

export const metadata = {
  title: "Tasbeeh Counter — Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-200">
          Your Tasbeeh Counter
        </h1>
        <p className="text-emerald-400/60 text-sm mt-1">
          Synced across all your devices
        </p>
      </div>

      <TasbeehCounter />
    </main>
  );
}
