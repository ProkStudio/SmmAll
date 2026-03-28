export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/cabinet/:path*", "/admin/:path*"],
};
