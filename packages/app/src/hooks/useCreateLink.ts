import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type InferRequestType } from "hono/client";
import { toast } from "sonner";
import { api } from "@/lib/api";

type CreateLinkInput = InferRequestType<typeof api.links.$post>["json"];

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateLinkInput) => {
      const res = await api.links.$post({ json: input });
      if (res.status !== 201) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? `Request failed (${String(res.status)})`);
      }
      return res.json();
    },
    onSuccess: async () => {
      toast.success("Short link created");
      await queryClient.invalidateQueries({ queryKey: ["links"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
