import { useDeleteLink } from "@/hooks/useDeleteLink";
import { useLinks } from "@/hooks/useLinks";
import { LinksTable } from "@/components/links-table";
import { PageHeading, PageShell } from "@/components/page-shell";

export function LinksPage() {
  const { data: links, isPending } = useLinks();
  const deleteLink = useDeleteLink();

  return (
    <PageShell>
      <PageHeading
        title="My links"
        description="Newest first. Click a short URL to test the redirect."
      />
      <LinksTable
        links={links}
        loading={isPending}
        onDelete={(slug) => {
          deleteLink.mutate(slug);
        }}
      />
    </PageShell>
  );
}
