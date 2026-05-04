import { useState } from "react";
import { type Link } from "@/lib/api";
import { useCreateLink } from "@/hooks/useCreateLink";
import { CreateLinkForm } from "@/components/create-link-form";
import { PageHeading, PageShell } from "@/components/page-shell";
import { ResultPanel } from "@/components/result-panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HomePage() {
  const create = useCreateLink();
  const [result, setResult] = useState<Link | null>(null);

  return (
    <PageShell width="narrow" className="py-16">
      <div className="flex flex-col items-center gap-6">
        <PageHeading
          title="Shorten any URL"
          description="Generate a short link with a random or custom slug."
          centered
          className="mb-0"
        />

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">New link</CardTitle>
            <CardDescription>
              Paste a URL, choose a random or custom slug.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateLinkForm
              onSubmit={async (values) => {
                const targetUrl = /^https?:\/\//i.test(values.url)
                  ? values.url
                  : `https://${values.url}`;
                try {
                  const link = await create.mutateAsync({
                    targetUrl,
                    ...(values.mode === "custom"
                      ? { customSlug: values.customSlug }
                      : {}),
                  });
                  setResult(link);
                } catch {
                  // toast handled inside the hook
                }
              }}
            />
          </CardContent>
        </Card>

        {result && <ResultPanel link={result} />}
      </div>
    </PageShell>
  );
}
