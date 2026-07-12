"use client";

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


export default function BtnThird({ children, onClick, className, disabled, type, icon, loading, loadingText }: Props) {
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
            className={`btn btn-sm rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 border-none gap-1.5 ${className}`}
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

