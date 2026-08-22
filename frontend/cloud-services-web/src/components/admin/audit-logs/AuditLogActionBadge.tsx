import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface HttpMethodBadgeProps {
  method: string;
}

export function HttpMethodBadge({ method }: HttpMethodBadgeProps) {
  const m = method.toUpperCase();

  switch (m) {
    case "GET":
      return (
        <Badge
          variant="outline"
          className="font-mono text-[10px] font-bold border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
        >
          GET
        </Badge>
      );
    case "POST":
      return (
        <Badge
          variant="outline"
          className="font-mono text-[10px] font-bold border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
        >
          POST
        </Badge>
      );
    case "PUT":
      return (
        <Badge
          variant="outline"
          className="font-mono text-[10px] font-bold border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
        >
          PUT
        </Badge>
      );
    case "PATCH":
      return (
        <Badge
          variant="outline"
          className="font-mono text-[10px] font-bold border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
        >
          PATCH
        </Badge>
      );
    case "DELETE":
      return (
        <Badge
          variant="outline"
          className="font-mono text-[10px] font-bold border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
        >
          DELETE
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="font-mono text-[10px] font-bold">
          {m}
        </Badge>
      );
  }
}

interface StatusCodeBadgeProps {
  statusCode: number;
  isSuccess?: boolean;
}

export function StatusCodeBadge({ statusCode }: StatusCodeBadgeProps) {
  if (statusCode >= 200 && statusCode < 300) {
    return (
      <Badge
        variant="outline"
        className="gap-1 font-mono text-[11px] font-bold border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
      >
        <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
        <span>{statusCode} OK</span>
      </Badge>
    );
  }

  if (statusCode >= 300 && statusCode < 400) {
    return (
      <Badge
        variant="outline"
        className="gap-1 font-mono text-[11px] font-bold border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
      >
        <span>{statusCode} Redirect</span>
      </Badge>
    );
  }

  if (statusCode >= 400 && statusCode < 500) {
    return (
      <Badge
        variant="outline"
        className="gap-1 font-mono text-[11px] font-bold border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
      >
        <AlertCircle className="size-3 text-amber-600 dark:text-amber-400" />
        <span>{statusCode} Client Error</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1 font-mono text-[11px] font-bold border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
    >
      <XCircle className="size-3 text-rose-600 dark:text-rose-400" />
      <span>{statusCode} Error</span>
    </Badge>
  );
}
