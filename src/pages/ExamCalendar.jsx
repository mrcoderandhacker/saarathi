import styled from "styled-components";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

const Layout = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding-top: 80px;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1.2rem;
`;

const PageTitle = styled(motion.h1)`
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: #0f172a;
  margin-bottom: 0.3rem;
  @media (max-width: 640px) { font-size: 1.6rem; }
`;

const PageSub = styled(motion.p)`
  font-size: 0.9rem; color: #64748b; margin-bottom: 2rem;
`;

const FiltersRow = styled.div`
  display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;
`;

const FilterBtn = styled.button`
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  border: 1.5px solid ${p => p.selected ? EXAM_COLORS[p.exam] || '#6366f1' : '#e2e8f0'};
  background: ${p => p.selected ? (EXAM_COLORS[p.exam] || '#6366f1') + '15' : 'white'};
  color: ${p => p.selected ? EXAM_COLORS[p.exam] || '#6366f1' : '#6b7280'};
  font-size: 0.82rem;
  font-weight: ${p => p.selected ? '600' : '400'};
  cursor: pointer;
  transition: all 0.15s;
`;

const Timeline = styled.div`
  position: relative;
  padding-left: 1.5rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, #6366f1, #a78bfa, transparent);
    border-radius: 999px;
  }
`;

const TimelineGroup = styled.div`
  margin-bottom: 2rem;
`;

const MonthHeader = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  padding-left: 1rem;
  margin-bottom: 0.8rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -0.6rem;
    top: 50%;
    transform: translateY(-50%);
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #6366f1;
    border: 2px solid white;
    box-shadow: 0 0 0 2px #6366f1;
  }
`;

const EventCard = styled(motion.div)`
  background: white;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 0.6rem;
  margin-left: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  transition: box-shadow 0.2s;

  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.07); }
`;

const EventDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => EXAM_COLORS[p.exam] || '#6366f1'};
  margin-top: 4px;
  flex-shrink: 0;
`;

const EventBody = styled.div`
  flex: 1;
`;

const EventName = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.2rem;
`;

const EventDate = styled.div`
  font-size: 0.78rem;
  color: #9ca3af;
  margin-bottom: 0.4rem;
`;

const EventBadges = styled.div`
  display: flex; gap: 0.4rem; flex-wrap: wrap;
`;

const Badge = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: ${p => EXAM_COLORS[p.exam] || '#6366f1'}15;
  color: ${p => EXAM_COLORS[p.exam] || '#6366f1'};
`;

const PastBadge = styled.span`
  font-size: 0.68rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: #f1f5f9;
  color: #9ca3af;
