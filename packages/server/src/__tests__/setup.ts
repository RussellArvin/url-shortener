process.env["DATABASE_URL"] =
  "postgresql://user:pass@localhost:5432/url_shortener_test";
process.env["REDIS_URL"] = "redis://localhost:6379/1";
process.env["BETTER_AUTH_SECRET"] =
  "test-secret-must-be-at-least-32-chars-long-xxx";
process.env["BETTER_AUTH_URL"] = "http://localhost:3000";
process.env["WEB_URL"] = "http://localhost:5173";
