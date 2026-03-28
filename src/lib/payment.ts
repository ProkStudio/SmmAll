import crypto from "crypto";

export function robokassaSignature(
  outSum: string,
  invoiceId: string,
  password: string,
  isResult = false,
) {
  const base = isResult
    ? `${outSum}:${invoiceId}:${password}`
    : `${process.env.ROBOKASSA_LOGIN}:${outSum}:${invoiceId}:${password}`;
  return crypto.createHash("md5").update(base).digest("hex");
}

export function verifyRobokassaResultSignature(outSum: string, invoiceId: string, signature: string) {
  const expected = robokassaSignature(outSum, invoiceId, process.env.ROBOKASSA_PASSWORD_2 ?? "", true);
  return expected.toLowerCase() === signature.toLowerCase();
}

export function buildRobokassaUrl(params: { amount: string; invoiceId: string; description: string }) {
  const signature = robokassaSignature(params.amount, params.invoiceId, process.env.ROBOKASSA_PASSWORD_1 ?? "");
  const url = new URL("https://auth.robokassa.ru/Merchant/Index.aspx");
  url.searchParams.set("MerchantLogin", process.env.ROBOKASSA_LOGIN ?? "");
  url.searchParams.set("OutSum", params.amount);
  url.searchParams.set("InvId", params.invoiceId);
  url.searchParams.set("Description", params.description);
  url.searchParams.set("SignatureValue", signature);
  return url.toString();
}
