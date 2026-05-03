import { signOut, useSession } from "@/lib/auth-client";
import { AuthForm } from "@/components/auth-form";
import { CreateLinkForm } from "@/components/create-link-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function App() {
  const { data: session, isPending } = useSession();

  return (
    <main className="min-h-svh flex items-center justify-center p-4 bg-background">
      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : session ? (
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>URL Shortener</CardTitle>
              <CardDescription>
                Signed in as {session.user.email}.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                void signOut();
              }}
            >
              Sign out
            </Button>
          </CardHeader>
          <CardContent>
            <CreateLinkForm
              onSubmit={(values) => {
                console.log("submit", values);
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <AuthForm />
      )}
    </main>
  );
}

export default App;
