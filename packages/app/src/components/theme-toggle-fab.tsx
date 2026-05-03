import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export function ThemeToggleFab() {
  return (
    <AnimatedThemeToggler className="fixed bottom-4 right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground [&_svg]:size-4" />
  );
}
