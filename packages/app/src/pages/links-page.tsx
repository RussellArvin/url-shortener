import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LinksTable, type ListedLink } from "@/components/links-table";

export function LinksPage() {
  const [links, setLinks] = useState<ListedLink[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctl = new AbortController();
    void (async () => {
      try {
        const res = await api.links.$get(undefined, {
          init: { signal: ctl.signal },
        });
        if (res.ok) setLinks((await res.json()).links);
      } catch {
        // aborted or network failure
      } finally {
        if (!ctl.signal.aborted) setLoading(false);
      }
    })();
    return () => {
      ctl.abort();
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">My links</h1>
        <p className="text-sm text-muted-foreground">
          Newest first. Click a short URL to test the redirect.
        </p>
      </div>
      <LinksTable links={links} loading={loading} />
    </div>
  );
}
