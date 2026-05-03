import { useState } from "react";
import { type InferResponseType } from "hono/client";
import { signOut, useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { AuthForm } from "@/components/auth-form";
import { CreateLinkForm } from "@/components/create-link-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CreatedLink = InferResponseType<(typeof api.links)["$post"], 201>;

function App() {
  const { data: session, isPending } = useSession();
  const [result, setResult] = useState<CreatedLink | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="min-h-svh flex items-center justify-center p-4 bg-background">
      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : session ? (
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>URL Shortener</CardTitle>
              <CardDescription>
                Signed in as {session.user.email}.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                void signOut();
              }}
            >
              Sign out
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <CreateLinkForm
              onSubmit={async (values) => {
                setError(null);
                setResult(null);
                const res = await api.links.$post({
                  json: {
                    targetUrl: values.url,
                    ...(values.mode === "custom"
                      ? { customSlug: values.customSlug }
                      : {}),
                  },
                });
                if (res.status === 201) {
                  setResult(await res.json());
                  return;
                }
                const data = (await res.json()) as { error?: string };
                setError(
                  data.error ?? `Request failed (${String(res.status)})`,
                );
              }}
            />

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            {result && (
              <div className="rounded-md border bg-muted/40 p-3 text-sm space-y-1">
                <div className="text-muted-foreground">Short URL</div>
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline-offset-2 hover:underline break-all"
                >
                  {result.shortUrl}
                </a>
                <div className="text-muted-foreground break-all">
                  → {result.targetUrl}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <AuthForm />
      )}
    </main>
  );
}

export default App;
