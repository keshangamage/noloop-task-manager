# Task Manager

Section 1 of the Junior Full Stack Developer assignment. Create, view, edit, and delete tasks with a NestJS API and a Next.js frontend built with shadcn/ui.

## Project structure

- `api/` contains the NestJS backend.
- `web/` contains the Next.js App Router frontend.

## Local setup

Use Node.js **24.22.3** and **npm 11**. If you use `nvm`, run `nvm install 24.22.3` and `nvm use 24.22.3` before installing dependencies.

1. Clone the repository and install dependencies from both lockfiles.

   ```bash
   git clone https://github.com/keshangamage/noloop-task-manager.git
   cd noloop-task-manager
   npm --prefix api ci
   npm --prefix web ci
   ```

2. Start the API from the project root and leave the terminal open.

   ```bash
   PORT=3001 npm --prefix api run start:dev
   ```

   In PowerShell, run `$env:PORT = '3001'` followed by `npm --prefix api run start:dev`.

3. Open a second terminal in the project root and start the frontend.

   ```bash
   npm --prefix web run dev
   ```

4. Open [the Task Manager](http://localhost:3000) and choose **Add task**. The API serves the task list at [localhost:3001/tasks](http://localhost:3001/tasks).

### Environment variables and storage

The commands above are enough for local setup. If you use another API port or host, set `TASK_API_URL` in `web/.env.local` to the API's base URL, for example `TASK_API_URL=http://localhost:3002`, then restart Next.js.

NestJS stores tasks in memory. The API starts with an empty list, and restarting it clears all tasks.

## Decisions

- I chose in-memory storage so a fresh clone can run without a database or migrations.
- I used NestJS DTOs and `class-validator` for request validation. Create and edit share the rules for description, status, and due date, while edits can omit fields they leave unchanged.
- I call NestJS from the Next.js server so the browser uses a single origin for the page and task actions. The table reloads its data after a successful mutation.
- I reused one dialog for creating and editing tasks so both flows use the same fields and error handling. Delete has its own confirmation dialog so the user can cancel before the request is sent.

## How I used AI

I used OpenAI Codex to help build and test the Next.js frontend. With Codex, I replaced the generated welcome page with a task table and status badges. I used one shadcn/ui form for both creating and editing tasks, kept the user's input when a save failed, and added a separate delete confirmation dialog.