import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await api.links[":slug"].$delete({ param: { slug } });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? `Request failed (${String(res.status)})`);
      }
      return res.json();
    },
    onSuccess: async () => {
      toast.success("Link deleted");
      await queryClient.invalidateQueries({ queryKey: ["links"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
