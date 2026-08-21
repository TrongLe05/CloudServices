"use client";

import * as React from "react";
import { Loader2, QrCode, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ServicePlan, QrCodeData } from "./ServicePlansCRUD";
import Image from "next/image";

interface ServicePlanQrCardProps {
  selectedPlan: ServicePlan | null;
  qrCode: QrCodeData | null;
  loadingQr: boolean;
  onRegenerateQr: () => Promise<void>;
  loading: boolean;
}

export function ServicePlanQrCard({
  selectedPlan,
  qrCode,
  loadingQr,
  onRegenerateQr,
  loading,
}: ServicePlanQrCardProps) {
  if (!selectedPlan) return null;

  return (
    <Card className="shadow-xs border border-border h-fit">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle className="text-lg font-semibold flex items-center gap-1.5">
          <QrCode className="size-5 text-blue-600" /> Mã QR Gói Dịch Vụ
        </CardTitle>
        <CardDescription>
          Mã QR kết nối trực tiếp đến trang thông tin/đăng ký dịch vụ
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
        ) : qrCode ? (
          <>
            <div className="border border-border p-3 rounded-2xl bg-white flex items-center justify-center shadow-xs">
              <Image
                src={`data:image/png;base64,${qrCode.qrCodeBase64}`}
                alt={`Mã QR ${selectedPlan.name}`}
<<<<<<< Updated upstream
=======
                width={144}
                height={144}
>>>>>>> Stashed changes
                className="size-36 object-contain"
              />
            </div>
            <div className="w-full text-center space-y-1">
              <span className="text-xs font-medium text-foreground block">
                Đường dẫn quét QR:
              </span>
              <span className="text-xs text-muted-foreground block truncate max-w-full italic">
                <a
                  href={qrCode.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {qrCode.targetUrl}
                </a>
              </span>
            </div>
            <Button
              onClick={onRegenerateQr}
              size="sm"
              variant="outline"
              className="w-full gap-1.5 mt-1"
              disabled={loading || loadingQr}
            >
              <RefreshCw className="size-3.5" /> Tạo lại mã QR
            </Button>
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground text-xs w-full">
            Chưa cấu hình mã QR cho gói này.
            <Button
              onClick={onRegenerateQr}
              size="sm"
              className="w-full gap-1.5 mt-4"
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
