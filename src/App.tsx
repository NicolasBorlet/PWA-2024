import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Square from "./components/SquareComponent";

let colors = [
  {
    id: 1,
    name: "Red",
    color: "#DC2626",
    highlightColor: "red",
  },
  {
    id: 2,
    name: "Green",
    color: "#10B981",
    highlightColor: "green",
  },
  {
    id: 3,
    name: "Blue",
    color: "#2563EB",
    highlightColor: "blue",
  },
  {
    id: 4,
    name: "Yellow",
    color: "#FCD34D",
    highlightColor: "yellow",
  },
];

function App() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPlayerToPlay, setIsPlayerToPlay] = useState(false);
  
  const highlightIndex = useMemo(
    () => sequence[currentIndex],
    [currentIndex, sequence]
  );

  const handleIsReady = useCallback(() => {
    const newSequence = [
      ...sequence,
      colors[Math.floor(Math.random() * colors.length)].id,
    ];
    
    setIsReady(true);
    setSequence(newSequence);
    setIsPlayerToPlay(true);
  }, [sequence]);

  const checkSequence = useCallback(
    (id: number) => {
      console.log("clicked", id);
      if (isPlayerToPlay) {
        if (sequence[currentIndex] === id) {
          console.log("correct");
          if (currentIndex + 1 === sequence.length) {
            console.log("Sequence completed, add new color");
            setCurrentIndex(0);
            setIsPlayerToPlay(false);
            const newSequence = [
              ...sequence,
              colors[Math.floor(Math.random() * colors.length)].id,
            ];
            setSequence(newSequence);
            console.log(newSequence);
          } else {
            setCurrentIndex(currentIndex + 1);
          }
        } else {
          console.log("wrong");
          setCurrentIndex(0);
          setIsPlayerToPlay(false);
          setIsReady(false);
          setSequence([]);
        }
      }
    },
    [currentIndex, sequence, isPlayerToPlay]
  );

  useEffect(() => {
    if(currentIndex < 4){
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 1000);
    }
    else {
      setCurrentIndex(0);
    }
  }, [currentIndex]);  

  console.log("sequence", sequence, currentIndex, highlightIndex);

  return (
    <>
      {isReady ? (
        <div className="grid grid-cols-2 gap-4">
          {colors.map((color) => (
            <Square
              key={color.id}
              color={
                highlightIndex === color.id
                  ? color.highlightColor
                  : color.color
              }
              name={color.name}
              id={color.id}
              clickable={isPlayerToPlay}
              onClick={() => {
                checkSequence(color.id);
              }}
            />
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
