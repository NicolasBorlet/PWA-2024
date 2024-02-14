import React from "react";

export interface SquareProps {
  id: number;
  name: string;
  color: string;
  clickable?: boolean;
  onClick?: () => void;
}

const Square: React.FC<SquareProps> = ({ id, color, clickable, onClick }) => {
  return (
    <div
      style={{
        backgroundColor: color,
        height: "160px",
        width: "160px",
        cursor: clickable ? "pointer" : "default",
      }}
      onClick={onClick}
    >
    </div>
  );
};

export default Square;
