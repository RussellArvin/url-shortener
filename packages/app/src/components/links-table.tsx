import { type ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Trash2 } from "lucide-react";
import { API_BASE, type Link } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { DataTable } from "@/components/data-table";
import { RelativeTime } from "@/components/relative-time";

interface LinksTableProps {
  links: Link[] | undefined;
  loading: boolean;
  onDelete: (slug: string) => void;
}

export function LinksTable({ links, loading, onDelete }: LinksTableProps) {
  const columns: ColumnDef<Link>[] = [
    {
      accessorKey: "slug",
      header: "Short URL",
      cell: ({ row }) => {
        const url = `${API_BASE}/${row.original.slug}`;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium underline-offset-2 hover:underline"
          >
            <span className="truncate">{url}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
        );
      },
    },
    {
      accessorKey: "targetUrl",
      header: "Destination",
      cell: ({ row }) => (
        <span className="block max-w-[260px] truncate text-sm text-muted-foreground">
          {row.original.targetUrl}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <RelativeTime
          iso={row.original.createdAt}
          className="text-sm text-muted-foreground whitespace-nowrap"
        />
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <CopyButton text={`${API_BASE}/${row.original.slug}`} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onDelete(row.original.slug);
            }}
            aria-label="Delete link"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={links}
      loading={loading}
      emptyMessage="No links yet. Create one from the homepage."
    />
  );
}
