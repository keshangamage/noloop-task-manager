"use client";

import { Badge } from "@/components/ui/badge";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const taskStatuses = {
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

const formatDate = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <section aria-labelledby="tasks-heading" className="overflow-hidden rounded-2xl border bg-card text-card-foreground">
      <p className="border-b px-4 py-4 text-sm font-medium text-muted-foreground sm:px-6">
        {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
      </p>

      <Table aria-labelledby="tasks-heading" className="table-fixed">
        <TableHeader className="bg-muted/55">
          <TableRow>
            <TableHead scope="col" className="px-4 sm:px-6">Task</TableHead>
            <TableHead scope="col" className="w-[6.5rem] sm:w-36">Status</TableHead>
            <TableHead scope="col" className="w-[6.5rem] pr-4 sm:w-40 sm:pr-6">Due date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>
                <Empty className="min-h-36">
                  <EmptyHeader><EmptyTitle>No tasks yet</EmptyTitle></EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}
          {tasks.map((task) => {
            const status = taskStatuses[task.status];
            const dueDate = task.dueDate?.slice(0, 10);

            return (
              <TableRow key={task.id}>
                <TableCell className="px-4 py-4 whitespace-normal sm:px-6">
                  <p className="font-medium wrap-anywhere">{task.title}</p>
                  {task.description && (
                    <p className="mt-1 text-sm wrap-anywhere text-muted-foreground">{task.description}</p>
                  )}
                </TableCell>
                <TableCell><Badge variant={status.variant}>{status.label}</Badge></TableCell>
                <TableCell className="pr-4 whitespace-normal sm:pr-6">
                  {dueDate ? (
                    <time dateTime={dueDate} className="font-mono text-xs">{formatDate.format(new Date(dueDate))}</time>
                  ) : (
                    <span aria-label="No due date" className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}
