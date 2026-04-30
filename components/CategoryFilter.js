import { CATEGORIES } from "@/lib/categories";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const ChipGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ChipRow = styled.div`
  display: flex;
  align-items: center;
`;

const Chip = styled.button`
  padding: 4px 12px;
  border-radius: 999px 0 0 999px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid
    ${({ $isActive, $isPartial, $color }) =>
      $isActive || $isPartial ? $color : "#d1d5db"};
  background: ${({ $isActive, $color }) => ($isActive ? $color : "#ffffff")};
  color: ${({ $isActive, $isPartial, $color }) =>
    $isActive ? "#ffffff" : $isPartial ? $color : "#374151"};

  &:only-child {
    border-radius: 999px;
    border-right: 1px solid
      ${({ $isActive, $color }) => ($isActive ? $color : "#d1d5db")};
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${({ $color }) => $color};
      color: ${({ $isActive, $color }) => ($isActive ? "white" : $color)};
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const DropdownToggle = styled.button`
  padding: 4px 8px;
  border-radius: 0 999px 999px 0;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid
    ${({ $isActive, $color }) => ($isActive ? $color : "#d1d5db")};
  background: ${({ $isActive, $color }) => ($isActive ? $color : "#ffffff")};
  color: ${({ $isActive }) => ($isActive ? "white" : "#374151")};

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${({ $color }) => $color};
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 140px;
`;

const SubChip = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid
    ${({ $isActive, $color }) => ($isActive ? $color : "#e5e7eb")};
  background: white;
  color: ${({ $isActive, $color }) => ($isActive ? $color : "#374151")};
  text-align: left;
  font-weight: ${({ $isActive }) => ($isActive ? "500" : "400")};

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${({ $color }) => $color};
      color: ${({ $color }) => $color};
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ResetChip = styled.button`
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  transition: all 0.15s;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: #ff2449;
      color: #ff2449;
    }
  }

  &:active {
    transform: scale(0.95);
    border-color: #ff2449;
    color: #ff2449;
  }
`;

export default function CategoryFilter({
  selectedCategories,
  onToggle,
  onReset,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);

  function toggleDropdown(categoryId) {
    setOpenDropdown((prev) => (prev === categoryId ? null : categoryId));
  }

  const containerRef = useRef(null);

  useEffect(() => {
    if (!openDropdown) return;

    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  function handleChipClick(category) {
    if (!category.subcategories?.length) {
      onToggle(category.id);
      return;
    }
    const subIds = category.subcategories.map((sub) => sub.id);
    onToggle(subIds);
  }

  return (
    <Wrapper ref={containerRef}>
      {CATEGORIES.map((category) => {
        const subIds = category.subcategories?.map((sub) => sub.id) || [];
        const activeSubCount = subIds.filter((id) =>
          selectedCategories.includes(id)
        ).length;
        const allSubsActive =
          subIds.length > 0 && activeSubCount === subIds.length;
        const isActive =
          selectedCategories.includes(category.id) || allSubsActive;
        const isPartial = activeSubCount > 0 && !isActive;
        const isOpen = openDropdown === category.id;

        return (
          <ChipGroup key={category.id}>
            <ChipRow>
              <Chip
                type="button"
                $isActive={isActive}
                $isPartial={isPartial}
                $color={category.color}
                $hasDropdown={category.subcategories?.length > 0}
                onClick={() => handleChipClick(category)}
              >
                {category.label}
              </Chip>

              {category.subcategories?.length > 0 && (
                <DropdownToggle
                  type="button"
                  $isActive={isActive || isPartial}
                  $color={category.color}
                  onClick={() => toggleDropdown(category.id)}
                  aria-label="Unterkategorien"
                >
                  {isOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                </DropdownToggle>
              )}
            </ChipRow>

            {isOpen && category.subcategories?.length > 0 && (
              <Dropdown>
                {category.subcategories.map((sub) => (
                  <SubChip
                    key={sub.id}
                    type="button"
                    $isActive={selectedCategories.includes(sub.id)}
                    $color={category.color}
                    onClick={() => onToggle(sub.id)}
                  >
                    {sub.label}
                  </SubChip>
                ))}
              </Dropdown>
            )}
          </ChipGroup>
        );
      })}

      <ResetChip
        type="button"
        onClick={onReset}
        aria-label="Alle Filter deaktivieren"
      >
        ✕
      </ResetChip>
    </Wrapper>
  );
}
