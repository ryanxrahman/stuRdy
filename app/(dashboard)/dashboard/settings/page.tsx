
import type { Metadata } from "next";
import ChangePasswordSetting from "./ChangePasswordSetting";
import DeleteSubject from "./DeleteSubject";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import {redirect} from "next/navigation";
import { ObjectId } from "mongodb";


export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your security settings here.",
};





export default async function SecuritySettingsPage() {

  const session = await getSession();


  if (!session) {
    redirect("/login");
  }

    const db = await getDb();

     const user = ObjectId.isValid(session.userId)
        ? await db.collection("users").findOne({ _id: new ObjectId(session.userId) })
        : await db.collection("users").findOne({ email: session.email });
    
      const rawSubjects = await db.collection("subjects")
        .find({ userId: session.userId })
        .toArray();
    
  const subjects = JSON.parse(JSON.stringify(rawSubjects));

  return (
    <main className="flex flex-col mt-20 gap-5">
         <div className="">
              <h1 className="text-4xl max-md:text-2xl font-bold">Settings</h1>
              <p>Manage your settings here.</p>
            </div>
            <ChangePasswordSetting />
            <DeleteSubject subjects={subjects} />
    </main>
  );
}