"use client";

import { useState, useTransition } from "react";
import { addTodo, toggleTodo, deleteTodoAction } from "@/app/(dashboard)/dashboard/subject-actions";
import { Trash2, Plus, Copy } from "lucide-react";

type Todo = {
    id: string;
    text: string;
    completed: boolean;
}

export default function TodoList({ subjectId, initialTodos }: { subjectId: string, initialTodos: Todo[] }) {
    const [todos, setTodos] = useState(initialTodos);
    const [inputValue, setInputValue] = useState("");
    const [pasteValue, setPasteValue] = useState("");
    const [showPasteInput, setShowPasteInput] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

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

        setPasteValue("");
        setShowPasteInput(false);

        startTransition(async () => {
            const newTodos = [];
            for (const text of items) {
                const result = await addTodo(subjectId, text);
                if (result.success) {
                    newTodos.push({ id: Math.random().toString(), text, completed: false });
                }
            }
            setTodos([...todos, ...newTodos]);
        });
    };

    const handleToggle = (todoId: string, completed: boolean) => {
        startTransition(async () => {
            await toggleTodo(subjectId, todoId, !completed);
            setTodos(todos.map(t => t.id === todoId ? { ...t, completed: !completed } : t));
        });
    }

    const handleDelete = (todoId: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        startTransition(async () => {
            await deleteTodoAction(subjectId, todoId);
            setTodos(todos.filter(t => t.id !== todoId));
        });
    }

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleAddTodo} className="flex gap-2">
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="What needs to be done?" 
                        className="input input-sm w-full pl-8"
                    />
                    <Plus size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-30" />
                </div>
                <button type="submit" className="btn btn-sm btn-primary" disabled={isPending}>
                    {isPending ? "..." : "Add"}
                </button>
                <button 
                    type="button"
                    onClick={() => setShowPasteInput(!showPasteInput)}
                    className="btn btn-sm btn-secondary"
                    title="Bulk add from paragraph"
                >
                    <Copy size={16} />
                </button>
            </form>

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
                            disabled={isPending}
                        >
                            {isPending ? "..." : "Parse & Add"}
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
                            className="btn btn-ghost btn-circle btn-xs text-error opacity-0 group-hover/item:opacity-100 transition-opacity"
                        >
                            <Trash2 size={14} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
