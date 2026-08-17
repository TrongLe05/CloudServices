import { Separator } from "@/components/ui/separator";
import { Hero } from "@/components/landing/Hero";
import { Promotions } from "@/components/landing/Promotions";
import { Services } from "@/components/landing/Services";
import { FeaturedPlans } from "@/components/landing/FeaturedPlans";
import { Configurator } from "@/components/landing/Configurator";
import { UptimeSla } from "@/components/landing/UptimeSla";
import { LatestNews } from "@/components/landing/LatestNews";
import { SupportContact } from "@/components/landing/SupportContact";

export default function Home() {
  return (
    <main className="flex-1 w-full bg-background font-sans overflow-x-hidden">
      {/* Hero Banner Section */}
      <Hero />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Promotions & Campaigns Section */}
      <Promotions />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Core Services Grid Section */}
      <Services />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Pre-configured Featured Pricing Plans Section */}
      <FeaturedPlans />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Interactive Resource Configurator Calculator Section */}
      <Configurator />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Network Stability & SLA Commitments Section */}
      <UptimeSla />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Latest Technical Articles & News Section */}
      <LatestNews />
      <Separator className="bg-zinc-200/60 max-w-7xl mx-auto" />

      {/* Solutions Consultant & Direct Hotline Support Section */}
      <SupportContact />
    </main>
  );
}
