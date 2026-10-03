// app/admin/page.tsx
// Self-contained: needs no other files.
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function hasValidSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // TEMPORARY debug logs: they print in the terminal running `npm run dev`.
  // Remove them once protection works.
  console.log("[admin-check] API_URL:", API_URL);
  console.log(
    "[admin-check] cookies received:",
    cookieStore.getAll().map((cookie) => cookie.name),
  );

  if (!cookieHeader || !API_URL) return false;

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    const body = await response.json().catch(() => null);

    console.log(
      "[admin-check] /auth/me status:",
      response.status,
      "body:",
      JSON.stringify(body)?.slice(0, 200),
    );

    if (!response.ok) return false;

    // A 200 is not enough: some backends return 200 with { user: null }.
    return Boolean(
      body && (body.user || body.admin || body._id || body.id || body.email),
    );
  } catch (error) {
    console.log("[admin-check] request to API failed:", error);
    return false;
  }
}

export default async function AdminIndex() {
  // redirect() throws internally, so call it outside any try/catch.
  const authenticated = await hasValidSession();

  if (!authenticated) {
    redirect("/admin/login");
  }

  redirect("/admin/analytics");
}