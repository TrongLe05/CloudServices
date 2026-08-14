import { Card, CardContent } from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function CardWrapper({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {children}
        </CardContent>
        <div className="relative hidden bg-muted md:block">
          <Image
            src="/next.svg"
            alt="Image"
            width={400}
            height={400}
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </Card>
      <FieldDescription className="px-6 text-center">
        Bằng cách tiếp tục, bạn đồng ý với{" "}
        <Link href="#">Điều khoản dịch vụ</Link> và{" "}
        <Link href="#">Chính sách bảo mật</Link> của chúng tôi.
      </FieldDescription>
    </div>
  );
}
