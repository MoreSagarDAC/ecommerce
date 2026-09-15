import crypto from "crypto";

export const generateOrderId = () => {
  return `ORD-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
};

export const generateTransactionId = () => {
  return `TXN-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
};
