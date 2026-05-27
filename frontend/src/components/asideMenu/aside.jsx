import "./aside.css";
import '../bbuttons/button.css';
import "../../views/styles/menustyle.css";
import { useNavigate } from "react-router-dom";
import { ButtonLeft, ButtonLeftExit } from '../bbuttons/buttonSideMenu';
import Button from '../bbuttons/button';
import { useContext } from 'react'; 
import AuthContext from "../../context/authContext";

export default function AsideMenu() {
  const navigate = useNavigate();

  const { user, handleLogout } = useContext(AuthContext);
  const isLoggedIn = !!user;
  
  const onLogout = () => {
    handleLogout(); 
    navigate("/mainInicio");  
  };

  return (
    <div className="menuLateral">
      <div className="aside-group-left">
        <div className="logo-container">
          <img className="logo" src="/img/logoChessW.png" alt="Logo" />
        </div>

        <nav className="menuNav">
          <ButtonLeft
            img="/menuIcons/PlayW.png"
            type="butStyle"
            text="JUGAR"
            tooltip="Jugar"
            action={() => navigate("/game")}
          />
          <ButtonLeft
            img="/menuIcons/LessonW.png"
            type="butStyle"
            text="HISTORIAL"
            tooltip="Historial de Partidas"
            action={() => navigate("/history")}
          />
          <ButtonLeft
            img="/menuIcons/HistorialW.png"
            type="butStyle"
            text="APERTURAS"
            tooltip="Explorador de Aperturas"
            action={() => navigate("/openings")}
          />
          <ButtonLeft
            img="/menuIcons/RulesW.png"
            type="butStyle3"
            text="INFO.APP"
            tooltip="Info. App"
            action={() => navigate("/infoview")}
          />
        </nav>
      </div>

      <div className="spacer"></div>

      <div className="aside-group-right">
        <div className="bottons-button">
          {!isLoggedIn && (
            <>
              <div className="aside-tooltip-wrapper" data-tooltip="Registrarse">
                <Button
                  type="enPlay"
                  text={<><span className="auth-label-full">REGISTRARSE</span><span className="auth-label-short">R</span></>}
                  color="verde"
                  action={() => navigate("/registrarse")}
                />
              </div>
              <div className="aside-tooltip-wrapper" data-tooltip="Iniciar Sesión">
                <Button
                  type="enPlay"
                  text={<><span className="auth-label-full">INICIAR SESIÓN</span><span className="auth-label-short">I</span></>}
                  color="azul"
                  action={() => navigate("/inicioSesion")}
                />
              </div>
            </>
          )}
        </div>
        <ButtonLeftExit
          typeExit="exit"
          tooltip="Salir"
          text={<><span className="exit-label">Salir</span><img className="exit-icon" src="/Off.png" alt="Salir" /></>}
          action={isLoggedIn ? onLogout : () => navigate("/mainInicio")}
        />
      </div>
    </div>
  );
}