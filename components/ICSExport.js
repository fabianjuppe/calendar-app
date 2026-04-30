import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ChevronDown, ChevronUp } from "lucide-react";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 300px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.14);
`;

const Text = styled.p`
  font-size: 13px;
  color: #374151;
  margin: 0;
`;

const SummaryButton = styled.button`
  width: 100%;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #374151;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #f9fafb;
  }
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

export default function ICSExport({ selectedCategories }) {
  const [isOpen, setIsOpen] = useState(false);
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

  const googleUrl = `https://calendar.google.com/calendar/u/0/r/settings/addbyurl`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(icsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(icsUrl);
    }
  }

  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <Wrapper ref={containerRef}>
      <SummaryButton type="button" onClick={() => setIsOpen((prev) => !prev)}>
        📅 Abonnieren
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </SummaryButton>

      {isOpen && (
        <Dropdown>
          <ButtonWrapper>
            <Text>1. Link kopieren</Text>

            <CopyButton type="button" onClick={handleCopy} $copied={copied}>
              {copied ? "✓ Kopiert" : "🔗 Link kopieren"}
            </CopyButton>
          </ButtonWrapper>

          <ButtonWrapper>
            <Text>2. Apple oder Google Kalender öffnen & Link einfügen</Text>

            <ExportLink href={webcalUrl}>🍎 Apple Kalender</ExportLink>

            <ExportLink
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              📅 Google Kalender
            </ExportLink>
          </ButtonWrapper>

          <ButtonWrapper>
            <Text>
              Alternativ: .ics Datei herunterladen (ohne automatische
              Aktualisierung)
            </Text>

            <ExportLink href={icsUrl} download="calendar.ics">
              ⬇️ .ics Download
            </ExportLink>
          </ButtonWrapper>
        </Dropdown>
      )}
    </Wrapper>
  );
}
