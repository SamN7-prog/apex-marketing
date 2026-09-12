import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  let next = requestUrl.searchParams.get("next") ?? "/dashboard";

  // Only allow internal redirects.
  if (!next.startsWith("/")) {
    next = "/dashboard";
  }

  // No OAuth code means authentication failed.
  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/login?error=Authentication%20failed",
        requestUrl.origin
      )
    );
  }

  const supabase = await createClient();

  // Exchange the OAuth code for a Supabase session.
  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(
      "Supabase OAuth callback error:",
      error.message
    );

    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error.message)}`,
        requestUrl.origin
      )
    );
  }

  // Successful authentication.
  return NextResponse.redirect(
    new URL(next, requestUrl.origin)
  );
}