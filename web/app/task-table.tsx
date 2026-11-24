"use client";

import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { taskStatuses, type Task } from "@/lib/task";
import { TaskDialog } from "./task-dialog";
import { TaskDeleteDialog } from "./task-delete-dialog";

const formatDate = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function TaskTable({ tasks }: { tasks: Task[] }) {
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const deleteButton = useRef<HTMLButtonElement>(null);

  return (
    <section aria-labelledby="tasks-heading" className="overflow-hidden rounded-2xl border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-6">
        <p className="text-sm font-medium text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </p>
        <TaskDialog triggerRef={addButton} />
      </div>

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
                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <p className="font-medium wrap-anywhere">{task.title}</p>
                      {task.description && (
                        <p className="mt-1 text-sm wrap-anywhere text-muted-foreground">{task.description}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-1.5">
                      <TaskDialog task={task} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Delete ${task.title}`}
                        aria-haspopup="dialog"
                        onClick={(event) => {
                          deleteButton.current = event.currentTarget;
                          setDeleteTarget(task);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
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

      <TaskDeleteDialog
        task={deleteTarget}
        onClose={(deleted) => {
          if (deleted) deleteButton.current = null;
          setDeleteTarget(null);
        }}
        finalFocus={() => deleteButton.current?.isConnected ? deleteButton.current : addButton.current}
      />
    </section>
  );
}
