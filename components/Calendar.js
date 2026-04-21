import { useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";

const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

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

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const calendarDays = getCalendarDays(currentDate);

  function prevMonth() {
    setCurrentDate((prev) => prev.subtract(1, "month"));
  }

  function nextMonth() {
    setCurrentDate((prev) => prev.add(1, "month"));
  }

  return (
    <>
      <Header>
        <button type="button" onClick={prevMonth} aria-label="Previous Month">
          ←
        </button>

        <h2>{currentDate.format("MMMM YYYY")}</h2>

        <button type="button" onClick={nextMonth} aria-label="Next Month">
          →
        </button>
      </Header>

      <Grid>
        {weekDays.map((day) => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}

        {calendarDays.map((day) => (
          <Day
            key={day.date.toISOString()}
            $isCurrentMonth={day.isCurrentMonth}
            $isToday={isToday(day.date)}
          >
            {day.date.date()}
          </Day>
        ))}
      </Grid>
    </>
  );
}
