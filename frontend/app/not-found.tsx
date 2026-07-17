import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow accents */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue/20 blur-3xl" />

      <div className="relative text-center max-w-lg">
        {/* Big code, styled like a broken circuit label rather than a generic number */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-[7rem] sm:text-[9rem] font-extrabold leading-none text-white tracking-tight">
            4
          </span>
          <span className="relative inline-flex items-center justify-center h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-teal/40">
            <span className="absolute inset-2 rounded-full border-2 border-dashed border-teal/60 animate-[spin_12s_linear_infinite]" />
            <Search
              className="h-9 w-9 sm:h-11 sm:w-11 text-teal"
              strokeWidth={2}
            />
          </span>
          <span className="text-[7rem] sm:text-[9rem] font-extrabold leading-none text-white tracking-tight">
            4
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          This page hasn&apos;t been built yet
        </h1>
        <p className="text-light-gray/80 text-sm sm:text-base mb-8">
          The page you&apos;re looking for doesn&apos;t exist, may have moved,
          or the link might be broken.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue hover:bg-teal transition-colors text-white font-semibold px-6 py-3"
        >
          <Home className="h-4 w-4" />
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
