import { TestimonialItem } from "@/data/testimonials.data";

export interface CreateTestimonialInput {
  name: string;
  role?: string;
  company?: string;
  rating: number;
  content: string;
  avatarUrl?: string | null;
}

export const getTestimonials = async (params?: { isApproved?: boolean }) => {
  const query = new URLSearchParams();
  if (params?.isApproved !== undefined) query.append("isApproved", String(params.isApproved));

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const res = await fetch(`/api/testimonials${queryString}`, {
    next: { revalidate: 120 },
  });
  return res;
};

export const createTestimonial = async (data: CreateTestimonialInput) => {
  const res = await fetch("/api/testimonials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
};
