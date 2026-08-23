import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { CardWrapper } from "@/components/auth/CardWrapper";

export default function LoginPage() {
  return (
    <CardWrapper>
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Đang tải biểu mẫu...</div>}>
        <LoginForm />
      </Suspense>
    </CardWrapper>
  );
}
