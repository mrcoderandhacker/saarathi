import React from "react";
import styled from "styled-components";

const ErrorSection = styled.div`
  min-height: 100vh;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const Inner = styled.div`
  max-width: 440px;
`;

const Code = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  color: rgba(255,255,255,0.06);
  font-family: "Playfair Display", serif;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 1.5rem;
  color: white;
  margin-bottom: 0.6rem;
`;

const Sub = styled.p`
  font-size: 0.85rem;
  color: rgba(255,255,255,0.4);
  line-height: 1.65;
  margin-bottom: 1.5rem;
`;

const Btn = styled.button`
  background: white;
  color: #0f172a;
  border: none;
  padding: 0.7rem 1.6rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  margin: 0 0.4rem;
  &:hover { opacity: 0.9; }
`;

const OutBtn = styled(Btn)`
  background: transparent;
  color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.2);
  &:hover { border-color: rgba(255,255,255,0.5); color: white; }
`;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error("Saarathii Error Boundary caught:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorSection>
                    <Inner>
                        <Code>Oops</Code>
                        <Title>Something went wrong.</Title>
                        <Sub>
                            A part of Saarathii encountered an error. Your data is safe — this is just a display issue.
                        </Sub>
                        <Btn onClick={() => window.location.reload()}>Reload page</Btn>
                        <OutBtn onClick={() => { window.location.href = "/"; }}>Go home</OutBtn>
                    </Inner>
                </ErrorSection>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
