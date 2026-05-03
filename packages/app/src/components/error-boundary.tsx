import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info);
  }

  override render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <main className="grid min-h-svh place-items-center bg-background p-4">
        <div className="w-full max-w-md space-y-4 rounded-lg border p-6 text-center">
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground break-words">
            {this.state.error.message}
          </p>
          <Button
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </Button>
        </div>
      </main>
    );
  }
}
