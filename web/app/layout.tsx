import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Manage your tasks, their status, and their due dates.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="min-h-full antialiased">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
