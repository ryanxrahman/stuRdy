"use client";

import { useActionState } from "react";
import { registerAction } from "../login/actions";
import BtnPrimary from "@/components/btn/BtnPrimary";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";

export default function Register() {
    const [state, formAction, isPending] = useActionState(registerAction, null);

    return (
        <div className="flex flex-col bg-neutral-800 items-center justify-center h-screen gap-4">
            <form action={formAction} className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <Link href="/">
                    <legend className="flex gap-1 items-center link link-hover"><ArrowLeftCircle size={15} strokeWidth={1.5} /> back to home</legend>
                </Link>
                <legend className="fieldset-legend text-xl font-bold">Register</legend>

                {state?.error && (
                    <div className="text-error text-sm mb-2">{state.error}</div>
                )}

                <label className="label">Email</label>
                <input 
                    name="email"
                    type="email" 
                    className="input w-full rounded-xl" 
                    placeholder="Email" 
                    required 
                />

                <label className="label">Password</label>
                <input 
                    name="password"
                    type="password" 
                    className="input w-full rounded-xl" 
                    placeholder="Password" 
                    required 
                />

                <div className="mt-4">
                    <BtnPrimary className="w-full bg-neutral-900 text-white" type="submit" disabled={isPending}>
                        {isPending ? "Registering..." : "Register"}
                    </BtnPrimary>
                </div>
                
                <div className="mt-2 text-center">
                    <Link href="/login" className="link link-hover text-xs">
                        Already have an account? Login
                    </Link>
                </div>
            </form>
        </div>
    );
}
