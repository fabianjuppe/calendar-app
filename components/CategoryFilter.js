import { CATEGORIES } from "@/lib/categories";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Chip = styled.button`
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid ${({ $isActive, $color }) => ($isActive ? $color : "#ccc")};
  background: ${({ $isActive, $color }) => ($isActive ? $color : "#e5e7eb")};
  color: ${({ $isActive }) => ($isActive ? "white" : "black")};

  &:hover {
    border-color: ${({ $color }) => $color};
    color: ${({ $isActive, $color }) => ($isActive ? "white" : $color)};
  }
`;

export default function CategoryFilter({
  selectedCategories,
  onToggle,
  onReset,
}) {
  return (
    <Wrapper>
      {CATEGORIES.map((category) => (
        <Chip
          key={category.id}
          type="button"
          onClick={() => onToggle(category.id)}
          $isActive={selectedCategories.includes(category.id)}
          $color={category.color}
        >
          {category.label}
        </Chip>
      ))}

      <Chip type="button" onClick={onReset} $color="red">
        Alle Events anzeigen
      </Chip>
    </Wrapper>
  );
}
