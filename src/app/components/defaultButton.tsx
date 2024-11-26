import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

const DefaultButton: React.FC<ButtonProps> = ({ children, onClick }) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.opacity = "0.7";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.opacity = "1";
  };

  return (
    <button
      onClick={onClick}
      className="font-['Dosis']"
      style={{
        backgroundColor: "#1D1D1D",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        marginRight: "10px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "opacity 0.3s",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children} {/* Allow text to be customizable */}
    </button>
  );
};

export default DefaultButton;
