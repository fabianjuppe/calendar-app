import { CATEGORIES } from "@/lib/categories";
import { formatLocation } from "@/lib/formatLocation";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 30px;
  font-weight: 600;
  color: #292b2e;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #108197;
  background: #e6fbff;
  color: #108197;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #b9f3ff;
  }
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f8feff;
  border: 1.5px solid #b1f2ff;
  border-radius: 8px;
`;

const InfoRow = styled.p`
  font-size: 18px;
  color: #292b2e;
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Chip = styled.span`
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $color }) => $color};
  color: white;
`;

const EditButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: 1.5px solid #108197;
  background: white;
  color: #108197;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #b9f3ff;
  }
`;

const DeleteTriggerButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: 1.5px solid #dc2626;
  background: white;
  color: #dc2626;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #fca5a5;
  }
`;

const DeleteOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
`;

const DeleteTitle = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #dc2626;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 4px;
`;

const DeleteButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #dc2626;
  background: white;
  color: #dc2626;
  text-align: left;

  &:hover {
    background: #fca5a5;
  }
`;

const CancelButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  border: 1.5px solid #108197;
  background: white;
  color: #108197;
  text-align: left;

  &:hover {
    background: #b1f2ff;
  }
`;

export default function EventDetail({ event, onClose, onEdit, onDelete }) {
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);

  const address = formatLocation(event.location);

  const isRecurring = event.isRecurringInstance || event.recurrence?.enabled;

  const { data: session } = useSession();

  return (
    <Wrapper>
      <TopRow>
        <Title>{event.title}</Title>
        <CloseButton type="button" onClick={onClose} aria-label="Close Event">
          X
        </CloseButton>
      </TopRow>

      <InfoBlock>
        <InfoRow>📅 {dayjs(event.start).format("DD.MM.YYYY")}</InfoRow>

        <InfoRow>
          ⏰ {dayjs(event.start).format("HH:mm")} –{" "}
          {dayjs(event.end).format("HH:mm")} Uhr
        </InfoRow>

        {address && <InfoRow>📍 {address}</InfoRow>}

        {event.description && <InfoRow>📝 {event.description}</InfoRow>}
      </InfoBlock>

      {event.categories?.length > 0 && (
        <ChipRow>
          {event.categories.map((categoryId) => {
            const category = CATEGORIES.find(
              (category) => category.id === categoryId
            );
            if (!category) return null;

            return (
              <Chip key={category.id} $color={category.color}>
                {category.label}
              </Chip>
            );
          })}
        </ChipRow>
      )}

      {session && (
        <>
          <EditButton type="button" onClick={onEdit}>
            Bearbeiten
          </EditButton>

          <DeleteTriggerButton
            type="button"
            onClick={() => setShowDeleteOptions(true)}
          >
            Löschen
          </DeleteTriggerButton>
        </>
      )}

      {showDeleteOptions && (
        <DeleteOptions>
          <DeleteTitle>
            {isRecurring
              ? "Welche Termine löschen?"
              : "Termin wirklich löschen?"}
          </DeleteTitle>

          {isRecurring ? (
            <>
              <DeleteButton
                type="button"
                onClick={() => {
                  setShowDeleteOptions(false);
                  onDelete("single");
                }}
              >
                Diesen Termin
              </DeleteButton>

              <DeleteButton
                type="button"
                onClick={() => {
                  setShowDeleteOptions(false);
                  onDelete();
                }}
              >
                Alle Termine
              </DeleteButton>
            </>
          ) : (
            <DeleteButton
              type="button"
              onClick={() => {
                setShowDeleteOptions(false);
                onDelete();
              }}
            >
              Bestätigen
            </DeleteButton>
          )}

          <CancelButton
            type="button"
            onClick={() => setShowDeleteOptions(false)}
          >
            Abbrechen
          </CancelButton>
        </DeleteOptions>
      )}
    </Wrapper>
  );
}
