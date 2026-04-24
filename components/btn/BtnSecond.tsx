"use client";

import { useState } from "react";

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    icon?: React.ReactNode;
    loading?: boolean;
    loadingText?: string;
}


export default function BtnSecond({ children, onClick, className, disabled, type, icon, loading, loadingText }: Props) {
    const handleClick = async () => {
        try {
            await onClick?.();
        } catch (error) {
            console.error(error);
        }
    }

    const isLoading = loading;

    return (
        <button
            onClick={handleClick}
            className={`btn btn-primary rounded-xl gap-2  ${className}`}
            disabled={disabled || isLoading}
            type={type}
        >
            {isLoading ? (
                <>
                    <span className="loading loading-spinner loading-xs"></span>
                    {loadingText || children}
                </>
            ) : (
                <>
                    {icon} {children}
                </>
            )}
        </button>
    )
}

