import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useLinks() {
  return useQuery({
    queryKey: ["links"],
    queryFn: async () => {
      const res = await api.links.$get();
      if (!res.ok) {
        throw new Error(`Failed to load links (${String(res.status)})`);
      }
      return (await res.json()).links;
    },
  });
}
