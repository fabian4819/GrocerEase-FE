// PaginationButton.tsx
import React from "react";

interface PaginationButtonProps {
  onClick: () => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
  customStyle?: React.CSSProperties;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled = false,
  children,
  customStyle = {},
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        margin: "0 5px",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        cursor: disabled ? "not-allowed" : "pointer",
        color: "#000",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.2s, color 0.2s",
        ...customStyle,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  );
};

export default PaginationButton;
