import React, { useCallback } from "react";

interface SquareProps {
  id: string;
  name: string;
  color: string;
  clickable?: boolean;
}

const Square: React.FC<SquareProps> = (square) => {
  const handleClick = useCallback(() => {
    console.log("Square Clicked", square.id);
  }, []);

  return (
    <div
      style={{
        backgroundColor: square.color,
        height: "160px",
        width: "160px",
      }}
      onClick={square.clickable ? handleClick : undefined}
    >
      {square.name}
    </div>
  );
};

export default Square;
