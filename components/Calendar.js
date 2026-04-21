import { useState } from "react";
import styled from "styled-components";

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
  const year = date.getFullYear();
  const month = date.getMonth();

  const startDay = new Date(year, month, 1).getDay();
  const startOffset = (startDay + 6) % 7;

  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  return days;
}

function isToday(date) {
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarDays = getCalendarDays(currentDate);

  function prevMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  }

  return (
    <>
      <Header>
        <button type="button" onClick={prevMonth} aria-label="Previous Month">
          ←
        </button>

        <h2>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}{" "}
        </h2>

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
            {day.date.getDate()}
          </Day>
        ))}
      </Grid>
    </>
  );
}
