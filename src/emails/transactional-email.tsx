import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";

export type EmailDetail = {
  label: string;
  value: string;
};

export type TransactionalEmailProps = {
  preview: string;
  heading: string;
  greeting?: string;
  message: string;
  details?: EmailDetail[];
  actionLabel?: string;
  actionUrl?: string;
  footerNote?: string;
};

const colors = {
  forest: "#14532d",
  green: "#16a34a",
  ink: "#0f172a",
  muted: "#64748b",
  paper: "#f8fafc",
  line: "#e2e8f0",
  white: "#ffffff",
};

export function TransactionalEmail({
  preview,
  heading,
  greeting,
  message,
  details = [],
  actionLabel,
  actionUrl,
  footerNote = "ئەم نامەیە بە شێوەی ئۆتۆماتیکی لەلایەن SHAKH نێردراوە.",
}: TransactionalEmailProps) {
  return (
    <Html lang="ckb" dir="rtl">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: "24px 12px",
          backgroundColor: colors.paper,
          color: colors.ink,
          fontFamily: "Tahoma, Arial, sans-serif",
          direction: "rtl",
        }}
      >
        <Container
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "0",
            backgroundColor: colors.white,
            border: `1px solid ${colors.line}`,
            borderRadius: "18px",
            overflow: "hidden",
          }}
        >
          <Section
            style={{
              padding: "26px 30px",
              backgroundColor: colors.forest,
              textAlign: "right",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#bbf7d0",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "2px",
              }}
            >
              بازاڕی یەکگرتوو
            </Text>
            <Heading
              as="h1"
              style={{
                margin: "8px 0 0",
                color: colors.white,
                fontSize: "25px",
                fontWeight: 800,
                letterSpacing: "2px",
              }}
            >
              SHAKH
            </Heading>
          </Section>

          <Section style={{ padding: "32px 30px 24px", textAlign: "right" }}>
            {greeting ? (
              <Text
                style={{
                  margin: "0 0 12px",
                  color: colors.green,
                  fontSize: "13px",
                  fontWeight: 700,
                  lineHeight: "1.8",
                }}
              >
                {greeting}
              </Text>
            ) : null}
            <Heading
              as="h2"
              style={{
                margin: "0 0 14px",
                color: colors.ink,
                fontSize: "22px",
                fontWeight: 800,
                lineHeight: "1.7",
              }}
            >
              {heading}
            </Heading>
            <Text
              style={{
                margin: 0,
                color: colors.muted,
                fontSize: "14px",
                lineHeight: "2",
                whiteSpace: "pre-line",
              }}
            >
              {message}
            </Text>
          </Section>

          {details.length > 0 ? (
            <Section style={{ padding: "0 30px 24px" }}>
              <Section
                style={{
                  padding: "16px 18px",
                  backgroundColor: "#f8fafc",
                  border: `1px solid ${colors.line}`,
                  borderRadius: "12px",
                }}
              >
                {details.map((detail, index) => (
                  <Section
                    key={`${detail.label}-${index}`}
                    style={{
                      padding: "7px 0",
                      borderBottom:
                        index === details.length - 1
                          ? "none"
                          : `1px solid ${colors.line}`,
                    }}
                  >
                    <Text
                      style={{
                        display: "inline-block",
                        width: "42%",
                        margin: 0,
                        color: colors.muted,
                        fontSize: "12px",
                        lineHeight: "1.8",
                        verticalAlign: "top",
                      }}
                    >
                      {detail.label}
                    </Text>
                    <Text
                      style={{
                        display: "inline-block",
                        width: "58%",
                        margin: 0,
                        color: colors.ink,
                        fontSize: "12px",
                        fontWeight: 700,
                        lineHeight: "1.8",
                        textAlign: "left",
                        direction: "ltr",
                        verticalAlign: "top",
                      }}
                    >
                      {detail.value}
                    </Text>
                  </Section>
                ))}
              </Section>
            </Section>
          ) : null}

          {actionLabel && actionUrl ? (
            <Section style={{ padding: "0 30px 28px", textAlign: "right" }}>
              <Button
                href={actionUrl}
                style={{
                  display: "inline-block",
                  padding: "13px 22px",
                  borderRadius: "10px",
                  backgroundColor: colors.green,
                  color: colors.white,
                  fontSize: "13px",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxSizing: "border-box",
                }}
              >
                {actionLabel}
              </Button>
            </Section>
          ) : null}

          <Hr style={{ margin: 0, borderColor: colors.line }} />
          <Section style={{ padding: "18px 30px 22px", textAlign: "right" }}>
            <Text
              style={{
                margin: 0,
                color: colors.muted,
                fontSize: "10px",
                lineHeight: "1.9",
              }}
            >
              {footerNote}
            </Text>
            <Text
              style={{
                margin: "8px 0 0",
                color: colors.forest,
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              SHAKH · لە یەک شوێن، بۆ هەمووان.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
