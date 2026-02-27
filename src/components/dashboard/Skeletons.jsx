import styled, { keyframes } from "styled-components";

// Shimmer animation
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const SkeletonBase = styled.div`
  background: #e2e8f0;
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: ${p => p.radius || '8px'};
  width: ${p => p.w || '100%'};
  height: ${p => p.h || '20px'};
  margin-bottom: ${p => p.mb || '0'};
  margin-top: ${p => p.mt || '0'};
`;

// Wrapper card that matches dashboard widget styling
export const SkeletonCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: ${p => p.h || 'auto'};
  min-height: ${p => p.minH || '240px'};
  display: flex;
  flex-direction: column;
`;

export const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => p.gap || '1rem'};
  margin-bottom: ${p => p.mb || '0'};
`;

/* Specific Dashboard Skeletons */

export const GeneralWidgetSkeleton = () => (
    <SkeletonCard>
        {/* Header */}
        <FlexRow gap="1rem" mb="1.5rem">
            <SkeletonBase w="40px" h="40px" radius="10px" />
            <div>
                <SkeletonBase w="120px" h="18px" mb="6px" />
                <SkeletonBase w="80px" h="12px" />
            </div>
        </FlexRow>

        {/* Body items */}
        <SkeletonBase w="100%" h="60px" radius="12px" mb="0.8rem" />
        <SkeletonBase w="100%" h="60px" radius="12px" mb="0.8rem" />
        <SkeletonBase w="100%" h="60px" radius="12px" />
    </SkeletonCard>
);

export const ChartWidgetSkeleton = () => (
    <SkeletonCard minH="340px">
        <FlexRow gap="1rem" mb="2rem">
            <SkeletonBase w="40px" h="40px" radius="10px" />
            <div>
                <SkeletonBase w="140px" h="18px" mb="6px" />
                <SkeletonBase w="90px" h="12px" />
            </div>
        </FlexRow>

        <FlexRow gap="0.8rem" style={{ alignItems: "flex-end", height: "160px", padding: "1rem" }}>
            {[40, 70, 50, 90, 30, 80, 60].map((h, i) => (
                <SkeletonBase key={i} w="100%" h={`${h}%`} radius="6px 6px 0 0" />
            ))}
        </FlexRow>
    </SkeletonCard>
);

// For profile/header block
export const HeaderSkeleton = () => (
    <FlexRow gap="1.2rem" mb="2rem">
        <SkeletonBase w="70px" h="70px" radius="50%" />
        <div>
            <SkeletonBase w="180px" h="28px" mb="8px" />
            <SkeletonBase w="130px" h="14px" />
        </div>
    </FlexRow>
);
