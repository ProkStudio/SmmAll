import axios from "axios";

export async function createMoreThanPanelOrder(serviceId: number, link: string, quantity: number) {
  const url = `https://morethanpanel.com/api/v2?key=${process.env.MORETHANPANEL_KEY ?? ""}`;
  const { data } = await axios.post(url, {
    action: "add",
    service: serviceId,
    link,
    quantity,
  });
  return data;
}

export async function getMoreThanPanelBalance() {
  const url = `https://morethanpanel.com/api/v2?key=${process.env.MORETHANPANEL_KEY ?? ""}`;
  const { data } = await axios.post(url, { action: "balance" });
  return data;
}

export async function getMoreThanPanelOrderStatus(orderId: string) {
  const url = `https://morethanpanel.com/api/v2?key=${process.env.MORETHANPANEL_KEY ?? ""}`;
  const { data } = await axios.post(url, { action: "status", order: orderId });
  return data as { status?: string; remains?: number; charge?: string | number };
}
