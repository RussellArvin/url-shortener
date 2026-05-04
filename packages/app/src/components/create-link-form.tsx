import { useForm } from "@tanstack/react-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField } from "@/components/form-field";
import { FormSubmit } from "@/components/form-submit";

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
          <FormField
            field={field}
            label="URL"
            type="text"
            required
            pattern="(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?"
            title="Enter a valid URL (e.g. example.com or https://example.com/path)"
            placeholder="example.com/very/long/path"
          />
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
            <TabsContent value="custom" className="pt-2">
              <form.Field name="customSlug">
                {(field) => (
                  <FormField
                    field={field}
                    label="Custom slug"
                    required={modeField.state.value === "custom"}
                    pattern="[A-Za-z0-9_-]+"
                    maxLength={30}
                    placeholder="my-link"
                  />
                )}
              </form.Field>
            </TabsContent>
          </Tabs>
        )}
      </form.Field>

      <FormSubmit form={form} idleLabel="Shorten" loadingLabel="Shortening…" />
    </form>
  );
}
