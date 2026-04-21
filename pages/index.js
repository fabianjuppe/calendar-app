import Calendar from "@/components/Calendar";
import styled from "styled-components";

const Title = styled.h1`
  text-align: center;
`;

export default function HomePage() {
  return (
    <>
      <Title>Calendar App</Title>
      <Calendar />
    </>
  );
}
