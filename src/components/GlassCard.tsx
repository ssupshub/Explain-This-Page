import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  delay = 0,
  style,
  ...props
}) => {
  const animationStyle = {
    animation: `slideUp 0.5s ease-out ${delay}s backwards`,
  };

  return (
    <div
      className={`glass-panel ${className}`}
      style={{ ...style, ...animationStyle }}
      {...props}
    >
      {children}
    </div>
  );
};