`;

const EXAM_COLORS = {
    "JEE": "#6366f1",
    "NEET": "#ef4444",
    "CUET": "#f59e0b",
    "CLAT": "#10b981",
    "BITSAT": "#3b82f6",
    "CET": "#8b5cf6",
    "All": "#64748b",
};

const TODAY = new Date("2026-02-27");

const EVENTS = [
    // Jan–Feb 2026
    { month: "January 2026", name: "JEE Main Session 1", type: "JEE", date: "Jan 22–30, 2026", kind: "Exam" },
    { month: "January 2026", name: "CUET PG Registration Opens", type: "CUET", date: "Jan 15, 2026", kind: "Registration" },
    { month: "February 2026", name: "JEE Main Session 1 Results", type: "JEE", date: "Feb 12, 2026", kind: "Result" },
    { month: "February 2026", name: "BITSAT Registration Opens", type: "BITSAT", date: "Feb 1, 2026", kind: "Registration" },
    // March 2026
    { month: "March 2026", name: "JEE Main Session 2 Registration", type: "JEE", date: "Mar 1–15, 2026", kind: "Registration" },
    { month: "March 2026", name: "CUET UG Registration Opens", type: "CUET", date: "Mar 1, 2026", kind: "Registration" },
    { month: "March 2026", name: "CLAT Registration Opens", type: "CLAT", date: "Mar 10, 2026", kind: "Registration" },
    { month: "March 2026", name: "CET (MHT) Phase 1 Registration", type: "CET", date: "Mar 15, 2026", kind: "Registration" },
    // April 2026
    { month: "April 2026", name: "JEE Main Session 2", type: "JEE", date: "Apr 2–9, 2026", kind: "Exam" },
    { month: "April 2026", name: "NEET UG Exam", type: "NEET", date: "Apr 6, 2026", kind: "Exam" },
    { month: "April 2026", name: "BITSAT Exam Slot Booking", type: "BITSAT", date: "Apr 10, 2026", kind: "Registration" },
    { month: "April 2026", name: "MHT CET PCM Exam", type: "CET", date: "Apr 17–30, 2026", kind: "Exam" },
    { month: "April 2026", name: "CUET UG Exam (Tentative)", type: "CUET", date: "Apr 20–May 5, 2026", kind: "Exam" },
    // May 2026
    { month: "May 2026", name: "JEE Main Session 2 Results", type: "JEE", date: "May 5, 2026", kind: "Result" },
    { month: "May 2026", name: "NEET UG Results", type: "NEET", date: "May 20, 2026", kind: "Result" },
    { month: "May 2026", name: "JEE Advanced Registration", type: "JEE", date: "May 10–18, 2026", kind: "Registration" },
    { month: "May 2026", name: "BITSAT Exam", type: "BITSAT", date: "May 15–25, 2026", kind: "Exam" },
    { month: "May 2026", name: "CLAT Exam", type: "CLAT", date: "May 22, 2026", kind: "Exam" },
    // June 2026
    { month: "June 2026", name: "JEE Advanced 2026", type: "JEE", date: "Jun 8, 2026", kind: "Exam" },
    { month: "June 2026", name: "NEET UG Counselling Begins", type: "NEET", date: "Jun 15, 2026", kind: "Counselling" },
    { month: "June 2026", name: "CUET UG Results", type: "CUET", date: "Jun 10, 2026", kind: "Result" },
    { month: "June 2026", name: "BITSAT Results", type: "BITSAT", date: "Jun 5, 2026", kind: "Result" },
    { month: "June 2026", name: "CLAT Results", type: "CLAT", date: "Jun 1, 2026", kind: "Result" },
    // July 2026
    { month: "July 2026", name: "JEE Advanced Results", type: "JEE", date: "Jul 6, 2026", kind: "Result" },
    { month: "July 2026", name: "JoSAA Counselling Begins", type: "JEE", date: "Jul 10, 2026", kind: "Counselling" },
    { month: "July 2026", name: "MHT CET Counselling (CAP)", type: "CET", date: "Jul 15, 2026", kind: "Counselling" },
];

const KIND_ICONS = { Exam: "📝", Registration: "📋", Result: "🏆", Counselling: "🎓" };

const EXAM_FILTERS = ["All", "JEE", "NEET", "CUET", "CLAT", "BITSAT", "CET"];

const groupByMonth = (events) => {
    const groups = {};
    events.forEach(e => {
        if (!groups[e.month]) groups[e.month] = [];
        groups[e.month].push(e);
    });
    return groups;
};

const isPast = (dateStr) => {
    const year = parseInt(dateStr.split(" ").pop());
    const month = dateStr.split(" ")[0];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mi = months.findIndex(m => dateStr.includes(m));
    if (mi === -1) return false;
    const d = new Date(year, mi, 1);
    return d < TODAY;
};

export default function ExamCalendar() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered = activeFilter === "All"
        ? EVENTS
        : EVENTS.filter(e => e.type === activeFilter);

    const groups = groupByMonth(filtered);

    return (
        <Layout>
            <Navbar />
            <Container>
                <PageTitle initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    Exam Calendar 2026 📅
                </PageTitle>
                <PageSub initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    All important exam dates, registration windows, and results in one place.
                </PageSub>

                <FiltersRow>
                    {EXAM_FILTERS.map(ex => (
                        <FilterBtn key={ex} exam={ex} selected={activeFilter === ex} onClick={() => setActiveFilter(ex)}>
                            {ex}
                        </FilterBtn>
                    ))}
                </FiltersRow>

                <Timeline>
                    {Object.entries(groups).map(([month, events], gi) => (
                        <TimelineGroup key={month}>
                            <MonthHeader>{month}</MonthHeader>
                            {events.map((ev, i) => {
                                const past = isPast(ev.date);
                                return (
                                    <EventCard
                                        key={ev.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: gi * 0.05 + i * 0.04 }}
                                        style={{ opacity: past ? 0.55 : 1 }}
                                    >
                                        <EventDot exam={ev.type} />
                                        <EventBody>
                                            <EventName>{KIND_ICONS[ev.kind]} {ev.name}</EventName>
                                            <EventDate>{ev.date}</EventDate>
                                            <EventBadges>
                                                <Badge exam={ev.type}>{ev.type}</Badge>
                                                <Badge exam={ev.type}>{ev.kind}</Badge>
                                                {past && <PastBadge>Past</PastBadge>}
                                            </EventBadges>
                                        </EventBody>
                                    </EventCard>
                                );
                            })}
                        </TimelineGroup>
                    ))}
                </Timeline>
            </Container>
            <Footer />
        </Layout>
    );
}
