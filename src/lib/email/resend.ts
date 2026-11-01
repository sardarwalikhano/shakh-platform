import { Resend } from "resend";

export type ResendRecipient = string;

export type TransactionalEmailRequest = {
  to: ResendRecipient;
  subject: string;
  react: React.ReactElement;
  idempotencyKey: string;
  category: "order" | "merchant" | "delivery" | "platform";
};

export type TransactionalEmailResult = {
  id: string;
};

function getEmailConfiguration() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const replyTo = process.env.RESEND_REPLY_TO;

  if (!apiKey) {
    throw new Error("Email service is not configured: RESEND_API_KEY is missing.");
  }
  if (!from || from.includes("\r") || from.includes("\n")) {
    throw new Error("Email service is not configured: RESEND_FROM_EMAIL is missing or invalid.");
  }

  return { apiKey, from, replyTo };
}

function assertEmailAddress(value: string): void {
  if (
    value.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
    value.includes("\r") ||
    value.includes("\n")
  ) {
    throw new Error("A valid recipient email address is required.");
  }
}

export async function sendTransactionalEmail(
  input: TransactionalEmailRequest,
): Promise<TransactionalEmailResult> {
  assertEmailAddress(input.to);

  if (
    !input.idempotencyKey ||
    input.idempotencyKey.length > 256 ||
    input.idempotencyKey.includes("\r") ||
    input.idempotencyKey.includes("\n")
  ) {
    throw new Error("A stable idempotency key of at most 256 characters is required.");
  }

  const config = getEmailConfiguration();
  const resend = new Resend(config.apiKey);

  const { data, error } = await resend.emails.send(
    {
      from: config.from,
      to: [input.to],
      subject: input.subject,
      react: input.react,
      ...(config.replyTo ? { replyTo: [config.replyTo] } : {}),
      tags: [
        { name: "application", value: "shakh" },
        { name: "category", value: input.category },
      ],
    },
    { idempotencyKey: input.idempotencyKey },
  );

  if (error) {
    // Keep provider diagnostics in server logs; never return recipient or provider payload to the browser.
    console.error("Resend transactional email failed.", {
      name: error.name,
      message: error.message,
      category: input.category,
    });
    throw new Error("The notification email could not be sent.");
  }

  if (!data?.id) {
    throw new Error("The email provider returned no message identifier.");
  }

  return { id: data.id };
}
