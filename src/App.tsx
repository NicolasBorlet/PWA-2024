import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Square from "./components/SquareComponent";

let colors = [
  {
    id: 1,
    name: "Slate 100",
    color: "#F9FAFB",
  },
  {
    id: 2,
    name: "Slate 200",
    color: "#F3F4F6",
  },
  {
    id: 3,
    name: "Slate 300",
    color: "#E5E7EB",
  },
  {
    id: 4,
    name: "Slate 400",
    color: "#D1D5DB",
  }
]

function App() {
  const [isReady, setIsReady] = useState(false);
  const [isPlayerToPlay, setIsPlayerToPlay] = useState(false);

  const handleIsReady = useCallback(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    console.log("isReady State", isReady);
  }, [isReady]);

  return (
    <>
      {isReady ? (
        <div className="grid grid-cols-2 gap-4">
          {colors.map((color) => (
            <Square key={color.id} color={color.color} name={color.name} id={color.id} clickable={isPlayerToPlay} />
          ))}
        </div>
      ) : (
        <div>
          <button onClick={handleIsReady}>Je suis prêt</button>
        </div>
      )}
    </>
  );
}

export default App;
