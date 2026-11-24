export const taskStatuses = {
  TODO: { label: "To do", variant: "outline" },
  IN_PROGRESS: { label: "In progress", variant: "secondary" },
  DONE: { label: "Done", variant: "default" },
} as const;

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: keyof typeof taskStatuses;
  dueDate?: string | null;
}
