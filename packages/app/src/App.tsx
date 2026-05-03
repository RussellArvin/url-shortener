import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { signOut, useSession } from "@/lib/auth-client";
import { AppShellSkeleton } from "@/components/app-shell-skeleton";
import { AuthForm } from "@/components/auth-form";
import { Header } from "@/components/header";
import { ThemeToggleFab } from "@/components/theme-toggle-fab";
import { Skeleton } from "@/components/ui/skeleton";

const HomePage = lazy(() =>
  import("@/pages/home-page").then((m) => ({ default: m.HomePage })),
);
const LinksPage = lazy(() =>
  import("@/pages/links-page").then((m) => ({ default: m.LinksPage })),
);

function RouteFallback() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-3 px-4 py-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
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
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/links" element={<LinksPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <ThemeToggleFab />
      </div>
    </BrowserRouter>
  );
}

export default App;
