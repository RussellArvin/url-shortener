import { useEffect, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Check, Copy, ExternalLink } from "lucide-react";
import { type InferResponseType } from "hono/client";
import { api, API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type ListedLink = InferResponseType<
  (typeof api.links)["$get"]
>["links"][number];

const RELATIVE = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.round((then - now) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) return RELATIVE.format(diffSec, "second");
  if (abs < 3600) return RELATIVE.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return RELATIVE.format(Math.round(diffSec / 3600), "hour");
  return RELATIVE.format(Math.round(diffSec / 86400), "day");
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => {
      setCopied(false);
    }, 1500);
    return () => {
      clearTimeout(t);
    };
  }, [copied]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
        });
      }}
      aria-label={copied ? "Copied" : "Copy short URL"}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

const columns: ColumnDef<ListedLink>[] = [
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
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {formatRelative(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="text-right">
        <CopyButton text={`${API_BASE}/${row.original.slug}`} />
      </div>
    ),
  },
];

interface LinksTableProps {
  links: ListedLink[] | null;
  loading: boolean;
}

const SKELETON_ROW_COUNT = 4;

export function LinksTable({ links, loading }: LinksTableProps) {
  const table = useReactTable({
    data: links ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id}>
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-56" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                No links yet. Create one from the homepage.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
