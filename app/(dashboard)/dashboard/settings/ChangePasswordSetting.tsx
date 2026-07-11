"use client";
import { useState, useEffect } from "react";
import BtnPrimary from "@/components/btn/BtnPrimary";
import { LockIcon, Eye, EyeOff } from "lucide-react";





export default  function ChangePasswordSetting() {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            alert("Please fill in all required fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }
        if (newPassword.length < 8) {
            alert("New password must be at least 8 characters long.");
            return;
        }
        // Handle password change logic here
        console.log("Current Password:", currentPassword);
        console.log("New Password:", newPassword);
        console.log("Confirm Password:", confirmPassword);

        try {
            const response = await fetch("/api/user/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            alert("An error occurred while changing the password.");
        }
    };

  return (

        <div className={`flex flex-col gap-5 bg-base-200 rounded-4xl border border-base-300 p-8 `}>
           
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h1 className="flex gap-2 items-center "><LockIcon size="15"/>Change Your Password here</h1>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <label className="text-sm" htmlFor="current-password">Current Password</label>
                        <button type="button" className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <Eye size="12" /> : <EyeOff size="12" />}
                        </button>
                    </div>
                    <input required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input focus:input-success rounded-xl w-full " type={showPassword ? "text" : "password"} id="current-password" />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <label className="text-sm" htmlFor="new-password">New Password</label>
                        <button type="button" className="cursor-pointer" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <Eye size="12" /> : <EyeOff size="12" />}
                        </button>
                    </div>
                    <input required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input focus:input-success rounded-xl w-full" type={showNewPassword ? "text" : "password"} id="new-password" />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm" htmlFor="confirm-password">Confirm New Password</label>
                    <input required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input focus:input-success rounded-xl w-full" type="password" id="confirm-password" />
                </div>
                <BtnPrimary className="text-white" type="submit">Update Password</BtnPrimary>
            </form>
        </div>
  );
}