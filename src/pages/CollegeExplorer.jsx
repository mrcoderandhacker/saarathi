import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  padding-top: 100px;
  background: #f9fafb;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const Title = styled(motion.h1)`
  font-family: "Playfair Display", serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  
  @media (max-width: 899px) {
    font-size: 2.5rem;
  }
`;

const Text = styled(motion.p)`
  font-size: 1.1rem;
  color: #4b5563;
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 3rem;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');
  background-size: cover;
  background-position: center;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-family: "Playfair Display", serif;
  font-size: 1.4rem;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const CardDesc = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.5;
`;

export default function CollegeExplorer() {
  const navigate = useNavigate();

  return (
    <Container>
      <Content>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Explore Colleges
        </Title>
        <Text
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Discover and compare top colleges to find the perfect fit for your academic journey.
          Use our comprehensive data to make informed decisions about your future.
        </Text>

        <Grid
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card onClick={() => navigate("/college-explorer/engineering")}>
            <CardImage />
            <CardContent>
              <CardTitle>Top Engineering Colleges in India</CardTitle>
              <CardDesc>
                Explore the best engineering institutes ranked by Saarathii, accounting for 10 years of historical data, TLR, and RPC scores.
              </CardDesc>
            </CardContent>
          </Card>
        </Grid>
      </Content>
    </Container>
  );
}
