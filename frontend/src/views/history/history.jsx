import "../styles/menustyle.css";
import { useContext, useEffect, useRef, useState } from 'react'
import MatchCard from '../../components/matchCard/matchCard';
import AsideMenu from '../../components/asideMenu/aside';
import { getMatches, deleteMatch, saveMatch } from '../../services/match.service';
import AuthContext from '../../context/authContext';
import { buildMatchDataFromPgnFile } from '../../utils/importPGN';

const Historial = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const isLoggedIn = !!user;
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await getMatches();
        setMatches(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMatches();
  }, [user]);

  // -- ELIMINAR PARTIDA --
  const handleDelete = async (matchId) => {
    try {
      await deleteMatch(matchId);
      setMatches((prevMatches) => prevMatches.filter(m => m.id !== matchId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportPGN = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const matchData = await buildMatchDataFromPgnFile(file, user?._id);
      const response = await saveMatch(matchData);
      const importedMatch = response?.data?.match;

      if (importedMatch) {
        setMatches((prev) => [importedMatch, ...prev]);
      }
    } catch (err) {
      setImportError(err);
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return (
    <div className="vh-100 img-fondo2">
          <div className="row w-100 h-100 m-0">
            <div className="col-xl-2 col-md-1 col-12 px-0 d-flex">
              <aside className="menuLateral">
                <AsideMenu />
              </aside>
            </div>

        <div className="historyMenu col-xl-10 col-md-9 col-12 d-flex flex-column align-items-center justify-content-start py-4">
          <h2 className="text-white mb-4 match-history-tittle">Historial</h2>
          {isLoggedIn && (
            <>
              <button
                type="button"
                className="import-btn mb-4"
                onClick={handleImportClick}
                disabled={isImporting}
              >
                {isImporting ? 'Importando...' : 'Importar partida'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pgn"
                style={{ display: 'none' }}
                onChange={handleImportPGN}
              />
            </>
          )}

          {importError && (
            <div className="text-danger mb-3">{importError}</div>
          )}

          {!isLoggedIn && (
            <div className="text-center mt-5" style={{
              background: 'rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '2rem 3rem',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
              <p style={{ fontSize: '1rem', color: 'rgb(255, 255, 255)', margin: 0 }}>
                Debes iniciar sesión para tener historial de partidas.
              </p>
            </div>
          )}

          {isLoggedIn && matches.length === 0 && (
            <div className="text-white text-center">
              <p>No tienes partidas guardadas aún</p>
              <p>¡Juega tu primera partida!</p>
            </div>
          )}

          {isLoggedIn && matches.length > 0 && (
            <div 
              className="matchList w-100"
              style={{ 
                maxHeight: '80vh', 
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',  // ← clave
                gap: '16px',
                padding: '0 8px'
              }}
            >
              {matches.map((match) => (
                <MatchCard 
                  key={match.id}
                  match={match} 
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Historial;

