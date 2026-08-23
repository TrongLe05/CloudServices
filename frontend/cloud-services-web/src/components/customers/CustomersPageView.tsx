import * as React from "react";
import { CustomerHero } from "./CustomerHero";
import { CustomerLogos } from "./CustomerLogos";
import { CustomerTestimonials, TestimonialItem } from "./CustomerTestimonials";
import { CustomerServiceQRs, ServicePlanItem } from "./CustomerServiceQRs";
import { CustomerCTA } from "./CustomerCTA";

interface CustomersPageViewProps {
  initialTestimonials?: TestimonialItem[];
  initialPlans?: ServicePlanItem[];
}

export function CustomersPageView({
  initialTestimonials = [],
  initialPlans = [],
}: CustomersPageViewProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Semantic Hero Section */}
      <CustomerHero />

      {/* 2. Enterprise Logos & Trust Standards */}
      <CustomerLogos />

      {/* 3. Customer Testimonials & Reviews Grid */}
      <CustomerTestimonials initialTestimonials={initialTestimonials} />

      {/* 4. Interactive Service Package QR Code Explorer */}
      <CustomerServiceQRs initialPlans={initialPlans} />

      {/* 5. Bottom Call to Action Section */}
      <CustomerCTA />
    </main>
  );
}
