import { CATEGORIES } from "@/lib/categories";
import dayjs from "dayjs";
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

export default function EventDetail({ event, onClose, onEdit, onDelete }) {
  const hasLocation =
    event.location?.street ||
    event.location?.houseNumber ||
    event.location?.zip ||
    event.location?.city;

  return (
    <Wrapper>
      <button type="button" onClick={onClose} aria-label="Close Event">
        X
      </button>

      <h3>{event.title}</h3>

      <p>📅 {dayjs(event.date).format("DD.MM.YYYY")}</p>

      <p>⏰ {event.time} Uhr</p>

      {event.description && <p>📝 {event.description}</p>}

      {hasLocation && (
        <p>
          📍 {event.location.street} {event.location.houseNumber},{" "}
          {event.location.zip} {event.location.city}
        </p>
      )}

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
      <button type="button" onClick={onDelete}>
        Löschen
      </button>
    </Wrapper>
  );
}
