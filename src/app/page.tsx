import Link from "next/link";

export default function Home() {
  return (
    <div>
      
      <h1>Welcome to JobSphere</h1>
      <p>Your one-stop solution for job hunting</p>
      <Link href="/auth/login/employer">Employer Login</Link>
      <Link href="/auth/login/jobseeker">Job Seeker Login</Link>
    </div>
  );
}
