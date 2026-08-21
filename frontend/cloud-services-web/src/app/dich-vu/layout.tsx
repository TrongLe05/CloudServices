import { ServiceNavigation } from "@/components/services/ServiceNavigation";

export const metadata = {
  title: "Dịch vụ - Cloud Services",
  description: "",
};

const ServiceLayout = ({ children }: LayoutProps<"/dich-vu">) => {
  return (
    <div>
      <div className="hidden md:block">
        <ServiceNavigation />
      </div>
      {children}
    </div>
  );
};

export default ServiceLayout;
