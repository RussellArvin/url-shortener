import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { signOut, useSession } from "@/lib/auth-client";
import { AuthForm } from "@/components/auth-form";
import { Header } from "@/components/header";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Skeleton } from "@/components/ui/skeleton";
import { HomePage } from "@/pages/home-page";
import { LinksPage } from "@/pages/links-page";

function ThemeToggleFab() {
  return (
    <AnimatedThemeToggler className="fixed bottom-4 right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground [&_svg]:size-4" />
  );
}

function AppShellSkeleton() {
  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-24" />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-4 py-16">
        <div className="w-full space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto h-4 w-80" />
        </div>
        <div className="w-full space-y-4 rounded-lg border p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </main>
    </div>
  );
}

function App() {
  const { data: session, isPending } = useSession();

  if (isPending) return <AppShellSkeleton />;

  if (!session) {
    return (
      <>
        <main className="grid min-h-svh place-items-center bg-background p-4">
          <AuthForm />
        </main>
        <ThemeToggleFab />
      </>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-svh bg-background">
        <Header
          email={session.user.email}
          onSignOut={() => {
            void signOut();
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ThemeToggleFab />
      </div>
    </BrowserRouter>
  );
}

export default App;
