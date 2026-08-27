"use client";

import * as React from "react";
import { Loader2, QrCode, RefreshCw, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ServicePlan, QrCodeData } from "./ServicePlansCRUD";

interface ServicePlanQrCardProps {
  selectedPlan: ServicePlan | null;
  qrCode: QrCodeData | null;
  loadingQr: boolean;
  onRegenerateQr: (customDomain?: string) => Promise<void>;
  loading: boolean;
}

export function ServicePlanQrCard({
  selectedPlan,
  qrCode,
  loadingQr,
  onRegenerateQr,
  loading,
}: ServicePlanQrCardProps) {
  const [customDomain, setCustomDomain] = React.useState<string>("");
  const [isEditingDomain, setIsEditingDomain] = React.useState(false);

  // Cập nhật giá trị domain mặc định từ targetUrl hiện tại
  React.useEffect(() => {
    if (qrCode?.targetUrl) {
      try {
        const urlObj = new URL(qrCode.targetUrl);
        setCustomDomain(`${urlObj.protocol}//${urlObj.host}`);
      } catch {
        setCustomDomain("https://cloudservices.vn");
      }
    } else {
      setCustomDomain("https://cloudservices.vn");
    }
  }, [qrCode]);

  if (!selectedPlan) return null;

  // Xử lý chuẩn chuỗi ảnh Base64
  const qrImageSrc = React.useMemo(() => {
    if (!qrCode?.qrCodeBase64) return "";
    return qrCode.qrCodeBase64.startsWith("data:")
      ? qrCode.qrCodeBase64
      : `data:image/png;base64,${qrCode.qrCodeBase64}`;
  }, [qrCode]);

  const handleCreateOrRegenerate = async () => {
    await onRegenerateQr(customDomain.trim());
    setIsEditingDomain(false);
  };

  return (
    <Card className="shadow-xs border border-border h-fit">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle className="text-lg font-semibold flex items-center gap-1.5">
          <QrCode className="size-5 text-blue-600" /> Mã QR Gói Dịch Vụ
        </CardTitle>
        <CardDescription>
          Mã QR liên kết trực tiếp đến trang thông tin gói dịch vụ theo slug
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col items-center gap-4">
        {loadingQr ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-2">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">
              Đang tải mã QR...
            </span>
          </div>
        ) : qrImageSrc ? (
          <>
            <div className="border border-border p-3 rounded-2xl bg-white flex items-center justify-center shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrImageSrc}
                alt={`Mã QR ${selectedPlan.name}`}
                width={144}
                height={144}
                className="size-36 object-contain"
              />
            </div>

            {/* Target URL Display & Custom Domain Setting */}
            <div className="w-full space-y-3 pt-1">
              <div className="space-y-1 text-left">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <ExternalLink className="size-3 text-primary" /> Đường dẫn đích:
                </span>
                <span className="text-xs text-muted-foreground block break-all italic bg-muted/40 p-2 rounded-lg border border-border">
                  <a
                    href={qrCode?.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {qrCode?.targetUrl}
                  </a>
                </span>
              </div>

              {/* Custom Domain Input */}
              <div className="space-y-1.5 text-left border-t border-border pt-3">
                <Label htmlFor="custom-domain" className="text-xs flex items-center gap-1 font-semibold text-foreground">
                  <Globe className="size-3.5 text-slate-500" /> Tên miền tùy biến (Domain):
                </Label>
                <div className="flex items-center gap-1.5">
                  <Input
                    id="custom-domain"
                    type="url"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="https://cloudservices.vn"
                    className="h-8 text-xs font-mono"
                    disabled={loading || loadingQr}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Hỗ trợ đổi tên miền (VD: <code>http://localhost:3000</code> hoặc <code>https://my-brand.com</code>) khi tạo QR.
                </p>
              </div>
            </div>

            <Button
              onClick={handleCreateOrRegenerate}
              size="sm"
              variant="outline"
              className="w-full gap-1.5 mt-1"
              disabled={loading || loadingQr}
            >
              <RefreshCw className="size-3.5" /> Tạo lại mã QR theo tên miền này
            </Button>
          </>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-xs w-full space-y-3">
            <p>Chưa cấu hình mã QR cho gói này.</p>
            
            <div className="text-left space-y-1 border border-border p-3 rounded-xl bg-muted/20">
              <Label htmlFor="custom-domain-init" className="text-xs flex items-center gap-1 font-semibold text-foreground">
                <Globe className="size-3.5 text-slate-500" /> Tên miền mong muốn:
              </Label>
              <Input
                id="custom-domain-init"
                type="url"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="https://cloudservices.vn"
                className="h-8 text-xs font-mono bg-white"
                disabled={loading || loadingQr}
              />
            </div>

            <Button
              onClick={handleCreateOrRegenerate}
              size="sm"
              className="w-full gap-1.5"
              disabled={loading || loadingQr}
            >
              Khởi tạo mã QR
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
