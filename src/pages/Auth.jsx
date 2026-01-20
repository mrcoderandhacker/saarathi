import SignupLayout from "../components/signup/SignupLayout";
import EmailAuthCard from "../components/auth/EmailAuthCard";

export default function Auth() {
  return (
    <SignupLayout>
      <EmailAuthCard />
    </SignupLayout>
  );
}
