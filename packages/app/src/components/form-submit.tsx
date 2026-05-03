import type { ComponentType, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface FormSubmitState {
  isSubmitting: boolean;
}

interface SubscribableForm {
  Subscribe: ComponentType<{
    selector: (state: FormSubmitState) => boolean;
    children: (isSubmitting: boolean) => ReactNode;
  }>;
}

interface FormSubmitProps {
  form: SubscribableForm;
  idleLabel: ReactNode;
  loadingLabel: ReactNode;
  className?: string;
}

export function FormSubmit({
  form,
  idleLabel,
  loadingLabel,
  className = "w-full",
}: FormSubmitProps) {
  return (
    <form.Subscribe selector={(s) => s.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" className={className} disabled={isSubmitting}>
          {isSubmitting ? loadingLabel : idleLabel}
        </Button>
      )}
    </form.Subscribe>
  );
}
