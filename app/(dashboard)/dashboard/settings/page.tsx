
import type { Metadata } from "next";
import ChangePasswordSetting from "./ChangePasswordSetting";


export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your security settings here.",
};





export default  function SecuritySettingsPage() {
  return (
    <main className="flex flex-col mt-20 gap-5">
         <div className="">
              <h1 className="text-4xl max-md:text-2xl font-bold">Settings</h1>
              <p>Manage your settings here.</p>
            </div>
            <ChangePasswordSetting />
    </main>
  );
}