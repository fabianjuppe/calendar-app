import dayjs from "dayjs";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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

      <button type="button" onClick={onEdit}>
        Bearbeiten
      </button>
      <button type="button" onClick={onDelete}>
        Löschen
      </button>
    </Wrapper>
  );
}
