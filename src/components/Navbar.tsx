"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="w-full border-b border-emerald-800/30 bg-emerald-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-emerald-300 tracking-wide">
          ☪ Tasbeeh
        </Link>

        <div className="flex items-center gap-4">
          {status === "loading" && (
            <span className="text-sm text-emerald-400/60">Loading…</span>
          )}

          {status === "authenticated" && session?.user && (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-emerald-200 hover:text-white transition"
              >
                Counter
              </Link>
              <span className="text-xs text-emerald-400/80 hidden sm:inline">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm px-3 py-1.5 rounded-lg bg-emerald-800/60 text-emerald-200 hover:bg-emerald-700 transition"
              >
                Sign out
              </button>
            </>
          )}

          {status === "unauthenticated" && (
            <>
              <Link
                href="/login"
                className="text-sm text-emerald-200 hover:text-white transition"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
