import styled from "styled-components";

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export default function CalendarHeader({ currentDate, setCurrentDate }) {
  function prevMonth() {
    setCurrentDate((prev) => prev.subtract(1, "month"));
  }

  function nextMonth() {
    setCurrentDate((prev) => prev.add(1, "month"));
  }

  return (
    <Header>
      <button type="button" onClick={prevMonth} aria-label="Previous Month">
        ←
      </button>

      <h2>{currentDate.format("MMMM YYYY")}</h2>

      <button type="button" onClick={nextMonth} aria-label="Next Month">
        →
      </button>
    </Header>
  );
}
