import { NextResponse } from "next/server";
const response = NextResponse.next();

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  let session_token;
  let access_token;

  try {
    session_token = request.cookies.get("session_token").value;
    access_token = request.cookies.get("access_token").value;
  } catch {
    if (session_token && path !== "/login") {
      const verified_token = await fetch(
        `http://127.0.0.1:8000/token/verify?token=${session_token}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((data) => data.success);
      if (verified_token) {
        const params = {
          session_token: session_token,
        };

        const updated_tokens = await fetch(
          `http://127.0.0.1:8000/token/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(params),
          }
        ).then((response) => response.json());
        if (updated_tokens.success) {
          response.cookies.set("session_token", updated_tokens.session_token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          response.cookies.set("access_token", updated_tokens.access_token, {
            expires: new Date(Date.now() + 15 * 60 * 1000),
          });
          return response;
        }
      } else {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } else if (path !== "/login" && path !== "/register") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
