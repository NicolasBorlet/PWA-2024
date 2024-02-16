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
  
  const [date, setDate] = useState();

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
    if (isReady && !isPlayerToPlay) {
      let i = 0;
      const intervalId = setInterval(() => {
        if (i < sequence.length) {
          setCurrentIndex(i);
          i++;
        } else {
          clearInterval(intervalId);
          setIsPlayerToPlay(true);
          setCurrentIndex(0); // Préparez pour l'entrée de l'utilisateur
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isReady, sequence, isPlayerToPlay]);

  console.log("sequence", sequence, currentIndex, highlightIndex);

  useEffect(() => {
    fetch('http://localhost:3000/get')
    .then(response => response.json())
    .then(data => setDate(data))
  }, [])

  useEffect(() => {
    console.log(date);
  }, [date])

  function notifyMe() {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      new Notification("Hi there!");
      // navigator.vibrate([200, 100, 200]);
      // …
    } else if (Notification.permission !== "denied") {
      // navigator.vibrate([200, 100, 200]);
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          new Notification("Hi there!");
          // …
        }
      });
    }
  
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  }
  

  useEffect(() => {
    notifyMe();
  }, []);
   
  return (
    <>
      {isReady ? (
        <div className="grid grid-cols-2 gap-4">
          {colors.map((color) => (
            <Square
              key={color.id}
              color={
                highlightIndex === color.id && !isPlayerToPlay
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
