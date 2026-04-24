import { CATEGORIES } from "@/lib/categories";
import { formatLocation } from "@/lib/formatLocation";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Chip = styled.span`
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 0.8rem;
  margin-right: 6px;
  background: ${({ $color }) => $color};
  color: white;
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
  color: #991b1b;
  margin: 0 0 4px;
`;

const DeleteButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #fca5a5;
  background: white;
  color: #dc2626;
  text-align: left;

  &:hover {
    background: #fee2e2;
  }
`;

const CancelButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  text-align: left;

  &:hover {
    background: #f9fafb;
  }
`;

export default function EventDetail({ event, onClose, onEdit, onDelete }) {
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);

  const address = formatLocation(event.location);

  const isRecurring = event.isRecurringInstance || event.recurrence?.enabled;

  return (
    <Wrapper>
      <button type="button" onClick={onClose} aria-label="Close Event">
        X
      </button>

      <h3>{event.title}</h3>

      <p>📅 {dayjs(event.start).format("DD.MM.YYYY")}</p>

      <p>
        ⏰ {dayjs(event.start).format("HH:mm")} –{" "}
        {dayjs(event.end).format("HH:mm")} Uhr
      </p>

      {event.description && <p>📝 {event.description}</p>}

      {address && <p>📍 {address}</p>}

      {event.categories?.length > 0 && (
        <div>
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
        </div>
      )}

      <button type="button" onClick={onEdit}>
        Bearbeiten
      </button>

      <button type="button" onClick={() => setShowDeleteOptions(true)}>
        Löschen
      </button>

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
