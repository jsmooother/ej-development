// Simple authentication - In production, use NextAuth.js or similar
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123"; // Change this in production!

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function isAuthenticated(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) return false;

  const base64Credentials = authHeader.slice(6);
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
  const [username, password] = credentials.split(":");

  return validateCredentials(username, password);
}

