"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "@/components/ui/toast";
import {
  ServicePlanItem,
  PlanPriceItem,
} from "@/types/plans.types";
import {
  CheckoutFormData,
  CreatedOrderPayOSData,
  CheckoutPageViewProps,
} from "@/types/checkout.types";
import { CheckoutStepper } from "./CheckoutStepper";
import { CheckoutPlanSelector } from "./CheckoutPlanSelector";
import { CheckoutCustomerForm } from "./CheckoutCustomerForm";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";
import { CheckoutPaymentSection } from "./CheckoutPaymentSection";
import { createOrderRequest } from "@/services/order.services";
import { createPayosPaymentLink } from "@/services/payment.services";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ và tên của bạn"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ (tối thiểu 9 số)"),
  companyName: z.string().optional(),
  notes: z.string().optional(),
});

export function CheckoutPageView({
  initialPlans,
  preselectedPlanId,
  preselectedCycle = "Monthly",
  userEmail,
  userName,
}: CheckoutPageViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const effectiveEmail = userEmail || session?.user?.email;
  const effectiveName = userName || session?.user?.name;
  const isLoggedIn = !!effectiveEmail || !!session?.user;

  const [plans] = React.useState<ServicePlanItem[]>(initialPlans);
  const [selectedPlan, setSelectedPlan] = React.useState<ServicePlanItem | null>(() => {
    if (preselectedPlanId) {
      return initialPlans.find((p) => p.id === preselectedPlanId) || initialPlans[0] || null;
    }
    return initialPlans[0] || null;
  });
  const [selectedCycle, setSelectedCycle] = React.useState<string>(preselectedCycle);
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = React.useState<number>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // PayOS Created Order state for Step 3
  const [orderCreatedData, setOrderCreatedData] = React.useState<CreatedOrderPayOSData | null>(null);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: effectiveName || "",
      email: effectiveEmail || "",
      phone: "",
      companyName: "",
      notes: "",
    },
  });

 // Đồng bộ lại form khi session load xong
  React.useEffect(() => {
    if (effectiveName && !form.getValues("fullName")) {
      form.setValue("fullName", effectiveName);
    }
    if (effectiveEmail && !form.getValues("email")) {
      form.setValue("email", effectiveEmail);
    }
  }, [effectiveName, effectiveEmail, form]);
  
  const handleStep1Next = () => {
    if (!selectedPlan) {
      toast.add({
        title: "Chưa chọn gói dịch vụ",
        description: "Vui lòng chọn 1 gói cấu hình đám mây để tiếp tục.",
        type: "error",
      });
      return;
    }
    setCurrentStep(2);
    setMaxAccessibleStep((prev) => Math.max(prev, 2));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep2Submit = async () => {
     // 1. Kiểm tra đăng nhập trước khi tạo đơn
    if (!isLoggedIn) {
      toast.add({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập tài khoản trước khi tạo đơn để hệ thống tự động gán dịch vụ vào tài khoản của bạn.",
        type: "error",
      });
      const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/dang-nhap?callbackUrl=${currentUrl}`);
      return;
    }

    const isValid = await form.trigger();
    if (!isValid) {
      toast.add({
        title: "Thông tin chưa hợp lệ",
        description: "Vui lòng kiểm tra lại các trường bắt buộc trong form liên hệ.",
        type: "error",
      });
      return;
    }

    if (!selectedPlan) return;

    const formData = form.getValues();

    try {
      setIsSubmitting(true);

      // 2. Tạo đơn hàng dịch vụ qua API
      const orderPayload = {
        servicePlanId: selectedPlan.id,
        billingCycle: selectedCycle,
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName || null,
        notes: formData.notes || null,
      };

      const orderRes = await createOrderRequest(orderPayload);

      if (!orderRes.ok) {
        const errJson = await orderRes.json().catch(() => ({}));
        if (orderRes.status === 401) {
          toast.add({
            title: "Yêu cầu đăng nhập",
            description: errJson.message || "Vui lòng đăng nhập tài khoản trước khi đặt dịch vụ.",
            type: "error",
          });
          const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
          router.push(`/dang-nhap?callbackUrl=${currentUrl}`);
          return;
        }
        throw new Error(errJson.message || "Không thể khởi tạo đơn hàng. Vui lòng thử lại.");
      }

      const orderData = await orderRes.json();
      const orderId = orderData.id || orderData.Id;

      // 3. Tạo link & mã QR VietQR PayOS
      const paymentRes = await createPayosPaymentLink({
        orderId,
        returnUrl: `${window.location.origin}/don-hang?status=success`,
        cancelUrl: `${window.location.origin}/don-hang?status=cancelled`,
      });

      if (!paymentRes.ok) {
        const errJson = await paymentRes.json().catch(() => ({}));
        if (paymentRes.status === 401) {
          toast.add({
            title: "Yêu cầu đăng nhập",
            description: errJson.message || "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.",
            type: "error",
          });
          const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
          router.push(`/dang-nhap?callbackUrl=${currentUrl}`);
          return;
        }
        throw new Error(errJson.message || "Không thể khởi tạo cổng thanh toán PayOS.");
      }

      const paymentData = await paymentRes.json();

      setOrderCreatedData({
        orderId,
        orderCode: paymentData.orderCode,
        amount: paymentData.amount,
        qrCodeString: paymentData.qrCode,
        vietQrUrl: paymentData.vietQrUrl,
        accountNumber: paymentData.accountNumber,
        accountName: paymentData.accountName,
        bin: paymentData.bin,
        checkoutUrl: paymentData.checkoutUrl,
        description: paymentData.description,
        planName: selectedPlan.name,
        createdAt: new Date().toISOString(),
      });

      // Chuyển sang Bước 3: Thanh toán
      setCurrentStep(3);
      setMaxAccessibleStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });

      toast.add({
        title: "Tạo đơn thành công",
        description: "Vui lòng quét mã QR chuyển khoản chính xác để hoàn tất dịch vụ.",
        type: "success",
      });
    } catch (err: unknown) {
      toast.add({
        title: "Lỗi tạo đơn hàng",
        description:
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi không xác định khi tạo đơn.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setMaxAccessibleStep(1);
    setOrderCreatedData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-24 font-sans">
      {/* 1. Breadcrumb Header */}
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-3.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/dich-vu" />}>Dịch vụ đám mây</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Đặt hàng &amp; Thanh toán</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* 2. Main Checkout Container */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-10">
        {/* Stepper Indicator */}
        <CheckoutStepper
          currentStep={currentStep}
          maxAccessibleStep={maxAccessibleStep}
          onSelectStep={(step) => {
            setCurrentStep(step);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        {currentStep === 3 && orderCreatedData ? (
          /* Bước 3: Màn hình thanh toán PayOS VietQR */
          <CheckoutPaymentSection
            orderData={orderCreatedData}
            onReset={handleReset}
          />
        ) : (
          /* Bước 1 & Bước 2: 2-column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cột Trái (8 Cols): Form & Plan Selection */}
            <section className="lg:col-span-8 space-y-6">
              {currentStep === 1 ? (
                <CheckoutPlanSelector
                  plans={plans}
                  selectedPlan={selectedPlan}
                  selectedCycle={selectedCycle}
                  onSelectPlan={(plan) => setSelectedPlan(plan)}
                  onSelectCycle={(cycle) => setSelectedCycle(cycle)}
                  onNext={handleStep1Next}
                />
              ) : (
                <CheckoutCustomerForm
                  form={form}
                  onBack={() => setCurrentStep(1)}
                  onSubmit={handleStep2Submit}
                  isSubmitting={isSubmitting}
                  isLoggedIn={isLoggedIn}
                />
              )}
            </section>

            {/* Cột Phải (4 Cols): Order Summary Sticky Card */}
            <section className="lg:col-span-4">
              <CheckoutOrderSummary
                selectedPlan={selectedPlan}
                selectedCycle={selectedCycle}
                onSubmit={handleStep2Submit}
                isSubmitting={isSubmitting}
                currentStep={currentStep}
              />
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
