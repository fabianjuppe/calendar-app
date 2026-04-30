import { CATEGORIES } from "@/lib/categories";
import dayjs from "dayjs";
import styled from "styled-components";
import { memo, useCallback } from "react";

const Day = styled.div`
  border-radius: 4px;
  padding: 2px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow: hidden;
  cursor: ${({ $isEnabled }) => ($isEnabled ? "pointer" : "default")};
  opacity: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 1 : 0.4)};
  background: #ffffff;

  ${({ $isEnabled }) =>
    $isEnabled &&
    `
    &:hover {
      background: #b9f3ff;
    }
  `}
`;

const DayNumber = styled.div`
  width: clamp(18px, 3.5vw, 26px);
  height: clamp(18px, 3.5vw, 26px);
  font-size: clamp(9px, 1.8vw, 13px);
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2px;
  background-color: ${({ $isToday }) => ($isToday ? "#108197" : "transparent")};
  color: ${({ $isToday }) => ($isToday ? "white" : "#292b2e")};
`;

const Event = styled.div`
  font-size: clamp(8px, 1.8vw, 12px);
  background: ${({ $color }) => $color};
  padding: 2px;
  border-radius: 4px;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    background: ${({ $color }) => $color + "99"};
    color: black;
    cursor: pointer;
  }
`;

function isToday(date) {
  return dayjs(date)
    .tz("Europe/Berlin")
    .isSame(dayjs().tz("Europe/Berlin"), "day");
}

const CalendarDay = memo(function CalendarDay({
  day,
  events,
  isEnabled,
  onDayClick,
  onEventClick,
}) {
  const handleDayClick = useCallback(() => {
    if (isEnabled) onDayClick(day.date);
  }, [isEnabled, onDayClick, day.date]);

  return (
    <Day
      onClick={handleDayClick}
      $isCurrentMonth={day.isCurrentMonth}
      $isEnabled={isEnabled}
    >
      <DayNumber $isToday={isToday(day.date)}>{day.date.date()}</DayNumber>

      {events.map((event) => (
        <Event
          key={event._id}
          onClick={(e) => {
            e.stopPropagation();
            onEventClick(event);
          }}
          $color={
            CATEGORIES.find((cat) => cat.id === event.categories?.[0])?.color ||
            "#24dda6"
          }
        >
          {dayjs(event.start).tz("Europe/Berlin").format("HH:mm")} {event.title}
        </Event>
      ))}
    </Day>
  );
});

export default CalendarDay;
