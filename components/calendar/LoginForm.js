import { signIn } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 30px;
  font-weight: 600;
  color: #292b2e;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: #f9fafb;
      border-color: #374151;
    }
  }

  &:active {
    transform: scale(0.95);
    background: #f9fafb;
    border-color: #374151;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: #108197;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid #b1f2ff;
  background: #f8feff;
  font-size: 14px;
  color: #292b2e;
  outline: none;
  width: 100%;

  &:focus {
    border-color: #108197;
    background: #fff;
  }
`;

const Error = styled.p`
  color: #f34e4e;
`;

const SubmitButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: #108197;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #0c6474;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #9ca3af;
  font-size: 12px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }
`;

const GithubButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: 1.5px solid #108197;
  background: #e6fbff;
  color: #108197;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #b9f3ff;
  }
`;

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54
      6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0
      0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3
      6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
    />
  </svg>
);

export default function LoginForm({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Benutzername oder Passwort falsch!");
    } else {
      window.location.href = "/";
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TopRow>
        <Title>Anmelden</Title>
        <CloseButton type="button" onClick={onClose} aria-label="Close Login">
          ✕
        </CloseButton>
      </TopRow>

      <Field>
        <Label htmlFor="username">Benutzername</Label>
        <Input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Benutzername eingeben"
          required
        />
      </Field>

      <Field>
        <Label htmlFor="password">Passwort</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Passwort eingeben"
          required
        />
      </Field>

      {error && <Error>{error}</Error>}

      <SubmitButton type="submit">Anmelden</SubmitButton>

      <Divider>oder</Divider>

      <GithubButton
        type="button"
        onClick={() => signIn("github", { callbackUrl: "/" })}
      >
        <GitHubIcon /> Mit GitHub anmelden
      </GithubButton>
    </Form>
  );
}
