import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl bg-base-100 p-12 rounded-2xl shadow-xl">
        <h1 className="text-5xl font-bold mb-6 text-primary">Study Tracker</h1>
        <p className="text-xl mb-8 opacity-80">
          Master your subjects, track your progress, and stay organized with our all-in-one study companion.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="btn btn-primary btn-lg">
            Login
          </Link>
          <Link href="/register" className="btn btn-outline btn-lg">
            Register
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-4 bg-base-200 rounded-lg">
            <h3 className="font-bold mb-2">Track Progress</h3>
            <p className="text-sm opacity-70">Visual charts and mastery levels for every subject.</p>
          </div>
          <div className="p-4 bg-base-200 rounded-lg">
            <h3 className="font-bold mb-2">Stay Organized</h3>
            <p className="text-sm opacity-70">Manage exams, notes, and tasks in one place.</p>
          </div>
          <div className="p-4 bg-base-200 rounded-lg">
            <h3 className="font-bold mb-2">Deep Insights</h3>
            <p className="text-sm opacity-70">Analyze your study habits and time allocation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
