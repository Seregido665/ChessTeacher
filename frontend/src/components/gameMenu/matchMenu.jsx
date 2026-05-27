import { useContext, useState } from 'react';
import AuthContext from "../../context/authContext";
import ConfigMenu from './configMenu';
import GameMatchMenu from './gameMatchMenu';
import AnalyzeMenu from './analyzeMenu';
import OpeningsMenu from './openingsMenu';
import "./matchMenu.css";

export default function MatchMenu({
  gameStarted,
  onStartGame,
  onTimeChange,
  onResetGame,
  selectedColor,
  setSelectedColor,
  moveHistory = [],
  showEvaluationBar,
  setShowEvaluationBar,
  setDifficulty,
  playStyle,
  setPlayStyle,
  gameResult,
  onSaveGame,
  onGameEnd,
  onClue,
  isAnalysisMode = false,
  isOpeningsMode = false,
  openingData,
  isAtStart,
  difficulty,
  onDifficultyChange,
  match,
  currentMoveIndex,
  onGoStart,
  onPrevMove,
  onNextMove,
  onGoEnd,
  onSelectMove,
  moveQualities = [],
  onFlipBoard,
}) {
  
  const { user } = useContext(AuthContext);
  const [showBestMove, setShowBestMove] = useState(true);
  const showResult = !!gameResult;
  const isGameActive = gameStarted && !showResult;

  return (
    <div className="match-menu-container">
      {isOpeningsMode ? (
        // Modo APERTURAS
        <OpeningsMenu
          openingData={openingData}
          isAtStart={isAtStart}
          onPrevMove={onPrevMove}
          onGoStart={onGoStart}
          onStartGame={onStartGame}
          difficulty={difficulty}
          onDifficultyChange={onDifficultyChange}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          gameResult={gameResult}
          onSaveGame={onSaveGame}
        />
      ) : isAnalysisMode ? (
        // Modo ANÁLISIS
        <AnalyzeMenu
          match={match}
          moveHistory={moveHistory}
          moveQualities={moveQualities}
          currentMoveIndex={currentMoveIndex}
          onGoStart={onGoStart}
          onPrevMove={onPrevMove}
          onNextMove={onNextMove}
          onGoEnd={onGoEnd}
          onSelectMove={onSelectMove}
          onFlipBoard={onFlipBoard}
        />
      ) : isGameActive ? (
        // Modo PARTIDA EN CURSO
        <GameMatchMenu
          moveHistory={moveHistory}
          onGameEnd={onGameEnd}
          selectedColor={selectedColor}
          onClue={onClue}
          showBestMove={showBestMove}
        />
      ) : (
        // Modo CONFIGURACIÓN 
        <ConfigMenu
          gameStarted={gameStarted}
          showResult={showResult}
          gameResult={gameResult}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          showEvaluationBar={showEvaluationBar}
          setShowEvaluationBar={setShowEvaluationBar}
          showBestMove={showBestMove}
          setShowBestMove={setShowBestMove}
          setDifficulty={setDifficulty}
          playStyle={playStyle}
          setPlayStyle={setPlayStyle}
          user={user}
          onSaveGame={onSaveGame}
          onStartGame={onStartGame}
          onTimeChange={onTimeChange}
          onResetGame={onResetGame}
        />
      )}
    </div>
  );
}