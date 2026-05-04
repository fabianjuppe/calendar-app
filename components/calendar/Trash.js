import useSWR from "swr";
import dayjs from "dayjs";
import styled from "styled-components";

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
  font-size: 20px;
  font-weight: 600;
  color: #292b2e;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: #f9fafb;
      border-color: #374151;
    }
  }

  &:active {
    transform: scale(0.95);
    background: #f9fafb;
    border-color: #374151;
  }
`;

const Empty = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  padding: 24px 0;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TrashItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8feff;
  border: 1.5px solid #b1f2ff;
  border-radius: 8px;
  gap: 12px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ItemTitle = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #108197;
  margin: 0;
`;

const ItemMeta = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
`;

const RestoreButton = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1.5px solid #108197;
  background: white;
  color: #108197;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: #e6fbff;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default function Trash({ onClose, onMutate }) {
  const { data: deletedEvents = [], mutate } = useSWR("/api/events/trash");

  async function handleRestore(id) {
    try {
      const response = await fetch(`/api/events/${id}/restore`, {
        method: "POST",
      });

      if (!response.ok) {
        alert("Fehler beim Wiederherstellen");
        return;
      }

      mutate();
      onMutate();
    } catch {
      alert("Verbindungsfehler");
    }
  }

  return (
    <Wrapper>
      <TopRow>
        <Title>Papierkorb</Title>
        <CloseButton type="button" onClick={onClose}>
          ✕
        </CloseButton>
      </TopRow>

      {deletedEvents.length === 0 ? (
        <Empty>Papierkorb ist leer</Empty>
      ) : (
        <EventList>
          {deletedEvents.map((event) => (
            <TrashItem key={event._id}>
              <ItemInfo>
                <ItemTitle>{event.title}</ItemTitle>
                <ItemMeta>
                  {dayjs(event.start)
                    .tz("Europe/Berlin")
                    .format("DD.MM.YYYY HH:mm")}
                </ItemMeta>
                <ItemMeta>
                  Gelöscht:{" "}
                  {dayjs(event.deletedAt)
                    .tz("Europe/Berlin")
                    .format("DD.MM.YYYY")}
                </ItemMeta>
              </ItemInfo>
              <RestoreButton
                type="button"
                onClick={() => handleRestore(event._id)}
              >
                Wiederherstellen
              </RestoreButton>
            </TrashItem>
          ))}
        </EventList>
      )}
    </Wrapper>
  );
}
