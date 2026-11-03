import React from "react";

export function Card({ 
  children, 
  className = "", 
  selected = false,
  onClick
}: { 
  children: React.ReactNode; 
  className?: string; 
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white border rounded-[12px] p-6 transition-all duration-200 ${
        selected ? 'border-[#153D32] ring-1 ring-[#153D32] shadow-sm' : 'border-[#E4E7E1] hover:border-[#C2DCD0] shadow-[0_1px_3px_rgba(21,61,50,0.03)]'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({ 
  children, 
  variant = "info",
  className = "" 
}: { 
  children: React.ReactNode; 
  variant?: "success" | "warning" | "pending" | "info" | "neutral";
  className?: string;
}) {
  const styles = {
    success: "bg-[#EBF7EE] text-[#166534] border-[#BBF7D0]",
    warning: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    pending: "bg-[#FFFBEB] text-[#B45309] border-[#FEEBC8]",
    info: "bg-[#DDEBE3] text-[#153D32] border-[#C2DCD0]",
    neutral: "bg-[#F4F5F2] text-[#586660] border-[#E4E7E1]",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  onClick,
  type = "button"
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}) {
  const base = "inline-flex items-center justify-center font-medium rounded-[10px] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base"
  };

  const variants = {
    primary: "bg-[#153D32] hover:bg-[#1C4D40] text-white focus:ring-[#153D32]",
    secondary: "bg-[#DDEBE3] hover:bg-[#C2DCD0] text-[#153D32] focus:ring-[#153D32]",
    outline: "border border-[#E4E7E1] bg-white hover:bg-[#F7F7F2] text-[#15241E] focus:ring-[#153D32]",
    ghost: "bg-transparent hover:bg-[#F3F8F5] text-[#153D32] focus:ring-[#153D32]",
    danger: "bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA] focus:ring-[#EF4444]"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizeStyles[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
