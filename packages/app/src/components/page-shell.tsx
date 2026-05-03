import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const widths = {
  narrow: "max-w-xl",
  default: "max-w-3xl",
  wide: "max-w-5xl",
} as const;

interface PageShellProps {
  children: ReactNode;
  width?: keyof typeof widths;
  className?: string;
}

export function PageShell({
  children,
  width = "default",
  className,
}: PageShellProps) {
  return (
    <div className={cn("mx-auto w-full px-4 py-8", widths[width], className)}>
      {children}
    </div>
  );
}

interface PageHeadingProps {
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function PageHeading({
  title,
  description,
  centered = false,
  className,
}: PageHeadingProps) {
  return (
    <div className={cn("mb-6 space-y-1", centered && "text-center", className)}>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
