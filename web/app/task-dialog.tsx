"use client";

import { Plus } from "lucide-react";
import { type FormEvent, useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { taskStatuses, type Task } from "@/lib/task";
import { saveTask } from "./task-actions";

export function TaskDialog({ task }: { task?: Task }) {
  const [open, setOpen] = useState(false);
  const [titleInvalid, setTitleInvalid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const titleInput = useRef<HTMLInputElement>(null);
  const id = useId();

  const initialFields = {
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? "TODO",
    dueDate: task?.dueDate?.slice(0, 10) ?? "",
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    const form = new FormData(event.currentTarget);
    setError(null);
    if (!String(form.get("title") ?? "").trim()) {
      setTitleInvalid(true);
      titleInput.current?.focus();
      return;
    }

    if (task) {
      for (const [field, value] of Object.entries(initialFields)) {
        if (form.get(field) === value) form.delete(field);
      }
    }

    startTransition(async () => {
      let failure: string | null;
      try {
        failure = await saveTask(task?.id ?? null, form);
      } catch {
        failure = "Couldn’t save the task. Try again.";
      }

      if (failure) {
        setError(failure);
      } else {
        setOpen(false);
        toast.success(task ? "Task updated" : "Task created");
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, details) => {
        if (isPending) {
          details.cancel();
          return;
        }
        if (nextOpen) {
          setTitleInvalid(false);
          setError(null);
        }
        setOpen(nextOpen);
      }}
    >
      {task ? (
        <DialogTrigger
          render={<Button variant="outline" size="sm" />}
          aria-label={`Edit ${task.title}`}
        >
          Edit
        </DialogTrigger>
      ) : (
        <DialogTrigger render={<Button />}>
          <Plus data-icon="inline-start" aria-hidden="true" />
          Add task
        </DialogTrigger>
      )}
      <DialogContent
        initialFocus={titleInput}
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto motion-reduce:animate-none sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "Add task"}</DialogTitle>
          <DialogDescription className="sr-only">
            Enter a title and choose a status. The description and due date are optional.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} aria-busy={isPending}>
          <FieldGroup className="gap-4">
            <Field data-invalid={titleInvalid} data-disabled={isPending}>
              <FieldLabel htmlFor={`${id}-title`}>Title</FieldLabel>
              <Input
                ref={titleInput}
                id={`${id}-title`}
                name="title"
                defaultValue={initialFields.title}
                required
                disabled={isPending}
                aria-invalid={titleInvalid}
                aria-describedby={titleInvalid ? `${id}-title-error` : undefined}
                onChange={() => setTitleInvalid(false)}
              />
              {titleInvalid && <FieldError id={`${id}-title-error`}>Enter a task title.</FieldError>}
            </Field>
            <Field data-disabled={isPending}>
              <FieldLabel htmlFor={`${id}-description`}>Description</FieldLabel>
              <Textarea
                id={`${id}-description`}
                name="description"
                defaultValue={initialFields.description}
                disabled={isPending}
              />
            </Field>
            <div className="grid gap-4 min-[360px]:grid-cols-2">
              <Field data-disabled={isPending}>
                <FieldLabel htmlFor={`${id}-status`}>Status</FieldLabel>
                <NativeSelect
                  id={`${id}-status`}
                  name="status"
                  defaultValue={initialFields.status}
                  disabled={isPending}
                >
                  {Object.entries(taskStatuses).map(([status, { label }]) => (
                    <NativeSelectOption key={status} value={status}>{label}</NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
              <Field data-disabled={isPending}>
                <FieldLabel htmlFor={`${id}-due-date`}>Due date</FieldLabel>
                <Input
                  id={`${id}-due-date`}
                  name="dueDate"
                  type="date"
                  defaultValue={initialFields.dueDate}
                  disabled={isPending}
                />
              </Field>
            </div>
          </FieldGroup>

          {error && (
            <Alert variant="destructive"><AlertTitle>{error}</AlertTitle></Alert>
          )}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" disabled={isPending} />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : task ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
