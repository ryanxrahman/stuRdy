"use client";

import { useState, useEffect } from "react";
import ContributionMap from "./ContributionMap";

type SessionData = {
  date: Date;
  duration: number;
};

export default function ContributionMapWithApi({ email }: { email: string }) {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/contribution?email=${encodeURIComponent(email)}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Map API response to Session format
        const formattedSessions = data.map((session: any) => ({
          date: new Date(session.date),
          duration: session.duration || 0,
        }));

        setSessions(formattedSessions);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contributions");
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchContributions();
    }
  }, [email]);

  if (loading) {
    return (
      <div className="relative w-full overflow-hidden p-6 bg-base-200 rounded-[2.5rem] border border-base-300">
        <div className="animate-pulse">
          <div className="h-6 bg-base-300 rounded w-1/3 mb-4"></div>
          <div className="flex flex-wrap gap-0.75">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-sm bg-base-300"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full overflow-hidden p-6 bg-base-200 rounded-[2.5rem] border border-base-300">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="relative w-full overflow-hidden p-6 bg-base-200 rounded-[2.5rem] border border-base-300">
        <p className="text-sm opacity-50">No study sessions yet.</p>
      </div>
    );
  }

  return <ContributionMap sessions={sessions} />;
}
