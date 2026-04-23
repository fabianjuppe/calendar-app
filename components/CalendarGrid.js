import { CATEGORIES } from "@/lib/categories";
import dayjs from "dayjs";
import styled from "styled-components";

const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const WeekDay = styled.div`
  font-weight: bold;
  text-align: center;
`;

const Day = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;

  opacity: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 1 : 0.4)};

  background-color: ${({ $isToday }) => ($isToday ? "#4c53af" : "transparent")};
  color: ${({ $isToday }) => ($isToday ? "white" : "black")};

  &:hover {
    background: #f5ff62;
    color: black;
  }
`;

const Event = styled.div`
  font-size: 0.75rem;
  background: ${({ $color }) => $color};
  margin-top: 2px;
  padding: 2px 4px;
  border-radius: 4px;

  &:hover {
    background: ${({ $color }) => $color + "99"};
    color: black;
    cursor: pointer;
  }
`;

function getCalendarDays(date) {
  const startDay = date.startOf("month").day();
  const startOffset = (startDay + 6) % 7;

  const prevMonth = date.subtract(1, "month");
  const daysInPrevMonth = prevMonth.daysInMonth();

  const daysInMonth = date.daysInMonth();

  const nextMonth = date.add(1, "month");

  const days = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    days.push({
      date: prevMonth.date(daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: date.date(i),
      isCurrentMonth: true,
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: nextMonth.date(i),
      isCurrentMonth: false,
    });
  }

  return days;
}

function isToday(date) {
  return dayjs(date).isSame(dayjs(), "day");
}

function isSameDay(dayDate, eventDate) {
  return dayjs(dayDate).isSame(dayjs(eventDate), "day");
}

export default function CalendarGrid({
  currentDate,
  events,
  onDayClick,
  onEventClick,
}) {
  const calendarDays = getCalendarDays(currentDate);

  return (
    <Grid>
      {weekDays.map((day) => (
        <WeekDay key={day}>{day}</WeekDay>
      ))}

      {calendarDays.map((day) => {
        const dayEvents = events.filter((event) =>
          isSameDay(day.date, event.date)
        );

        return (
          <Day
            key={day.date.toISOString()}
            onClick={() => onDayClick(day.date)}
            $isCurrentMonth={day.isCurrentMonth}
            $isToday={isToday(day.date)}
          >
            {day.date.date()}

            {dayEvents.map((dayEvent) => (
              <Event
                key={dayEvent.id}
                onClick={(event) => {
                  event.stopPropagation();
                  onEventClick(dayEvent);
                }}
                $color={
                  CATEGORIES.find((cat) => cat.id === dayEvent.categories?.[0])
                    ?.color || "#24dda6"
                }
              >
                {dayEvent.time} {dayEvent.title}
              </Event>
            ))}
          </Day>
        );
      })}
    </Grid>
  );
}
