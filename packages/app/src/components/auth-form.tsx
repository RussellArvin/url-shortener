import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { signIn, signUp } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField } from "@/components/form-field";
import { FormSubmit } from "@/components/form-submit";

function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      setError(null);
      const { error } = await signIn.email(value);
      if (error) setError(error.message ?? "Sign in failed");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field name="email">
        {(field) => (
          <FormField
            field={field}
            label="Email"
            type="email"
            required
            autoComplete="email"
          />
        )}
      </form.Field>
      <form.Field name="password">
        {(field) => (
          <FormField
            field={field}
            label="Password"
            type="password"
            required
            autoComplete="current-password"
          />
        )}
      </form.Field>
      <ErrorMessage message={error} />
      <FormSubmit form={form} idleLabel="Sign in" loadingLabel="Signing in…" />
    </form>
  );
}

function SignupForm() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    onSubmit: async ({ value }) => {
      setError(null);
      const { error } = await signUp.email(value);
      if (error) setError(error.message ?? "Sign up failed");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field name="name">
        {(field) => (
          <FormField field={field} label="Name" required autoComplete="name" />
        )}
      </form.Field>
      <form.Field name="email">
        {(field) => (
          <FormField
            field={field}
            label="Email"
            type="email"
            required
            autoComplete="email"
          />
        )}
      </form.Field>
      <form.Field name="password">
        {(field) => (
          <FormField
            field={field}
            label="Password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        )}
      </form.Field>
      <ErrorMessage message={error} />
      <FormSubmit
        form={form}
        idleLabel="Create account"
        loadingLabel="Creating account…"
      />
    </form>
  );
}

export function AuthForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>URL Shortener</CardTitle>
        <CardDescription>Sign in to create short links.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="pt-4">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup" className="pt-4">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
