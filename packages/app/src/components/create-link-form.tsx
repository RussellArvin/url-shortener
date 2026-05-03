import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SlugMode = "random" | "custom";

export interface CreateLinkFormValues {
  url: string;
  mode: SlugMode;
  customSlug: string;
}

const defaultValues: CreateLinkFormValues = {
  url: "",
  mode: "random",
  customSlug: "",
};

interface CreateLinkFormProps {
  onSubmit: (values: CreateLinkFormValues) => void | Promise<void>;
}

export function CreateLinkForm({ onSubmit }: CreateLinkFormProps) {
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
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
      <form.Field name="url">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>URL</Label>
            <Input
              id={field.name}
              name={field.name}
              type="url"
              required
              placeholder="https://example.com/very/long/path"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="mode">
        {(modeField) => (
          <Tabs
            value={modeField.state.value}
            onValueChange={(v) => {
              modeField.handleChange(v as SlugMode);
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="random">Random</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="random" className="pt-2">
              <p className="text-sm text-muted-foreground">
                We&apos;ll generate a random slug for you.
              </p>
            </TabsContent>
            <TabsContent value="custom" className="pt-2 space-y-2">
              <form.Field name="customSlug">
                {(field) => (
                  <>
                    <Label htmlFor={field.name}>Custom slug</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      required={modeField.state.value === "custom"}
                      pattern="[A-Za-z0-9_-]+"
                      placeholder="my-link"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                    />
                  </>
                )}
              </form.Field>
            </TabsContent>
          </Tabs>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Shortening…" : "Shorten"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
