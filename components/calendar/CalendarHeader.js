import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const MonthTitle = styled.h1`
  font-size: 18px;
  font-weight: 500;
  color: #374151;
  letter-spacing: -0.3px;
`;

const NavButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: #f1f3f4;
    }
  }

  &:active {
    background: #e8eaed;
    transform: scale(0.95);
  }
`;

export default function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
}) {
  return (
    <Header>
      <NavButton
        type="button"
        onClick={onPrevMonth}
        aria-label="Previous Month"
      >
        <ChevronLeft size={20} />
      </NavButton>

      <NavButton type="button" onClick={onNextMonth} aria-label="Next Month">
        <ChevronRight size={20} />
      </NavButton>

      <MonthTitle>{currentDate.format("MMMM YYYY")}</MonthTitle>
    </Header>
  );
}
