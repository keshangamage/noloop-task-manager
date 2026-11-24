"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Task } from "@/lib/task";
import { deleteTask } from "./task-actions";

interface TaskDeleteDialogProps {
  task: Task | null;
  onClose: (deleted: boolean) => void;
  finalFocus: () => HTMLElement | null;
}

export function TaskDeleteDialog({ task, onClose, finalFocus }: TaskDeleteDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const cancelButton = useRef<HTMLButtonElement>(null);

  function confirmDelete() {
    if (!task || isPending) return;

    setError(null);
    startTransition(async () => {
      let failure: string | null;
      try {
        failure = await deleteTask(task.id);
      } catch {
        failure = "Couldn’t delete the task. Try again.";
      }

      if (failure) {
        setError(failure);
      } else {
        onClose(true);
        toast.success("Task deleted");
      }
    });
  }

  return (
    <AlertDialog
      open={task !== null}
      onOpenChange={(open, details) => {
        if (isPending) {
          details.cancel();
          return;
        }
        if (!open) {
          setError(null);
          onClose(false);
        }
      }}
    >
      <AlertDialogContent
        size="sm"
        initialFocus={cancelButton}
        finalFocus={finalFocus}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto motion-reduce:animate-none"
        aria-busy={isPending}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Delete task?</AlertDialogTitle>
          <AlertDialogDescription className="wrap-anywhere">
            This permanently removes “{task?.title}”.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <Alert variant="destructive"><AlertTitle>{error}</AlertTitle></Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelButton} disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={confirmDelete} disabled={isPending}>
            {isPending ? "Deleting…" : "Delete task"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
