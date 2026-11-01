import { TransactionalEmail } from "@/emails/transactional-email";
import { sendTransactionalEmail } from "@/lib/email/resend";

export type OrderEmailBase = {
  recipient: string;
  orderId: string;
  orderNumber: string;
  customerName?: string;
};

export type OrderConfirmationEmailInput = OrderEmailBase & {
  totalIqd: number | string | bigint;
};

export type MerchantOrderEmailInput = OrderEmailBase & {
  storeName: string;
  itemsCount: number;
};

export type CaptainAssignmentEmailInput = OrderEmailBase & {
  captainName?: string;
  pickupStore: string;
  deliveryArea: string;
};

function getAppUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is required for email action links.");
  }

  const url = new URL(path, baseUrl);
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error("Email action links must use HTTPS.");
  }

  return url.toString();
}

function formatIqd(value: number | string | bigint): string {
  const raw = typeof value === "bigint" ? value.toString() : String(value);
  if (!/^\d+$/.test(raw)) {
    throw new Error("Order total must be a non-negative integer IQD amount.");
  }

  return `${new Intl.NumberFormat("ar-IQ").format(BigInt(raw))} د.ع`;
}

function assertSafeIdentifier(value: string, field: string): void {
  if (!value.trim() || value.length > 120 || /[\r\n]/.test(value)) {
    throw new Error(`${field} is invalid.`);
  }
}

export async function sendOrderConfirmationEmail(input: OrderConfirmationEmailInput) {
  assertSafeIdentifier(input.orderId, "orderId");
  assertSafeIdentifier(input.orderNumber, "orderNumber");

  return sendTransactionalEmail({
    to: input.recipient,
    subject: `پشتڕاستکردنەوەی داواکاری ${input.orderNumber}`,
    category: "order",
    idempotencyKey: `order-confirmation/${input.orderId}`,
    react: (
      <TransactionalEmail
        preview={`داواکاری ${input.orderNumber} وەرگیرا.`}
        greeting={input.customerName ? `بەڕێز ${input.customerName}` : undefined}
        heading="داواکارییەکەت وەرگیرا"
        message="سوپاس بۆ کڕینت لە SHAKH. داواکارییەکەت تۆمار کراوە و لە ئێستادا لە قۆناغی ئامادەکردندایە."
        details={[
          { label: "ژمارەی داواکاری", value: input.orderNumber },
          { label: "کۆی گشتی", value: formatIqd(input.totalIqd) },
        ]}
        actionLabel="بینینی داواکاری"
        actionUrl={getAppUrl(`/workspace/customer/orders/${encodeURIComponent(input.orderId)}`)}
      />
    ),
  });
}

export async function sendMerchantNewOrderEmail(input: MerchantOrderEmailInput) {
  assertSafeIdentifier(input.orderId, "orderId");
  assertSafeIdentifier(input.orderNumber, "orderNumber");
  assertSafeIdentifier(input.storeName, "storeName");

  if (!Number.isInteger(input.itemsCount) || input.itemsCount < 1) {
    throw new Error("itemsCount must be a positive integer.");
  }

  return sendTransactionalEmail({
    to: input.recipient,
    subject: `داواکارییەکی نوێ بۆ ${input.storeName}`,
    category: "merchant",
    idempotencyKey: `merchant-new-order/${input.orderId}`,
    react: (
      <TransactionalEmail
        preview={`داواکارییەکی نوێ ${input.orderNumber} بۆ فرۆشگاکەت.`}
        greeting={input.storeName}
        heading="داواکارییەکی نوێت هەیە"
        message="کڕیارێک داواکارییەکی نوێی تۆمار کردووە. تکایە بچۆرە ناو داشبۆردەکەت و داواکارییەکە پشکنین بکە."
        details={[
          { label: "ژمارەی داواکاری", value: input.orderNumber },
          { label: "ژمارەی دانە", value: String(input.itemsCount) },
        ]}
        actionLabel="کردنەوەی داشبۆرد"
        actionUrl={getAppUrl(`/workspace/merchant/orders/${encodeURIComponent(input.orderId)}`)}
      />
    ),
  });
}

export async function sendCaptainAssignmentEmail(input: CaptainAssignmentEmailInput) {
  assertSafeIdentifier(input.orderId, "orderId");
  assertSafeIdentifier(input.orderNumber, "orderNumber");
  assertSafeIdentifier(input.pickupStore, "pickupStore");
  assertSafeIdentifier(input.deliveryArea, "deliveryArea");

  return sendTransactionalEmail({
    to: input.recipient,
    subject: `ئەرکی گەیاندنی نوێ ${input.orderNumber}`,
    category: "delivery",
    idempotencyKey: `captain-assignment/${input.orderId}`,
    react: (
      <TransactionalEmail
        preview={`ئەرکێکی نوێ بۆ گەیاندن پێت سپێردراوە.`}
        greeting={input.captainName ? `کاپتنی بەڕێز ${input.captainName}` : "کاپتنی بەڕێز"}
        heading="ئەرکی گەیاندنی نوێت هەیە"
        message="ئەم داواکارییە بۆ گەیاندن پێت سپێردراوە. وردەکارییەکانی شوێن و ڕێڕەو لە داشبۆردەکەت ببینە."
        details={[
          { label: "ژمارەی داواکاری", value: input.orderNumber },
          { label: "شوێنی وەرگرتن", value: input.pickupStore },
          { label: "ناوچەی گەیاندن", value: input.deliveryArea },
        ]}
        actionLabel="بینینی ئەرکی گەیاندن"
        actionUrl={getAppUrl(`/workspace/captain/deliveries/${encodeURIComponent(input.orderId)}`)}
      />
    ),
  });
}

export async function sendPlatformAdminAlertEmail(input: {
  recipient: string;
  heading: string;
  message: string;
  reference: string;
  idempotencyKey: string;
}) {
  assertSafeIdentifier(input.reference, "reference");

  return sendTransactionalEmail({
    to: input.recipient,
    subject: `ئاگادارکردنەوەی SHAKH: ${input.heading}`,
    category: "platform",
    idempotencyKey: input.idempotencyKey,
    react: (
      <TransactionalEmail
        preview={input.heading}
        heading={input.heading}
        message={input.message}
        details={[{ label: "ژمارەی پەیوەندیدار", value: input.reference }]}
        actionLabel="چوونە ناو پلاتفۆرم"
        actionUrl={getAppUrl("/workspace/super-admin")}
      />
    ),
  });
}
