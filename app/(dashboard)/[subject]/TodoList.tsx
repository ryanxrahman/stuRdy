"use client";

import { useState, useTransition } from "react";
import { addTodo, toggleTodo, deleteTodoAction } from "@/app/(dashboard)/dashboard/subject-actions";
import { Trash2, Plus, Copy } from "lucide-react";

type Todo = {
    id: string;
    text: string;
    completed: boolean;
}

const MAX_TODOS = 30;

export default function TodoList({ subjectId, initialTodos }: { subjectId: string, initialTodos: Todo[] }) {
    const [todos, setTodos] = useState(initialTodos);
    const [inputValue, setInputValue] = useState("");
    const [pasteValue, setPasteValue] = useState("");
    const [showPasteInput, setShowPasteInput] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoadingPaste, setIsLoadingPaste] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        
        if (todos.length >= MAX_TODOS) {
            alert(`You can only have up to ${MAX_TODOS} tasks.`);
            return;
        }

        const text = inputValue.trim();
        setInputValue("");

        startTransition(async () => {
            const result = await addTodo(subjectId, text);
            if (result.success) {
                // Optimistic UI (simplified)
                setTodos([...todos, { id: Math.random().toString(), text, completed: false }]);
                // better to rely on server action's revalidatePath but for speed...
            }
        });
    };

    const handlePasteAndParse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pasteValue.trim()) return;

        // Parse the text by periods and filter out empty items
        const items = pasteValue
            .split('.')
            .map(item => item.trim())
            .filter(item => item.length > 0);

        if (items.length === 0) return;

        const availableSlots = MAX_TODOS - todos.length;
        if (availableSlots <= 0) {
            alert(`You can only have up to ${MAX_TODOS} tasks. You've reached the limit.`);
            return;
        }

        const itemsToAdd = items.slice(0, availableSlots);
        if (itemsToAdd.length < items.length) {
            alert(`Only ${itemsToAdd.length} out of ${items.length} items can be added (limit: ${MAX_TODOS} tasks total).`);
        }

        setPasteValue("");
        setShowPasteInput(false);
        setIsLoadingPaste(true);

        startTransition(async () => {
            const newTodos = [];
            for (let i = 0; i < itemsToAdd.length; i++) {
                const text = itemsToAdd[i];
                const result = await addTodo(subjectId, text);
                if (result.success) {
                    newTodos.push({ id: Math.random().toString(), text, completed: false });
                    setLoadingProgress(Math.round(((i + 1) / itemsToAdd.length) * 100));
                }
            }
            setTodos([...todos, ...newTodos]);
            setIsLoadingPaste(false);
            setLoadingProgress(0);
        });
    };

    const handleToggle = (todoId: string, completed: boolean) => {
        startTransition(async () => {
            await toggleTodo(subjectId, todoId, !completed);
            setTodos(todos.map(t => t.id === todoId ? { ...t, completed: !completed } : t));
        });
    }

    const handleDelete = (todoId: string) => {
        if (pendingDeleteId === todoId) {
            // Second click - confirm delete
            setPendingDeleteId(null);
            startTransition(async () => {
                await deleteTodoAction(subjectId, todoId);
                setTodos(todos.filter(t => t.id !== todoId));
            });
        } else {
            // First click - mark for deletion
            setPendingDeleteId(todoId);
            // Reset after 3 seconds if not clicked again
            setTimeout(() => {
                setPendingDeleteId(prev => prev === todoId ? null : prev);
            }, 3000);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
                <form onSubmit={handleAddTodo} className="flex gap-2 flex-1">
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="What needs to be done?" 
                            className="input input-sm w-full pl-8"
                            disabled={todos.length >= MAX_TODOS}
                        />
                        <Plus size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-30" />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-sm btn-primary" 
                        disabled={isPending || todos.length >= MAX_TODOS}
                    >
                        {isPending ? "..." : "Add"}
                    </button>
                </form>
                
                {isLoadingPaste ? (
                    <div className="w-16 h-2 bg-base-300 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-secondary transition-all duration-300"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                ) : (
                    <button 
                        type="button"
                        onClick={() => setShowPasteInput(!showPasteInput)}
                        className="btn btn-sm btn-secondary"
                        title="Bulk add from paragraph"
                        disabled={todos.length >= MAX_TODOS}
                    >
                        <Copy size={16} />
                    </button>
                )}
            </div>

            <div className="text-xs opacity-60">
                Tasks: <span className={todos.length >= MAX_TODOS ? 'text-error font-bold' : ''}>{todos.length}</span> / {MAX_TODOS}
            </div>

            {showPasteInput && (
                <form onSubmit={handlePasteAndParse} className="flex flex-col gap-2">
                    <textarea
                        value={pasteValue}
                        onChange={(e) => setPasteValue(e.target.value)}
                        placeholder="Paste your paragraph here. Items will be separated by periods (.)."
                        className="textarea textarea-sm w-full min-h-24 p-3"
                    />
                    <div className="flex gap-2">
                        <button 
                            type="submit" 
                            className="btn btn-sm btn-secondary flex-1"
                            disabled={isLoadingPaste}
                        >
                            {isLoadingPaste ? "..." : "Parse & Add"}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setShowPasteInput(false)}
                            className="btn btn-sm btn-ghost"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <ul className="flex flex-col gap-2 mt-4">
                {todos.length === 0 && (
                    <li className="text-center opacity-40 text-sm py-4 italic">No tasks yet</li>
                )}
                {todos.map((todo) => (
                    <li key={todo.id} className="flex items-center gap-3 p-3 bg-base-100 rounded-xl group/item">
                        <input 
                            type="checkbox" 
                            checked={todo.completed} 
                            onChange={() => handleToggle(todo.id, todo.completed)}
                            className="checkbox checkbox-primary checkbox-sm" 
                        />
                        <span className={`text-sm flex-1 ${todo.completed ? 'line-through opacity-50' : ''}`}>
                            {todo.text}
                        </span>
                        <button 
                            onClick={() => handleDelete(todo.id)}
                            className={`btn btn-ghost btn-circle btn-xs opacity-0 group-hover/item:opacity-100 transition-opacity ${
                                pendingDeleteId === todo.id 
                                    ? 'text-error bg-error/20' 
                                    : 'text-error'
                            }`}
                            title={pendingDeleteId === todo.id ? "Click again to confirm delete" : "Double-click to delete"}
                        >
                            <Trash2 size={14} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
