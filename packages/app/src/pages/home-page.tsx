import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Check, Copy, ExternalLink } from "lucide-react";
import { type InferResponseType } from "hono/client";
import { api, API_BASE } from "@/lib/api";
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

export function HomePage() {
  const [result, setResult] = useState<CreatedLink | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-4 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Shorten any URL
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate a short link with a random or custom slug.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">New link</CardTitle>
          <CardDescription>
            Paste a URL, choose a random or custom slug.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <CreateLinkForm
            onSubmit={async (values) => {
              setError(null);
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
              setError(data.error ?? `Request failed (${String(res.status)})`);
            }}
          />
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      {result && <ResultPanel link={result} />}
    </div>
  );
}

function ResultPanel({ link }: { link: CreatedLink }) {
  const [copied, setCopied] = useState(false);
  const url = `${API_BASE}/${link.slug}`;

  return (
    <Card className="w-full border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20">
      <CardHeader>
        <CardTitle className="text-lg">Your short link is ready</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-0 items-center gap-1 text-base font-medium underline-offset-2 hover:underline"
          >
            <span className="truncate">{url}</span>
            <ExternalLink className="h-4 w-4 shrink-0" />
          </a>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => {
              void navigator.clipboard.writeText(url).then(() => {
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 1500);
              });
            }}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <p className="truncate text-sm text-muted-foreground">
          → {link.targetUrl}
        </p>
        <RouterLink
          to="/links"
          className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          View all your links →
        </RouterLink>
      </CardContent>
    </Card>
  );
}
