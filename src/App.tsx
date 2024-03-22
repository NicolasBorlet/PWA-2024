import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Square from "./components/SquareComponent";

const colors = [
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
  const [speechRecognition, setSpeechRecognition] = useState<unknown>(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

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

  const colorDictionary = colors.reduce((dict, color) => {
    // @ts-expect-error abc
    dict[color.name.toLowerCase()] = color;
    return dict;
  }, {});

  const startTalking = () => {
    setIsTalking(true);
    if (speechRecognition) {
      // @ts-expect-error abc
      speechRecognition.start();
    }
  };

  const stopTalking = () => {
    setIsTalking(false);
    if (speechRecognition) {
      // @ts-expect-error abc
      speechRecognition.stop();
    }
  };

  const promptInstall = () => {
    if (deferredPrompt) {
      // Affichez le prompt d'installation
      // @ts-expect-error abc
      deferredPrompt.prompt();
      // Attendez que l'utilisateur réponde à l'invite
      // @ts-expect-error abc
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("L'utilisateur a accepté l'A2HS prompt");
        } else {
          console.log("L'utilisateur a refusé l'A2HS prompt");
        }
        setDeferredPrompt(null);
      });
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      // @ts-expect-error abc
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "fr-FR";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: unknown) => {
        // Sépare les mots prononcés dans la transcription
        // @ts-expect-error abc
        const spokenWords = event.results[0][0].transcript
          .trim()
          .toLowerCase()
          .split(" ");
        // Créez une copie temporaire de l'index actuel pour le vérifier contre la séquence
        let tempIndex = currentIndex;

        // Vérifiez chaque mot prononcé contre la séquence attendue
        for (const word of spokenWords) {
          // @ts-expect-error abc
          const foundColor = colorDictionary[word];
          // Vérifiez si la couleur prononcée correspond à la couleur attendue dans la séquence
          if (foundColor && sequence[tempIndex] === foundColor.id) {
            // Si la couleur est correcte, avancez temporairement dans la séquence
            tempIndex++;
            if (tempIndex === sequence.length) {
              // Si toutes les couleurs ont été correctement identifiées, ajoutez une nouvelle couleur
              console.log("Sequence completed, add new color");
              setIsPlayerToPlay(false); // Empêche d'autres clics pendant la mise à jour de la séquence
              const newSequence = [
                ...sequence,
                colors[Math.floor(Math.random() * colors.length)].id,
              ];
              setSequence(newSequence);
              setCurrentIndex(0);
              break; // Sortie de la boucle, car la séquence est terminée
            }
          } else {
            // Si une couleur est incorrecte, réinitialisez la séquence
            console.log("wrong");
            setIsPlayerToPlay(false);
            setIsReady(false);
            setSequence([]);
            setCurrentIndex(0);
            break; // Sortie de la boucle après une erreur
          }
        }

        // Mise à jour de l'indice courant si toutes les couleurs étaient correctes
        if (tempIndex !== currentIndex && tempIndex < sequence.length) {
          setCurrentIndex(tempIndex);
          setIsPlayerToPlay(true); // Permettre au joueur de continuer à jouer
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
      speakColor(
        colors.find((color) => color.id === highlightIndex)?.name || ""
      );
    }
  }, [highlightIndex, isPlayerToPlay]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: undefined) => {
      // Empêche Chrome 67 et versions antérieures d'afficher automatiquement le prompt
      // @ts-expect-error abc
      e.preventDefault();
      // Stockez l'événement pour pouvoir le déclencher plus tard
      // @ts-expect-error abc
      setDeferredPrompt(e);
    };
    // @ts-expect-error abc
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Nettoyez l'effet
    return () => {
      // @ts-expect-error abc
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  return (
    <>
      {isReady ? (
        <>
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
          <button
            onMouseDown={startTalking}
            onMouseUp={stopTalking}
            onTouchStart={startTalking} // Pour les appareils tactiles
            onTouchEnd={stopTalking}
            className="talk-button"
          >
            {isTalking ? "Parler" : "Parler (cliquez et parlez)"}
          </button>
        </>
      ) : (
        <div>
          <button onClick={handleIsReady}>Je suis prêt</button>
          {deferredPrompt && (
            <button onClick={promptInstall} className="pwa-install-button">
              Installer l'application
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default App;
