"use client";

import { useActionState } from "react";
import { registerAction } from "../login/actions";
import BtnPrimary from "@/components/btn/BtnPrimary";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import BtnSecond from "@/components/btn/BtnSecond";

export default function Register() {
    const [state, formAction, isPending] = useActionState(registerAction, null);

    return (
       <main className="min-h-screen flex items-center justify-center">
            <form action={formAction} className="bg-base-200 w-md max-md:w-sm h-full rounded-4xl outline-4 outline-base-300 p-6 py-10">
                <div>
                    <Link className="text-xs" href="/">
                        <p className="flex gap-1 items-center link link-hover hover:text-primary"><ArrowLeftCircle size={15} strokeWidth={1.5} /> back to home</p>
                    </Link>
                    <div className="py-2 text-center  mb-6">
                        <h1 className="text-2xl font-bold capitalize text-center">Create an <span className="text-white bg-primary px-1">account</span></h1>
                        <p className="text-sm">start studying</p>
                    </div>
                </div>
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
                        {isPending ? "Signing..." : "Sign Up"}
                    </BtnSecond>
                </div>

                <div className="mt-2 text-xs text-center">
                    <Link href="/login" className="link link-hover">
                        Already have an account? Login
                    </Link>
                </div>
                </div>
            </form>
       </main>
    );
}
