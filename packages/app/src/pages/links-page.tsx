import { useDeleteLink } from "@/hooks/useDeleteLink";
import { useLinks } from "@/hooks/useLinks";
import { LinksTable } from "@/components/links-table";

export function LinksPage() {
  const { data: links, isPending } = useLinks();
  const deleteLink = useDeleteLink();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">My links</h1>
        <p className="text-sm text-muted-foreground">
          Newest first. Click a short URL to test the redirect.
        </p>
      </div>
      <LinksTable
        links={links ?? null}
        loading={isPending}
        onDelete={(slug) => {
          deleteLink.mutate(slug);
        }}
      />
    </div>
  );
}
