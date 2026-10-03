// components/admin/auth-guard.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Wraps the whole admin layout. Nothing inside it (sidebar or page) is
 * rendered until the browser confirms a signed-in admin session.
 * Signed-out visitors are sent to /admin/login.
 *
 * The check runs in the browser, so the login cookie is sent automatically
 * (credentials: "include"). It re-runs on every route change.
 */
export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      let valid = false;

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (response.ok) {
          const body = await response.json().catch(() => null);
          valid = hasUser(body);
        }
      } catch (error) {
        console.error("Admin session check failed:", error);
      }

      if (cancelled) return;

      if (valid) {
        setAllowed(true);
      } else {
        setAllowed(false);
        router.replace("/admin/login");
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          role="status"
          aria-label="Checking your session"
          className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground"
        />
      </div>
    );
  }

  return <>{children}</>;
}

// A 200 alone is not enough: some backends answer 200 with { user: null }
// for signed-out visitors. If your /auth/me returns a different shape,
// adjust this function.
function hasUser(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;

  const body = data as Record<string, unknown>;

  return Boolean(
    body.user ||
      body.admin ||
      body.data ||
      body._id ||
      body.id ||
      body.email,
  );
}