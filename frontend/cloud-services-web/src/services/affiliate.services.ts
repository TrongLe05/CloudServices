export interface RegisterAffiliateInput {
  fullName: string;
  email: string;
  phone: string;
  websiteUrl?: string | null;
  motivation?: string | null;
}

export const registerAffiliate = async (data: RegisterAffiliateInput) => {
  const res = await fetch("/api/affiliates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
};
