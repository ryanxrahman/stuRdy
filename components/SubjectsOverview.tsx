import Link from "next/link";
import { Trash2 } from "lucide-react";
import SubjectMiniChart from "./SubjectMiniChart";

type Subject = {
  _id: string;
  name: string;
  todos?: Array<{ completed: boolean }>;
};

type SubjectData = {
  name: string;
  minutes: number;
  mastery: number;
};

type SubjectsOverviewProps = {
  subjects: Subject[];
  subjectStats: SubjectData[];
  onDelete: (id: string) => Promise<any>;
  sessions: any[];
};

export default function SubjectsOverview({ subjects, subjectStats, onDelete, sessions }: SubjectsOverviewProps) {
  if (subjects.length === 0) {
    return (
      <p className="col-span-full text-center opacity-50 py-12 border-2 border-dashed border-base-300 rounded-3xl">
        No subjects yet. Add one above to get started!
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid of subject cards with individual charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((sub) => {
          const stat = subjectStats.find(s => s.name === sub.name);
          const completedTodos = sub.todos?.filter(t => t.completed).length || 0;
          const totalTodos = sub.todos?.length || 0;
          const subjectSessions = sessions.filter((s: any) => s.subjectId === sub._id.toString());
          
          return (
            <div key={sub._id.toString()} className="group">
              {/* Subject Card */}
              <Link 
                href={`/${encodeURIComponent(sub.name)}`}
                className="block p-6 bg-base-200 border border-base-300 rounded-t-3xl hover:border-primary transition-all active:scale-95 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{sub.name}</h3>
                    <p className="text-xs opacity-50 uppercase font-mono tracking-tight mt-2">
                      {completedTodos}/{totalTodos} tasks done
                    </p>
                  </div>
                   {/* Stats */}
                <div className="flex flex-col items-center gap-2">
                  {stat && (
                      <p className="text-2xl font-bold text-primary">
                        {stat.minutes < 60 ? `${stat.minutes}m` : `${(stat.minutes / 60).toFixed(1)}h`}
                      </p>
                  )}
                    <form
                      action={async () => { "use server"; await onDelete(sub._id.toString()); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button type="submit" className="btn btn-ghost btn-circle btn-xs text-error hover:bg-error/10" title="Delete Subject">
                        <Trash2 size={16} />
                      </button>
                    </form>
                </div>
                </div>
              </Link>

              {/* Mini Chart */}
              <div className="bg-base-200 border border-t-0 border-base-300 rounded-b-3xl p-6 shadow-sm">
                <SubjectMiniChart sessions={subjectSessions} subjectName={sub.name} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
