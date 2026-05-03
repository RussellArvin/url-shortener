import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LoginValues {
  email: string;
  password: string;
}

interface SignupValues {
  name: string;
  email: string;
  password: string;
}

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
    defaultValues: { email: "", password: "" } satisfies LoginValues,
    onSubmit: async ({ value }) => {
      setError(null);
      const { error } = await signIn.email({
        email: value.email,
        password: value.password,
      });
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
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
            <Input
              id={field.name}
              name={field.name}
              type="email"
              required
              autoComplete="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Password</Label>
            <Input
              id={field.name}
              name={field.name}
              type="password"
              required
              autoComplete="current-password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
            />
          </div>
        )}
      </form.Field>

      <ErrorMessage message={error} />

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

function SignupForm() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    } satisfies SignupValues,
    onSubmit: async ({ value }) => {
      setError(null);
      const { error } = await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      });
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
          <div className="space-y-2">
            <Label htmlFor={field.name}>Name</Label>
            <Input
              id={field.name}
              name={field.name}
              required
              autoComplete="name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
            <Input
              id={field.name}
              name={field.name}
              type="email"
              required
              autoComplete="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Password</Label>
            <Input
              id={field.name}
              name={field.name}
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
            />
          </div>
        )}
      </form.Field>

      <ErrorMessage message={error} />

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        )}
      </form.Subscribe>
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
