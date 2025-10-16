import { api } from "@/lib/api";

export type GetLeadProps = {
  phone: string;
  crmId: string;
};

export async function getLead(data: GetLeadProps) {
  const { data: res } = await api.post("/get_lead", data);

  return res;
}
