import api from "@/lib/axios";

export type ContactType = "phone" | "email" | "address" | "hours";

export interface ContactInfo {
  id: number;
  type: ContactType;
  label?: string | null;
  value: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  type: ContactType;
  label?: string;
  value: string;
  order?: number;
}

export const getContactInfo = async (): Promise<{ data: ContactInfo[] }> => {
  const res = await api.get("/contact");
  return res.data;
};

export const createContactInfo = async (data: ContactFormData): Promise<{ data: ContactInfo }> => {
  const res = await api.post("/contact", data);
  return res.data;
};

export const updateContactInfo = async (
  id: number,
  data: Partial<ContactFormData>,
): Promise<{ data: ContactInfo }> => {
  const res = await api.put(`/contact/${id}`, data);
  return res.data;
};

export const deleteContactInfo = async (id: number): Promise<{ data: null }> => {
  const res = await api.delete(`/contact/${id}`);
  return res.data;
};