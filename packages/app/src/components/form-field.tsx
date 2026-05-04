import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StringField {
  name: string;
  state: {
    value: string;
    meta: { errors: unknown[] };
  };
  handleBlur: () => void;
  handleChange: (value: string) => void;
}

type InputProps = Omit<
  React.ComponentProps<typeof Input>,
  "id" | "name" | "value" | "onChange" | "onBlur"
>;

interface FormFieldProps extends InputProps {
  field: StringField;
  label: string;
}

export function FormField({ field, label, ...inputProps }: FormFieldProps) {
  const error = field.state.meta.errors.find(
    (e): e is string => typeof e === "string",
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        aria-invalid={error ? true : undefined}
        onBlur={field.handleBlur}
        onChange={(e) => {
          field.handleChange(e.target.value);
        }}
        {...inputProps}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
