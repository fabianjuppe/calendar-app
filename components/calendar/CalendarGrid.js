import dayjs from "dayjs";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import CalendarDay from "./CalendarDay";

const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const Wrapper = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  flex: 1;
  overflow: hidden;
  gap: 2px;
  background: #e6fbff;
  min-height: 0;

  transform: ${({ $direction, $animating }) => {
    if (!$animating) return "translateX(0)";

    return $direction === "next" ? "translateX(-20px)" : "translateX(20px)";
  }};

  opacity: ${({ $animating }) => ($animating ? 0 : 1)};

  transition:
    transform 100ms ease,
    opacity 100ms ease;
`;

const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const WeekDay = styled.div`
  text-align: center;
  color: #292b2e;
  padding: 2px;
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

export default function CalendarGrid({
  currentDate,
  events,
  onDayClick,
  onEventClick,
  direction,
  animating,
}) {
  const { data: session } = useSession();

  const calendarDays = useMemo(
    () => getCalendarDays(currentDate),
    [currentDate]
  );

  const eventsByDay = useMemo(() => {
    const map = new Map();

    events.forEach((event) => {
      const key = dayjs(event.start).tz("Europe/Berlin").format("YYYY-MM-DD");
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(event);
    });

    return map;
  }, [events]);

  return (
    <Wrapper>
      <WeekdayRow>
        {weekDays.map((day) => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}
      </WeekdayRow>

      <Grid $direction={direction} $animating={animating}>
        {calendarDays.map((day) => {
          const key = dayjs(day.date.toDate?.() ?? day.date)
            .tz("Europe/Berlin")
            .format("YYYY-MM-DD");

          return (
            <CalendarDay
              key={key}
              day={day}
              events={eventsByDay.get(key) || []}
              isEnabled={!!session}
              onDayClick={onDayClick}
              onEventClick={onEventClick}
            />
          );
        })}
      </Grid>
    </Wrapper>
  );
}
