"use client";

import { useState, useTransition } from "react";
import { addTodo, toggleTodo } from "@/app/(dashboard)/dashboard/subject-actions";

type Todo = {
    id: string;
    text: string;
    completed: boolean;
}

export default function TodoList({ subjectId, initialTodos }: { subjectId: string, initialTodos: Todo[] }) {
    const [todos, setTodos] = useState(initialTodos);
    const [inputValue, setInputValue] = useState("");
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

    const handleToggle = (todoId: string, completed: boolean) => {
        startTransition(async () => {
            await toggleTodo(subjectId, todoId, !completed);
            setTodos(todos.map(t => t.id === todoId ? { ...t, completed: !completed } : t));
        });
    }

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleAddTodo} className="flex gap-2">
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="What needs to be done?" 
                    className="input input-sm w-full"
                />
                <button type="submit" className="btn btn-sm btn-primary" disabled={isPending}>
                    Add
                </button>
            </form>

            <ul className="flex flex-col gap-2 mt-4">
                {todos.length === 0 && (
                    <li className="text-center opacity-40 text-sm py-4 italic">No tasks yet</li>
                )}
                {todos.map((todo) => (
                    <li key={todo.id} className="flex items-center gap-3 p-3 bg-base-100 rounded-xl">
                        <input 
                            type="checkbox" 
                            checked={todo.completed} 
                            onChange={() => handleToggle(todo.id, todo.completed)}
                            className="checkbox checkbox-primary checkbox-sm" 
                        />
                        <span className={`text-sm ${todo.completed ? 'line-through opacity-50' : ''}`}>
                            {todo.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
