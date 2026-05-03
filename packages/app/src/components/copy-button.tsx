import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type ButtonVariant = React.ComponentProps<typeof Button>["variant"];
type ButtonSize = React.ComponentProps<typeof Button>["size"];

interface CopyButtonProps {
  text: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** When true, renders the word "Copy" / "Copied" alongside the icon. */
  showLabel?: boolean;
  className?: string;
}

export function CopyButton({
  text,
  variant = "ghost",
  size = "sm",
  showLabel = false,
  className,
}: CopyButtonProps) {
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
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
        });
      }}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {showLabel && (copied ? "Copied" : "Copy")}
    </Button>
  );
}
