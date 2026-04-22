import styled from "styled-components";

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export default function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
}) {
  return (
    <Header>
      <button type="button" onClick={onPrevMonth} aria-label="Previous Month">
        ←
      </button>

      <h2>{currentDate.format("MMMM YYYY")}</h2>

      <button type="button" onClick={onNextMonth} aria-label="Next Month">
        →
      </button>
    </Header>
  );
}
