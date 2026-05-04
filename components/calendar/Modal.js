import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 1000;
`;

const Content = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;

  width: 100%;
  max-width: 600px;

  max-height: 90vh;
  overflow-y: auto;
`;

export default function Modal({ children, onClose }) {
  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e) => e.stopPropagation()}>{children}</Content>
    </Overlay>
  );
}
