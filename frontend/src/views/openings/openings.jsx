import "../styles/menustyle.css";
import "./openings.css";
import { useState, useEffect, useContext } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import AsideMenu from '../../components/asideMenu/aside';
import MatchMenu from '../../components/gameMenu/matchMenu';
import ChessGame from '../../components/chessboard/ChessGame';
import { getLichessData } from '../../services/openings.service';
import { saveMatch } from '../../services/match.service';
import AuthContext from '../../context/authContext';
import useClue from '../../components/gameMenu/clue';

const Openings = () => {
  const { user, isAuthLoading } = useContext(AuthContext);

  // --- ESTADO EXPLORADOR ---
  const [game, setGame] = useState(new Chess());
  const [openingData, setOpeningData] = useState(null);
  const [difficulty, setDifficulty] = useState(3);
  const [fenHistory, setFenHistory] = useState([]);
  const [isFirstMove, setIsFirstMove] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [openingMoveHistory, setOpeningMoveHistory] = useState([]);
  const [openingStartFen, setOpeningStartFen] = useState(null);
  const [boardWidth, setBoardWidth] = useState(400);

  // --- ESTADO MODO PARTIDA ---
  const [gameStarted, setGameStarted] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [boardEvaluation, setBoardEvaluation] = useState(0);
  const [showEvaluationBar, setShowEvaluationBar] = useState(true);
  const [gameResult, setGameResult] = useState(null);
  const [selectedColor, setSelectedColor] = useState('white');
  const [resetKey, setResetKey] = useState(0);
  const [currentFen, setCurrentFen] = useState('start');
  const { clueArrow, handleClue, clearClue } = useClue(currentFen);

  // --- AJUSTA EL TAMAÑO DEL TABLERO ---
  useEffect(() => {
    const updateBoardSize = () => {
      const h = window.innerHeight * 0.8;
      const w = window.innerWidth * 0.9;
      setBoardWidth(Math.min(h, w));
    };
    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  // --- FLECHAS CON OPACIDAD PROPORCIONAL A POPULARIDAD ---
  const computeArrows = (data) => {
    if (!data?.moves?.length) return [];

    const moves = data.moves
      .filter(m => m.uci?.length >= 4)
      .map(m => ({ ...m, total: (m.white ?? 0) + (m.draws ?? 0) + (m.black ?? 0) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);

    if (!moves.length) return [];
    const maxTotal = moves[0].total;
    if (maxTotal === 0) return [];

    const MIN_OPACITY = 0.25;
    return moves.map(m => {
      const opacity = MIN_OPACITY + (1 - MIN_OPACITY) * (m.total / maxTotal);
      return [m.uci.slice(0, 2), m.uci.slice(2, 4), `rgba(0, 200, 120, ${opacity.toFixed(2)})`];
    });
  };

  // --- FETCH DATOS DE APERTURA ---
  const fetchOpeningData = async (gameInstance) => {
    try {
      const data = await getLichessData(gameInstance.fen());
      setOpeningData(data);
    } catch {
      setOpeningData({ moves: [], opening: null, white: 0, draws: 0, black: 0 });
    }
  };

  // Lichess almacena enroques como king-to-rook (e1h1), chess.js usa king-to-dest (e1g1)
  const CASTLING_TO_DEST  = { 'e1h1': 'g1', 'e1a1': 'c1', 'e8h8': 'g8', 'e8a8': 'c8' };
  const CASTLING_TO_ROOK  = { 'e1g1': 'e1h1', 'e1c1': 'e1a1', 'e8g8': 'e8h8', 'e8c8': 'e8a8' };

  // --- DRAG & DROP: PRIMER MOVIMIENTO LIBRE, RESTO SOLO SI COINCIDE CON UNA VARIANTE ---
  const handlePieceDrop = (sourceSquare, targetSquare) => {
    if (isGameStarted) return false;

    const newGame = new Chess(game.fen());

    // Si el usuario arrastra el rey a la casilla de la torre, convierte al destino estándar
    const fixedTarget = CASTLING_TO_DEST[sourceSquare + targetSquare] || targetSquare;

    let move;
    try {
      move = newGame.move({ from: sourceSquare, to: fixedTarget, promotion: 'q' });
    } catch { return false; }
    if (!move) return false;

    if (isFirstMove) {
      setFenHistory([game.fen()]);
      setOpeningMoveHistory([move.san]);
      setGame(newGame);
      setIsFirstMove(false);
      fetchOpeningData(newGame);
      return true;
    }

    // Compara contra formato chess.js (e1g1) Y formato Lichess (e1h1)
    const moveUci = move.from + move.to + (move.promotion || '');
    const altUci  = CASTLING_TO_ROOK[moveUci] || moveUci;
    const match   = openingData?.moves?.find(m => m.uci === moveUci || m.uci === altUci);
    if (!match) return false;

    setFenHistory(prev => [...prev, game.fen()]);
    setOpeningMoveHistory(prev => [...prev, move.san]);
    setGame(newGame);
    fetchOpeningData(newGame);
    return true;
  };

  // --- RETROCEDER UN MOVIMIENTO ---
  const handlePrevMove = () => {
    if (fenHistory.length === 0) return;

    const prevFen = fenHistory[fenHistory.length - 1];
    const newGame = new Chess(prevFen);
    const newFenHistory = fenHistory.slice(0, -1);
    const newMoveHistory = openingMoveHistory.slice(0, -1);

    setGame(newGame);
    setFenHistory(newFenHistory);
    setOpeningMoveHistory(newMoveHistory);

    if (newFenHistory.length === 0) {
      setIsFirstMove(true);
      setOpeningData(null);
    } else {
      fetchOpeningData(newGame);
    }
  };

  // --- VOLVER AL INICIO ---
  const handleGoStart = () => {
    setGame(new Chess());
    setFenHistory([]);
    setOpeningMoveHistory([]);
    setIsFirstMove(true);
    setOpeningData(null);
  };

  // --- EMPEZAR PARTIDA DESDE LA POSICIÓN ACTUAL ---
  const handleStartGame = () => {
    setOpeningStartFen(game.fen());
    setGameResult(null);
    setMoveHistory([]);       // ChessGame gestiona solo los movimientos de la partida;
    setIsGameStarted(true);   // la apertura vive en openingMoveHistory
    setGameStarted(true);
  };

  // --- REINICIAR PARTIDA (desde ConfigMenu tras resultado) ---
  const handleResetGame = () => {
    setGameResult(null);
    setGameStarted(false);
    setMoveHistory([]);
    setResetKey(prev => prev + 1);
    setTimeout(() => setGameStarted(true), 100);
  };

  // --- FIN DE PARTIDA ---
  const handleGameEnd = (data) => {
    setGameStarted(false);
    setIsGameStarted(false);
    setGameResult({
      winner: data.winner || 'draw',
      reason: data.reason || 'unknown',
      finalFen: data.finalFen || '',
    });
  };

  // --- GUARDAR PARTIDA ---
  const handleSaveGame = () => {
    if (isAuthLoading || !user || !gameResult) return;
    // Historial completo: movimientos de apertura + movimientos de la partida
    const fullMoveHistory = [...openingMoveHistory, ...moveHistory];
    saveMatch({
      user: user._id,
      playerColor: selectedColor,
      winner: gameResult.winner,
      resultReason: gameResult.reason,
      moveHistory: fullMoveHistory,
      totalMoves: fullMoveHistory.length,
      difficulty,
      finalFen: gameResult.finalFen,
    }).catch(() => {});
  };

  const isAtStart = fenHistory.length === 0;
  const openingArrows = computeArrows(openingData);
  // Historial visible durante la partida (apertura + movimientos reales)
  const fullMoveHistory = [...openingMoveHistory, ...moveHistory];

  return (
    <div className="vh-100 img-fondo2">
      <div className="row w-100 h-100 m-0">

        {/* --- ASIDE --- */}
        <div className="col-xl-1 col-12 px-0 d-flex">
          <aside className="menuLateral">
            <AsideMenu />
          </aside>
        </div>

        {/* --- TABLERO --- */}
        <div className="col-xl-7 col-12 d-flex align-items-center justify-content-center">
          <div className="game-board-layout">
            <div className="game-board-panel">
              <div className="board-header">
                <span className="username">
                  {isGameStarted ? `Dificultad ${difficulty}` : 'Explorador de Aperturas'}
                </span>
              </div>

              {isGameStarted ? (
                <ChessGame
                  className="game-chessboard"
                  gameStarted={gameStarted}
                  selectedColor={selectedColor}
                  resetKey={resetKey}
                  initialFen={openingStartFen}
                  onMoveHistory={setMoveHistory}
                  onEvaluation={setBoardEvaluation}
                  difficulty={difficulty}
                  playStyle="balanced"
                  onGameEnd={handleGameEnd}
                  onFenChange={(fen) => { setCurrentFen(fen); clearClue(); }}
                  clueArrow={clueArrow}
                />
              ) : (
                <Chessboard
                  boardWidth={boardWidth}
                  position={game.fen()}
                  boardOrientation={selectedColor}
                  onPieceDrop={handlePieceDrop}
                  customArrows={openingArrows}
                  customBoardStyle={{
                    borderRadius: '4px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}
                />
              )}

              <div className="board-footer">
                <span className="username">{user?.name || 'Explorador'}</span>
                {openingMoveHistory.length > 0 && (
                  <span className="tiempo">{openingMoveHistory.length} mov.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- PANEL DERECHO --- */}
        <div className="col-xl-4 col-12 d-flex align-items-center justify-content-center">
          <MatchMenu
            isOpeningsMode={!isGameStarted}
            openingData={openingData}
            isAtStart={isAtStart}
            onPrevMove={handlePrevMove}
            onGoStart={handleGoStart}
            onStartGame={handleStartGame}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            gameStarted={gameStarted}
            moveHistory={fullMoveHistory}
            showEvaluationBar={showEvaluationBar}
            setShowEvaluationBar={setShowEvaluationBar}
            gameResult={gameResult}
            onSaveGame={handleSaveGame}
            onGameEnd={handleGameEnd}
            onResetGame={handleResetGame}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            setDifficulty={setDifficulty}
            onClue={handleClue}
          />
        </div>

      </div>
    </div>
  );
};

export default Openings;
