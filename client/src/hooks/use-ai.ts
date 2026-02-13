import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useAIProcess() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (prompt: string) => {
      const res = await fetch(api.ai.process.path, {
        method: api.ai.process.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("AI processing failed");
      return api.ai.process.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
      toast({ title: "Tasks created", description: "AI has processed your request." });
    },
    onError: () => {
      toast({ title: "Processing failed", description: "Could not understand request.", variant: "destructive" });
    },
  });
}

export function useAIBreakdown() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (taskId: number) => {
      const res = await fetch(api.ai.breakdown.path, {
        method: api.ai.breakdown.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("AI breakdown failed");
      return api.ai.breakdown.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
      toast({ title: "Task broken down", description: "Subtasks added successfully." });
    },
  });
}
