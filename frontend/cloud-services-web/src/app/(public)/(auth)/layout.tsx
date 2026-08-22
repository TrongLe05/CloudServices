import { Toaster } from "@/components/ui/toast";
import { SessionProvider } from "next-auth/react";

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          {children}
          <Toaster />
        </div>
      </div>
    </SessionProvider>
  );
}
