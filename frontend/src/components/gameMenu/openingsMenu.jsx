import "./matchMenu.css";
import GameResult from '../result/result';

export default function OpeningsMenu({
  openingData,
  onPrevMove,
  onGoStart,
  onStartGame,
  difficulty,
  onDifficultyChange,
  isAtStart,
  selectedColor,
  setSelectedColor,
  gameResult,
  onSaveGame,
}) {
  const showResult = !!gameResult;

  const renderInfoBox = () => {
    if (openingData === null) return null;

    const total = (openingData.white ?? 0) + (openingData.draws ?? 0) + (openingData.black ?? 0);
    const noMoves = !openingData.moves || openingData.moves.length === 0;

    if (noMoves || total === 0) {
      return <p className="opening-no-data">No existen datos de esta apertura.</p>;
    }

    if (!openingData.opening?.name) return null;

    return (
      <>
        {openingData.opening.eco && (
          <p className="opening-eco">{openingData.opening.eco}</p>
        )}
        <p className="opening-name">{openingData.opening.name}</p>
      </>
    );
  };

  return (
    <>
      <h5 className="text-center mb-3">Apertura:</h5>

      {/* - INFO DE APERTURA - */}
      <div className="opening-info-box mb-3">
        {renderInfoBox()}
      </div>

      {/* - NAVEGACIÓN - */}
      <div className="analyze-controls mb-3">
        <button
          type="button"
          className="analysis-nav-btn"
          onClick={onGoStart}
          disabled={isAtStart}
          title="Ir al inicio"
        >
          <img src="/botonesAnalisis/First.jpg" alt="Ir al inicio" className="analysis-nav-icon" />
        </button>
        <button
          type="button"
          className="analysis-nav-btn"
          onClick={onPrevMove}
          disabled={isAtStart}
          title="Retroceder un movimiento"
        >
          <img src="/botonesAnalisis/Prev.jpg" alt="Retroceder" className="analysis-nav-icon" />
        </button>
      </div>

      {/* - EMPEZAR PARTIDA - */}
      <div className="text-center">
        <button
          type="button"
          className="matchButton inicio"
          onClick={onStartGame}
        >
          Jugar posición
        </button>
      </div>

      {/* - SELECTOR DE COLOR - */}
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
              className={`colorButton black ${selectedColor === "black" ? "selected" : ""}`}
              onClick={() => setSelectedColor("black")}
              title="Negras"
            />
          </div>
        </div>
      </div>

      {/* - DIFICULTAD - */}
      <div className="subMenu mb-3">
        <label className="form-label mb-1 d-block">Dificultad</label>
        <select
          className="form-select bg-dark text-white border-secondary"
          value={difficulty}
          onChange={(e) => onDifficultyChange(Number(e.target.value))}
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

      {/* - RESULTADO Y GUARDADO - */}
      <GameResult
        showResult={showResult}
        gameResult={gameResult}
        selectedColor={selectedColor}
        onSaveGame={onSaveGame}
      />
    </>
  );
}
