import { CircleAlert, ClipboardList } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskTable, type Task } from "./task-table";

async function getTasks(): Promise<Task[]> {
  const apiUrl = process.env.TASK_API_URL ?? "http://localhost:3001";
  const response = await fetch(`${apiUrl.replace(/\/+$/, "")}/tasks`, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Cannot load tasks (HTTP ${response.status})`);
  }

  const tasks: Task[] = await response.json();
  if (!Array.isArray(tasks)) {
    throw new Error("Expected a task list");
  }
  return tasks;
}

async function TaskList() {
  await connection();

  let tasks: Task[];
  try {
    tasks = await getTasks();
  } catch {
    return (
      <Alert variant="destructive" className="p-4">
        <CircleAlert aria-hidden="true" />
        <AlertTitle>Couldn’t load tasks</AlertTitle>
        <AlertDescription>Check that the API is running.</AlertDescription>
        <AlertAction>
          <form action="/" method="get">
            <Button type="submit" variant="outline">Try again</Button>
          </form>
        </AlertAction>
      </Alert>
    );
  }

  return <TaskTable tasks={tasks} />;
}

function TaskListSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-7">
      <p className="text-sm text-muted-foreground">Loading tasks…</p>
      <Skeleton aria-hidden="true" className="h-10 w-full motion-reduce:animate-none" />
      <Skeleton aria-hidden="true" className="h-10 w-full motion-reduce:animate-none" />
      <Skeleton aria-hidden="true" className="h-10 w-full motion-reduce:animate-none" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8 sm:py-16 lg:py-20">
      <header className="mb-7 flex items-center gap-4 sm:mb-9">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground sm:size-14">
          <ClipboardList className="size-6" aria-hidden="true" />
        </span>
        <h1 id="tasks-heading" className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Tasks
        </h1>
      </header>

      <Suspense fallback={<TaskListSkeleton />}>
        <TaskList />
      </Suspense>
    </main>
  );
}
