import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

/* Left panel — dark brand side */
const BrandPanel = styled.div`
  background: #0f172a;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem;
  position: relative;
  overflow: hidden;

  @media (min-width: 900px) {
    display: flex;
  }
`;

const BrandLogo = styled.div`
  font-family: "Playfair Display", serif;
  font-size: 1.7rem;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

const BrandBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BrandHeadline = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: white;
  line-height: 1.2;
  margin-bottom: 1.2rem;
  max-width: 380px;
`;

const BrandSub = styled.p`
  font-size: 0.88rem;
  color: rgba(255,255,255,0.45);
  line-height: 1.7;
  max-width: 340px;
`;

const Features = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FeatureRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FeatDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${p => p.color || '#6366f1'};
  flex-shrink: 0;
`;

const FeatText = styled.span`
  font-size: 0.82rem;
  color: rgba(255,255,255,0.55);
`;

const BrandFooter = styled.p`
  font-size: 0.75rem;
  color: rgba(255,255,255,0.2);
`;

/* Right panel — form side */
const FormPanel = styled.div`
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* Mobile-only branding */
const MobileBrand = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  @media (min-width: 900px) {
    display: none;
  }
`;

const MobileLogo = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  color: #111827;
  margin-bottom: 0.3rem;
  cursor: pointer;
`;

const MobileTagline = styled.p`
  font-size: 0.85rem;
  color: #9ca3af;
`;

const FEATURE_DOTS = [
  { text: "Career discovery and stream matching", color: "#6366f1" },
  { text: "Personalised 30/60/90 day roadmap", color: "#f59e0b" },
  { text: "Scholarship finder and exam calendar", color: "#10b981" },
  { text: "Personally matched human mentor (Gold)", color: "#ec4899" },
];

export default function SignupLayout({ children }) {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      {/* Left — brand panel (desktop only) */}
      <BrandPanel>
        <BrandLogo onClick={() => navigate("/")}>Saarathii</BrandLogo>

        <BrandBody>
          <BrandHeadline>
            With you. For you. Until you succeed.
          </BrandHeadline>
          <BrandSub>
            Whether you're figuring out your stream, preparing for boards, or looking for a mentor — Saarathii has you covered.
          </BrandSub>
          <Features>
            {FEATURE_DOTS.map(f => (
              <FeatureRow key={f.text}>
                <FeatDot color={f.color} />
                <FeatText>{f.text}</FeatText>
              </FeatureRow>
            ))}
          </Features>
        </BrandBody>

        <BrandFooter>© {new Date().getFullYear()} Saarathii</BrandFooter>
      </BrandPanel>

      {/* Right — form panel */}
      <FormPanel>
        <FormContainer>
          <MobileBrand>
            <MobileLogo onClick={() => navigate("/")}>Saarathii</MobileLogo>
            <MobileTagline>With you. For you. Until you succeed.</MobileTagline>
          </MobileBrand>
          {children}
        </FormContainer>
      </FormPanel>
    </PageWrapper>
  );
}
