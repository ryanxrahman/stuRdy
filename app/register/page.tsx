"use client";

import { useActionState } from "react";
import { registerAction } from "../login/actions";
import BtnPrimary from "@/components/btn/BtnPrimary";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";

export default function Register() {
    const [state, formAction, isPending] = useActionState(registerAction, null);

    return (
        <div className="flex flex-col bg-neutral-900 items-center justify-center min-h-screen my-auto gap-4">
            <form action={formAction} className="fieldset bg-slate-700 border-base-300 items-center justify-center my-atuo rounded-box w-md h-full border p-4 lg:p-10">
                <div>
                    <Link href="/">
                        <legend className="flex gap-1 items-center link link-hover"><ArrowLeftCircle size={15} strokeWidth={1.5} /> back to home</legend>
                    </Link>
                    <div className="flex flex-col items-center mt-4 mb-2">
                        <h1 className="text-xl font-bold">Register</h1>
                        <p className="text-xs italic">start your journey!</p>
                    </div>
                </div>

                {state?.error && (
                    <div className="text-error text-sm mb-2">{state.error}</div>
                )}

                <label className="label">Email</label>
                <input 
                    name="email"
                    type="email" 
                    className="input rounded-xl w-full focus:outline-none" 
                    placeholder="zuck@gmail.com" 
                    required 
                />

                <label className="label">Password</label>
                <input 
                    name="password"
                    type="password" 
                    className="input w-full rounded-xl" 
                    placeholder="password" 
                    required 
                />

                <div className="mt-4">
                    <BtnPrimary className="w-full bg-neutral-900 text-white dark:bg-white dark:text-black" type="submit" disabled={isPending}>
                        {isPending ? "Registering..." : "Register"}
                    </BtnPrimary>
                </div>

                <div className="mt-2 text-xs text-center">
                    <Link href="/login" className="link link-hover">
                        Already have an account? Login
                    </Link>
                </div>
            </form>
        </div>
    );
}
