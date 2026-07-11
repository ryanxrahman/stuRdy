"use client";
import { useState, useEffect } from "react";



export default  function SecuritySettingsPage() {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");




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
    <main>
        <div>
          <h1>Security Settings</h1>
          <p>Manage your security settings here.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h1>Change Your Password here</h1>

            <div>
                <label htmlFor="current-password">Current Password</label>
                <input required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="border" type="password" id="current-password" />
            </div>
            <div>
                <label htmlFor="new-password">New Password</label>
                <input required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border" type="password" id="new-password" />
            </div>
            <div>
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border" type="password" id="confirm-password" />
            </div>
            <button className="cursor-pointer border p-2" type="submit">Update Password</button>
        </form>
    </main>
  );
}