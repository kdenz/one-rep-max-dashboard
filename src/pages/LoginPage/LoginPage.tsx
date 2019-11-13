import React, { useState, ChangeEvent, FormEvent } from "react";
import styled from "styled-components";
import ReactSVG from "react-svg";
import Logo from "assets/logo.svg";
import LoadingOverlay from "react-loading-overlay";
import { loginUser } from "services/authService";

const Container = styled.div`
  background: ${p => p.theme.detailViewBg};
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  font-size: 1.2rem;
  padding: 5px;
`;

const InputLabel = styled.div`
  color: ${p => p.theme.white};
  margin: 30px 0 10px;
`;

const LogoContainer = styled.div``;

const TitleContainer = styled.div`
  color: ${p => p.theme.white};
  margin: 30px 0px;
`;

const FormContainer = styled.form`
  max-width: 80%;
  display: flex;
  flex-direction: column;
`;

const SubmitButton = styled.button`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${p => p.theme.white};
  background: ${p => p.theme.primary};
  border: none;
  padding: 10px 10px;
  margin-top: 50px;
`;

const ErrorMsg = styled.div`
  margin-top: 20px;
  color: ${p => p.theme.primary};
`;

interface LoginPageProps {
  onLoginSuccess: () => void;
}
export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!!error) setError("");
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!!error) setError("");
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const isSuccess = await loginUser(email, password);
    setIsLoading(false);
    if (isSuccess) {
      setError("");
      onLoginSuccess();
    } else {
      setError("Oh no... login failed, please try again");
    }
  };

  return (
    <LoadingOverlay active={isLoading} spinner text="Trying to log you in :)">
      <Container>
        <FormContainer onSubmit={handleSubmit}>
          <LogoContainer>
            <ReactSVG src={Logo} />
          </LogoContainer>
          <TitleContainer>
            Login to access your one-rep max charts for all exercises
          </TitleContainer>
          <ErrorMsg>{error}</ErrorMsg>
          <InputLabel>Email</InputLabel>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={onEmailChange}
          />
          <InputLabel>Password</InputLabel>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={onPasswordChange}
          />
          <SubmitButton type="submit">Login</SubmitButton>
        </FormContainer>
      </Container>
    </LoadingOverlay>
  );
};
