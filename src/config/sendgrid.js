import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY is missing");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default sgMail;