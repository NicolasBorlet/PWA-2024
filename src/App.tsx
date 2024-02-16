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
  const [isTalking, setIsTalking] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);

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

  const startTalking = () => {
    setIsTalking(true);
    if (speechRecognition) {
      speechRecognition.start();
    }
  };

  const stopTalking = () => {
    setIsTalking(false);
    if (speechRecognition) {
      speechRecognition.stop();
    }
  };

  useEffect(() => {
    //@ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: any) => {
        const spokenWord = event.results[0][0].transcript.trim().toLowerCase();
        const foundColor = colors.find(color => color.name.toLowerCase() === spokenWord);
        if (foundColor && isPlayerToPlay) {
          checkSequence(foundColor.id);
        }
      };
      setSpeechRecognition(recognition);
    }
  }, [isPlayerToPlay]); // Ajout de isPlayerToPlay dans les dépendances pour réinitialiser l'API de reconnaissance vocale en fonction de l'état du jeu

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

  useEffect(() => {
    const speakColor = (colorName: string) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(colorName);
      synth.speak(utterance);
    };

    if (highlightIndex !== undefined && !isPlayerToPlay) {
      speakColor(colors.find(color => color.id === highlightIndex)?.name || '');
    }
  }, [highlightIndex, isPlayerToPlay]);

  return (
    <>
      {isReady ? (
        <div className="grid grid-cols-2 gap-4">
          {colors.map((color) => (
            <Square
              key={color.id}
              color={highlightIndex === color.id && !isPlayerToPlay ? color.highlightColor : color.color}
              name={color.name}
              id={color.id}
              clickable={isPlayerToPlay}
              onClick={() => {
                checkSequence(color.id);
              }}
            />
          ))}
          <button 
            onMouseDown={startTalking} 
            onMouseUp={stopTalking} 
            onTouchStart={startTalking} // Pour les appareils tactiles
            onTouchEnd={stopTalking}
            className="talk-button"
          >
            {isTalking ? "Parler" : "Parler (cliquez et parlez)"}
          </button>
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
