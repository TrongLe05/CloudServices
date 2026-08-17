import { ServiceNavigation } from "@/components/services/ServiceNavigation";

export const metadata = {
  title: "Dịch vụ - Cloud Services",
  description: "",
};

const ServiceLayout = ({ children }: LayoutProps<"/dich-vu">) => {
  return (
    <div>
      <ServiceNavigation />
      {children}
    </div>
  );
};

export default ServiceLayout;
