import { useState } from 'react';
import "./matchMenu.css";

export default function ConfigMenu({
  showResult,
  gameResult,
  selectedColor,
  setSelectedColor,
  showEvaluationBar,
  setShowEvaluationBar,
  showBestMove,
  setShowBestMove,
  setDifficulty,
  playStyle,
  setPlayStyle,
  user,
  onSaveGame,
  onStartGame,
  onTimeChange,
  onResetGame,
}) {
  const [localDifficulty, setLocalDifficulty] = useState(3);
  const [timeIndex, setTimeIndex] = useState(5);
  const [hasSaved, setHasSaved] = useState(false);

  const handleDifficultyChange = (e) => {
    const value = Number(e.target.value);
    setLocalDifficulty(value);
    setDifficulty?.(value);
  };

  // --- SOLO CAMBIA EL TIEMPO, NO INICIA PARTIDA ---
  const handleTimeChange = (e) => {
    const value = Number(e.target.value);
    setTimeIndex(value);

    const options = [
      { base: 60, increment: 0 },
      { base: 60, increment: 1 },
      { base: 120, increment: 1 },
      { base: 180, increment: 0 },
      { base: 180, increment: 2 },
      { base: 300, increment: 0 },
      { base: 300, increment: 3 },
      { base: 600, increment: 0 },
      { base: 600, increment: 5 },
      { base: 900, increment: 10 },
      { base: 0, increment: 0, isInfinite: true },
    ];
    onTimeChange?.(options[value]);
  };

  const handleSave = () => {
    if (hasSaved) return;
    setHasSaved(true);
    onSaveGame?.();
  };

  // --- NUEVA PARTIDA ---
  const handleNewGame = () => {
    setHasSaved(false);
    if (showResult) {
      onResetGame?.();
    }
    onStartGame?.(); 
  };

  // --- RENDICIÓN ---
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


  return (
    <>
      <div className="text-center mt-2">
        <button
          onClick={handleNewGame}
          className="matchButton inicio"
        >
          {showResult ? "Nueva Partida" : "Iniciar Partida"}
        </button>
      </div>

      {/* - SELECCIONAR COLOR - */}
      <div className="mb-3">
        <div className="color-selector d-flex justify-content-center gap-3">
          <div className="d-flex flex-column align-items-center">
            <button
              className={`colorButton white ${selectedColor === "white" ? "selected" : ""}`}
              onClick={() => setSelectedColor("white")}
              title="Blancas"
            />
          </div>
          <div className="d-flex flex-column align-items-center">
            <button
              className={`colorButton gradient ${selectedColor === "gradient" ? "selected" : ""}`}
              onClick={() => setSelectedColor("gradient")}
              title="Aleatorio"
            />
          </div>
          <div className="d-flex flex-column align-items-center">
            <button
              className={`colorButton black ${selectedColor === "black" ? "selected" : ""}`}
              onClick={() => setSelectedColor("black")}
              title="Negras"
            />
          </div>
        </div>
      </div>

      {/* - BARRA DE VENTAJA - */}
      <div className="form-check text-start mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={showEvaluationBar}
          onChange={(e) => setShowEvaluationBar(e.target.checked)}
          id="evalBarCheckbox"
        />
        <label className="form-check-label" htmlFor="evalBarCheckbox">
          Mostrar barra de ventaja
        </label>
      </div>
      {user && (
        <div className="form-check text-start mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={showBestMove}
            onChange={(e) => setShowBestMove(e.target.checked)}
            id="bestMoveCheckbox"
          />
          <label className="form-check-label" htmlFor="bestMoveCheckbox">
            Mejor Jugada
          </label>
        </div>
      )}

      {/* - DIFICULTAD - */}
      <div className="subMenu mb-2">
        <label className="form-label mb-1 d-block">Dificultad</label>
        <select
          className="form-select bg-dark text-white border-secondary"
          value={localDifficulty}
          onChange={handleDifficultyChange}
        >
          <option value={0}>0  - (650 - 700)</option>
          <option value={1}>1  - (700 - 950)</option>
          <option value={2}>2  - (950 - 1200)</option>
          <option value={3}>3  - (1200 - 1450)</option>
          <option value={4}>4  - (1450 - 1700)</option>
          <option value={5}>5  - (1700 - 1950)</option>
          <option value={6}>6  - (1950 - 2200)</option>
          <option value={7}>7  - (2200 - 2450)</option>
          <option value={8}>8  - (2450 - 2700)</option>
        </select>
      </div>

      {/* - ESTILO DE JUEGO - */}
      <div className="subMenu mb-2">
        <label className="form-label mb-1 d-block">Estilo de juego</label>
        <select
          className="form-select bg-dark text-white border-secondary"
          value={playStyle}
          onChange={(e) => setPlayStyle(e.target.value)}
        >
          <option value="balanced">Equilibrado</option>
          <option value="offensive">Agresivo</option>
          <option value="defensive">Defensivo</option>
        </select>
      </div>

      {/* - DURACIÓN - */}
      <div className="subMenu mb-4">
        <label className="form-label mb-1 d-block">Duración</label>
        <select
          className="form-select bg-dark text-white border-secondary"
          value={timeIndex}
          onChange={handleTimeChange}
        >
          <option value={0}>Bullet - 1 min</option>
          <option value={1}>Bullet - 1 | 1</option>
          <option value={2}>Bullet - 2 | 1</option>
          <option value={3}>Blitz - 3 min</option>
          <option value={4}>Blitz - 3 | 2</option>
          <option value={5}>Blitz - 5 min</option>
          <option value={6}>Blitz - 5 | 3</option>
          <option value={7}>Rapid - 10 min</option>
          <option value={8}>Rapid - 10 | 5</option>
          <option value={9}>Rapid - 15 | 10</option>
          <option value={10}>Infinito</option>
        </select>
      </div>

      {/* - RESULTADO Y GUARDADO - */}
      {showResult && (
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
              <p className="result-saved">Partida guardada ✓</p>
            ) : null}
          </div>
        </>
      )}
    </>
  );
}