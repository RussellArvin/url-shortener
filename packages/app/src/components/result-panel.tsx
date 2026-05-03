import { Link as RouterLink } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { API_BASE, type Link } from "@/lib/api";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultPanelProps {
  link: Link;
}

export function ResultPanel({ link }: ResultPanelProps) {
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
          <CopyButton
            text={url}
            variant="outline"
            showLabel
            className="ml-auto"
          />
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
