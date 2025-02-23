// app/api/auth/[auth0]/route.js
import { handleAuth } from "@auth0/nextjs-auth0";

console.log("HITTING");
export const GET = handleAuth();
