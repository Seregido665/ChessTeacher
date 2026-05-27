import { useState, useContext } from 'react';
import AuthContext from '../../context/authContext';
import "./result.css";

export default function GameResult({ showResult, gameResult, selectedColor, onSaveGame }) {
  const { user } = useContext(AuthContext);
  const [hasSaved, setHasSaved] = useState(false);

  const handleSave = () => {
    if (hasSaved) return;
    setHasSaved(true);
    onSaveGame?.();
  };

  const getResultText = () => {
    if (!gameResult) return "";
    if (gameResult.reason === "checkmate") {
      return gameResult.winner === "white" ? "¡Blancas ganan!" : "¡Negras ganan!";
    }
    if (gameResult.reason === "resignation") {
      const winnerColor = gameResult.winner === "white" ? "Blancas" : "Negras";
      return `¡${winnerColor} ganan!`;
    }
    if (gameResult.reason === "time") {
      const loserColor = selectedColor === "white" ? "Blancas" : "Negras";
      return `¡${loserColor} pierden por tiempo!`;
    }
    return "Tablas";
  };

  if (!showResult) return null;

  return (
    <>
      <div className="result-card">
        <p className="result-title">{getResultText()}</p>
      </div>
      <div className="text-center">
        {user && !hasSaved ? (
          <button onClick={handleSave} className="saveButton guardar mt-3">
            Guardar Partida
          </button>
        ) : hasSaved ? (
          <p className="result-saved">GUARDADA ✓</p>
        ) : null}
      </div>
    </>
  );
}
