import SignupLayout from "../components/signup/SignupLayout";
import EmailAuthCard from "../components/auth/EmailAuthCard";

export default function Login() {
    return (
        <SignupLayout>
            <div style={{ textAlign: "center", marginBottom: "2rem", width: "100%", maxWidth: "420px" }}>
                <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: '#111827', marginBottom: '0.5rem' }}>Welcome Back</h1>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '1rem', color: '#6b7280' }}>Access your personalized mentorship dashboard</p>
            </div>
            <EmailAuthCard />
        </SignupLayout>
    );
}
