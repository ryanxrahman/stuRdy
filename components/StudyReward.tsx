'use client';

import { useMemo, useState } from 'react';
import { Plus, Check, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { addRewardLevel, updateRewardLevel, deleteRewardLevel } from '@/app/(dashboard)/dashboard/reward-actions';

type RewardLevel = {
  id: string;
  targetHours: number;
  reward: string;
};

interface StudyRewardProps {
  totalStudyHours: number;
  initialRewards?: RewardLevel[];
}

export default function StudyReward({ totalStudyHours, initialRewards = [] }: StudyRewardProps) {
  const rewards = initialRewards;
  const [isLoading, setIsLoading] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hourInput, setHourInput] = useState('');
  const [rewardInput, setRewardInput] = useState('');

  const sorted = useMemo(
    () => [...rewards].sort((a, b) => a.targetHours - b.targetHours),
    [rewards]
  );

  const unlockedCount = sorted.filter((r) => totalStudyHours >= r.targetHours).length;
  const nextReward = sorted.find((r) => r.targetHours > totalStudyHours) ?? null;
  const hoursLeft = nextReward ? (nextReward.targetHours - totalStudyHours).toFixed(1) : null;

  const resetForm = () => {
    setHourInput('');
    setRewardInput('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    const targetHours = Number(hourInput);
    const reward = rewardInput.trim();
    if (!targetHours || targetHours <= 0 || !reward) {
      toast.error('Please fill all fields correctly');
      return;
    }

    setIsLoading(true);
    const result = await addRewardLevel(targetHours, reward);
    
    if (result.success) {
      resetForm();
      toast.success('Reward level added!');
    } else {
      toast.error(result.error || 'Failed to add reward');
    }
    setIsLoading(false);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const targetHours = Number(hourInput);
    const reward = rewardInput.trim();
    if (!targetHours || targetHours <= 0 || !reward) {
      toast.error('Please fill all fields correctly');
      return;
    }

    setIsLoading(true);
    const result = await updateRewardLevel(editingId, targetHours, reward);
    
    if (result.success) {
      resetForm();
      toast.success('Reward level updated!');
    } else {
      toast.error(result.error || 'Failed to update reward');
    }
    setIsLoading(false);
  };

  const handleStartEdit = (item: RewardLevel) => {
    setEditingId(item.id);
    setHourInput(String(item.targetHours));
    setRewardInput(item.reward);
    setIsAdding(false);
  };

  const currentEditedItem = sorted.find(i => i.id === editingId);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const result = await deleteRewardLevel(id);
    
    if (result.success) {
      toast.success('Reward level deleted!');
    } else {
      toast.error(result.error || 'Failed to delete reward');
    }
    setIsLoading(false);
  };

  const formOpen = isAdding || editingId !== null;

  return (
    <section className="bg-base-200 rounded-4xl border border-base-300 p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold">Study Milestones</h2>
          <p className="text-xs opacity-50 uppercase tracking-tight font-mono mt-1">
            Real-life rewards for your hard work
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setIsAdding(true); setEditingId(null); setHourInput(''); setRewardInput(''); }}
          className="btn btn-sm rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 border-none gap-1.5"
          disabled={isLoading}
        >
          <Plus size={13} />
          Add milestone
        </button>
      </div>

      {/* Next reward banner */}
      {sorted.length > 0 && (
        <div className="flex items-center justify-between gap-3 bg-violet-500/5 border border-violet-500/10 rounded-3xl px-6 py-4 mb-8 flex-wrap">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-violet-400 mb-0.5 font-mono">Current Target</p>
            <p className="text-base font-bold">
              {nextReward ? nextReward.reward : 'Champion status achieved!'}
            </p>
          </div>
          <span className="text-xs font-black bg-violet-500 text-white px-4 py-1.5 rounded-full shadow-lg shadow-violet-500/20">
            {hoursLeft ? `${hoursLeft}h to unlock` : '🎉 ALL CLEAR'}
          </span>
        </div>
      )}

      {/* Add form (Only for new items) */}
      {isAdding && (
        <div className="bg-base-300/30 border border-base-300 rounded-3xl p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4 font-mono">
            New Milestone
          </p>
          <div className="flex flex-wrap gap-3">
            <input
              type="number"
              min={1}
              value={hourInput}
              onChange={(e) => setHourInput(e.target.value)}
              placeholder="Hr"
              className="study-reward-input w-24 bg-base-200 border-base-300"
            />
            <input
              type="text"
              value={rewardInput}
              onChange={(e) => setRewardInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Reward: e.g. One piece of pizza"
              className="study-reward-input flex-1 min-w-50 bg-base-200 border-base-300"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAdd}
                className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl gap-1 px-4"
                disabled={isLoading}
              >
                <Check size={14} /> Save
              </button>
              <button 
                type="button" 
                onClick={resetForm} 
                className="btn btn-sm bg-base-300 hover:bg-base-400 border-none rounded-xl" 
                disabled={isLoading}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Card Table */}
      <div className="overflow-x-auto">
        <table className="table w-full border-separate border-spacing-y-0">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest opacity-30 border-none [&>th]:font-black [&>th]:pb-4 [&>th]:px-4">
              <th className="w-16">LVL</th>
              <th className="w-20">Target</th>
              <th className="min-w-40">Reward</th>
              <th className="hidden md:table-cell">Progress</th>
              <th className="w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, i) => {
              const isUnlocked = totalStudyHours >= item.targetHours;
              const isCurrent = !isUnlocked && nextReward?.id === item.id;
              const prevTarget = i > 0 ? sorted[i - 1].targetHours : 0;
              const segSize = Math.max(1, item.targetHours - prevTarget);
              const pct = isUnlocked
                ? 100
                : Math.max(0, Math.min(100, ((totalStudyHours - prevTarget) / segSize) * 100));

              const isEditing = editingId === item.id;

              return (
                <tr
                  key={item.id}
                  className={`group transition-all border-b border-base-300/50 last:border-none ${
                    isUnlocked
                      ? "bg-emerald-500/5 hover:bg-emerald-500/10 border-l-4 border-l-emerald-500"
                      : isCurrent
                      ? "bg-violet-500/5 hover:bg-violet-500/10 border-l-4 border-l-violet-500"
                      : "hover:bg-base-300/30 border-l-4 border-l-transparent opacity-60"
                  } ${isEditing ? 'ring-2 ring-primary ring-inset z-10 relative' : ''} [&>td]:py-4 [&>td]:px-4`}
                >
                  <td className="font-black text-xs opacity-50">{i + 1}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        min={1}
                        value={hourInput}
                        onChange={(e) => setHourInput(e.target.value)}
                        className="w-16 bg-base-100 border border-base-300 rounded-lg px-2 py-1 text-sm font-black focus:outline-primary"
                        autoFocus
                      />
                    ) : (
                      <button 
                        onClick={() => handleStartEdit(item)}
                        className="font-black text-sm hover:text-primary transition-colors"
                      >
                        {item.targetHours}h
                      </button>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                         <input
                          type="text"
                          value={rewardInput}
                          onChange={(e) => setRewardInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                          className="flex-1 min-w-40 bg-base-100 border border-base-300 rounded-lg px-3 py-1 text-sm font-bold focus:outline-primary"
                        />
                      </div>
                    ) : (
                      <div 
                        className="flex items-center gap-2 cursor-pointer group/text"
                        onClick={() => handleStartEdit(item)}
                      >
                        {isUnlocked ? (
                          <Check size={14} className="text-emerald-500 shrink-0" />
                        ) : isCurrent ? (
                          <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse shrink-0" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-base-content/20 shrink-0" />
                        )}
                        <span className={`text-sm font-bold truncate group-hover/text:text-primary transition-colors ${isUnlocked ? "text-emerald-500" : ""}`}>
                          {item.reward}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="hidden md:table-cell w-48">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 bg-base-300 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${
                            isUnlocked
                              ? "bg-emerald-500"
                              : isCurrent
                              ? "bg-violet-500"
                              : "bg-base-content/10"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black opacity-40 w-8">{Math.round(pct)}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="btn btn-xs btn-circle bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                            disabled={isLoading}
                          >
                            <Check size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={resetForm}
                            className="btn btn-xs btn-circle bg-base-300 hover:bg-base-400 border-none"
                            disabled={isLoading}
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            className="btn btn-xs btn-ghost hover:bg-base-300 rounded-lg p-1"
                            disabled={isLoading}
                          >
                            <Pencil size={11} className="opacity-50 group-hover:opacity-100" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-xs btn-ghost hover:bg-rose-500/10 text-rose-500 rounded-lg p-1"
                            disabled={isLoading}
                          >
                            <Trash2 size={11} className="opacity-50 group-hover:opacity-100" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}