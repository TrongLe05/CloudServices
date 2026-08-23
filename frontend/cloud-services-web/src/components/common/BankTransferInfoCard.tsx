"use client";

import * as React from "react";
import { Copy, Check, Building2, User, CreditCard, DollarSign, FileText } from "lucide-react";
import { getBankName, formatVND } from "@/lib/formatUtils";
import { toast } from "@/components/ui/toast";

export interface BankTransferInfoCardProps {
  accountNumber?: string | null;
  accountName?: string | null;
  bin?: string | null;
  amount: number;
  description: string;
  className?: string;
}

export function BankTransferInfoCard({
  accountNumber,
  accountName,
  bin,
  amount,
  description,
  className = "",
}: BankTransferInfoCardProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const handleCopy = (text: string, field: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.add({
      title: "Đã sao chép",
      description: `Đã chép ${label} vào bộ nhớ tạm.`,
      type: "success",
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const bankDisplayName = getBankName(bin);

  const transferRows = [
    {
      id: "bank",
      label: "Ngân hàng thụ hưởng",
      value: bankDisplayName,
      copyValue: bankDisplayName,
      icon: Building2,
      canCopy: false,
      highlight: false,
    },
    {
      id: "accountNumber",
      label: "Số tài khoản",
      value: accountNumber || "Chưa có",
      copyValue: accountNumber || "",
      icon: CreditCard,
      canCopy: Boolean(accountNumber),
      highlight: true,
    },
    {
      id: "accountName",
      label: "Tên chủ tài khoản",
      value: accountName || "CLOUDTOPS VIETNAM",
      copyValue: accountName || "CLOUDTOPS VIETNAM",
      icon: User,
      canCopy: Boolean(accountName),
      highlight: false,
    },
    {
      id: "amount",
      label: "Số tiền chính xác",
      value: formatVND(amount),
      copyValue: String(amount),
      icon: DollarSign,
      canCopy: true,
      highlight: true,
    },
    {
      id: "description",
      label: "Nội dung chuyển khoản",
      value: description,
      copyValue: description,
      icon: FileText,
      canCopy: true,
      highlight: true,
    },
  ];

  return (
    <dl className={`space-y-3 ${className}`}>
      {transferRows.map((row) => {
        const Icon = row.icon;
        const isCopied = copiedField === row.id;

        return (
          <div
            key={row.id}
            className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
              row.highlight
                ? "bg-slate-50 border-slate-200/90 hover:border-primary/40 hover:bg-indigo-50/20"
                : "bg-white border-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <Icon className="size-4 text-slate-500" />
              </div>
              <div>
                <dt className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {row.label}
                </dt>
                <dd
                  className={`text-xs font-bold ${
                    row.id === "amount"
                      ? "text-primary text-sm font-extrabold"
                      : row.id === "description"
                      ? "text-indigo-600 font-mono"
                      : "text-slate-800"
                  }`}
                >
                  {row.value}
                </dd>
              </div>
            </div>

            {row.canCopy && (
              <button
                type="button"
                onClick={() => handleCopy(row.copyValue, row.id, row.label)}
                className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                  isCopied
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
                title={`Sao chép ${row.label}`}
              >
                {isCopied ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" />
                    <span className="text-[10px]">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        );
      })}
    </dl>
  );
}
