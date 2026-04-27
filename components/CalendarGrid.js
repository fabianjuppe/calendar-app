import { CATEGORIES } from "@/lib/categories";
import dayjs from "dayjs";
import styled from "styled-components";

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

const Day = styled.div`
  border-radius: 4px;
  padding: 2px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow: hidden;
  cursor: pointer;
  opacity: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 1 : 0.4)};
  background: #ffffff;

  &:hover {
    background: #b9f3ff;
  }
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

export default function CalendarGrid({
  currentDate,
  events,
  onDayClick,
  onEventClick,
}) {
  const calendarDays = getCalendarDays(currentDate);

  return (
    <Wrapper>
      <WeekdayRow>
        {weekDays.map((day) => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}
      </WeekdayRow>

      <Grid>
        {calendarDays.map((day) => {
          const dayEvents = events.filter((event) =>
            dayjs(event.start).isSame(day.date, "day")
          );

          return (
            <Day
              key={day.date.toISOString()}
              onClick={() => onDayClick(day.date)}
              $isCurrentMonth={day.isCurrentMonth}
            >
              <DayNumber $isToday={isToday(day.date)}>
                {day.date.date()}
              </DayNumber>
              {dayEvents.map((dayEvent) => (
                <Event
                  key={dayEvent._id}
                  onClick={(event) => {
                    event.stopPropagation();
                    onEventClick(dayEvent);
                  }}
                  $color={
                    CATEGORIES.find(
                      (cat) => cat.id === dayEvent.categories?.[0]
                    )?.color || "#24dda6"
                  }
                >
                  {dayjs(dayEvent.start).format("HH:mm")} {dayEvent.title}
                </Event>
              ))}
            </Day>
          );
        })}
      </Grid>
    </Wrapper>
  );
}
