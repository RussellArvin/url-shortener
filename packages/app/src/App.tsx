import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateLinkForm } from "@/components/create-link-form";

function App() {
  return (
    <main className="min-h-svh flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>URL Shortener</CardTitle>
          <CardDescription>
            Paste a long URL and pick a short slug.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateLinkForm
            onSubmit={(values) => {
              console.log("submit", values);
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
