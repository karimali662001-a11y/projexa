import nodemailer from "nodemailer";
import { logEmailNotification } from "./db";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!transporter) {
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpUser || !smtpPassword) {
      console.warn("[Email] SMTP credentials not configured");
      return null;
    }

    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
  }
  return transporter;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  type: "registration" | "order_confirmation" | "order_status_update" | "admin_alert";
  orderId?: number;
  userId?: number;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Email] Transporter not available");
    return false;
  }

  try {
    const fromEmail = process.env.SMTP_FROM_EMAIL || "noreply@projexa.com";
    const fromName = process.env.SMTP_FROM_NAME || "Projexa Store";

    const mailOptions = {
      from: `${fromName} <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await logEmailNotification({
      recipientEmail: options.to,
      subject: options.subject,
      type: options.type,
      orderId: options.orderId,
      userId: options.userId,
      status: "pending",
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("[Email] Message sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    return false;
  }
}

export function getRegistrationEmailTemplate(userName: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Projexa Store!</h1>
    </div>
    <div class="content">
      <p>Hello ${userName},</p>
      <p>Thank you for registering with Projexa Store. Your account has been successfully created.</p>
      <p>You can now browse our products and place orders.</p>
      <p>Best regards,<br>Projexa Store Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Projexa Store. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

export function getOrderConfirmationEmailTemplate(
  customerName: string,
  orderId: number,
  totalAmount: number,
  paymentMethod: string
): string {
  const amountInEGP = (totalAmount / 100).toFixed(2);
  const paymentMethodDisplay =
    paymentMethod === "vodafone_cash"
      ? "Vodafone Cash"
      : paymentMethod === "instapay"
        ? "InstaPay"
        : "Manual Payment";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
    .order-details { background-color: white; padding: 15px; border: 1px solid #ddd; margin: 15px 0; border-radius: 5px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: bold; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmation</h1>
    </div>
    <div class="content">
      <p>Hello ${customerName},</p>
      <p>Thank you for your order!</p>
      <div class="order-details">
        <div class="detail-row">
          <span class="label">Order ID:</span>
          <span>#${orderId}</span>
        </div>
        <div class="detail-row">
          <span class="label">Total Amount:</span>
          <span>EGP ${amountInEGP}</span>
        </div>
        <div class="detail-row">
          <span class="label">Payment Method:</span>
          <span>${paymentMethodDisplay}</span>
        </div>
      </div>
      <p>Your order has been received. You will receive further updates via email.</p>
      <p>Best regards,<br>Projexa Store Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Projexa Store. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

export function getOrderStatusUpdateEmailTemplate(
  customerName: string,
  orderId: number,
  status: string
): string {
  const statusMessages: Record<string, string> = {
    confirmed: "Your order has been confirmed and is being prepared.",
    shipped: "Your order has been shipped!",
    delivered: "Your order has been delivered. Thank you!",
    cancelled: "Your order has been cancelled.",
  };

  const statusMessage = statusMessages[status] || "Your order status has been updated.";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
    .status-badge { display: inline-block; background-color: #4CAF50; color: white; padding: 10px 15px; border-radius: 5px; margin: 10px 0; text-transform: uppercase; font-weight: bold; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Status Update</h1>
    </div>
    <div class="content">
      <p>Hello ${customerName},</p>
      <p>We have an update on your order #${orderId}.</p>
      <div class="status-badge">${status.toUpperCase()}</div>
      <p>${statusMessage}</p>
      <p>Best regards,<br>Projexa Store Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Projexa Store. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

export function getAdminOrderAlertEmailTemplate(
  orderId: number,
  customerName: string,
  customerEmail: string,
  totalAmount: number
): string {
  const amountInEGP = (totalAmount / 100).toFixed(2);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #E91E63; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
    .order-details { background-color: white; padding: 15px; border: 1px solid #ddd; margin: 15px 0; border-radius: 5px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: bold; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Order Alert</h1>
    </div>
    <div class="content">
      <p>A new order has been received!</p>
      <div class="order-details">
        <div class="detail-row">
          <span class="label">Order ID:</span>
          <span>#${orderId}</span>
        </div>
        <div class="detail-row">
          <span class="label">Customer Name:</span>
          <span>${customerName}</span>
        </div>
        <div class="detail-row">
          <span class="label">Customer Email:</span>
          <span>${customerEmail}</span>
        </div>
        <div class="detail-row">
          <span class="label">Total Amount:</span>
          <span>EGP ${amountInEGP}</span>
        </div>
      </div>
      <p>Please log in to your admin dashboard to view and process this order.</p>
      <p>Best regards,<br>Projexa Store System</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Projexa Store. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}
