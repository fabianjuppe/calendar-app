import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
`;

const Label = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
`;

const ExportLink = styled.a`
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  text-decoration: none;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: white;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

const CopyButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  text-decoration: none;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: white;
  cursor: pointer;

  border-color: ${({ $copied }) => ($copied ? "#059669" : "#e5e7eb")};
  background: ${({ $copied }) => ($copied ? "#d1fae5" : "white")};
  color: ${({ $copied }) => ($copied ? "#065f46" : "#374151")};
  transition: all 0.15s;

  &:hover {
    background: ${({ $copied }) => ($copied ? "#d1fae5" : "#f9fafb")};
  }
`;

export default function ICSExportButton({ selectedCategories }) {
  const [copied, setCopied] = useState(false);

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/events/ics`
      : "/api/events/ics";

  const icsUrl =
    selectedCategories?.length > 0
      ? `${baseUrl}?categories=${selectedCategories.join(",")}`
      : baseUrl;

  const webcalUrl = icsUrl.replace(/^https?:/, "webcal:");

  const googleUrl = `https://calendar.google.com/calendar/r/settings/addbyurl?url=${encodeURIComponent(icsUrl)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(icsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(icsUrl);
    }
  }

  return (
    <Wrapper>
      <Label>Kalender abonnieren</Label>
      <ButtonRow>
        <ExportLink href={webcalUrl}>🍎 Apple Kalender</ExportLink>

        <ExportLink href={googleUrl} target="_blank" rel="noopener noreferrer">
          📅 Google Kalender
        </ExportLink>

        <CopyButton type="button" onClick={handleCopy} $copied={copied}>
          {copied ? "✓ Kopiert" : "🔗 Link kopieren"}
        </CopyButton>
      </ButtonRow>
    </Wrapper>
  );
}
