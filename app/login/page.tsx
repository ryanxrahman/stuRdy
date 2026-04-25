"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import BtnSecond from "@/components/btn/BtnSecond";

export default function Login() {
    const [state, formAction, isPending] = useActionState(loginAction, null);

    return (
       <main className="min-h-screen flex items-center justify-center">
            <form action={formAction} className="bg-base-200 w-md max-md:w-sm h-full rounded-4xl outline-4 outline-base-300 p-6 py-10">
                <div>
                    <Link className="text-xs" href="/">
                        <p className="flex gap-1 items-center link link-hover hover:text-primary"><ArrowLeftCircle size={15} strokeWidth={1.5} /> back to home</p>
                    </Link>
                    <div className="py-2 text-center  mb-6">
                        <h1 className="text-2xl font-bold capitalize text-center">Welcome <span className="text-white bg-primary px-1">Back</span></h1>
                        <p className="text-sm">lets study!</p>
                    </div>
                </div>

                {state?.error && (
                    <div className="text-error text-center text-sm mb-4">{state.error}</div>
                )}

                <div className="flex flex-col gap-2">
                   <div>
                       <label className="label">Email</label>
                                       <input
                        name="email"
                        type="email"
                        className="input focus:input-primary rounded-xl w-full "
                        placeholder="zuck@gmail.com"
                        required 
                                       />
                   </div>

                   <div>
                       <label className="label">Password</label>
                       <input
                           name="password"
                           type="password"
                           className="input focus:input-primary rounded-xl w-full "
                           placeholder="password"
                           required
                       />
                   </div>

                </div>
               <div>

                <div className="mt-4">
                    <BtnSecond className="w-full" type="submit" disabled={isPending}>
                        {isPending ? "Logging in..." : "Login"}
                    </BtnSecond>
                </div>

                <div className="mt-2 text-xs text-center">
                    <Link href="/register" className="link link-hover">
                        No account? Register
                    </Link>
                </div>
                </div>
            </form>
       </main>
    );
}