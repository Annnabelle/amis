import { useEffect, useState } from "react";
import { FieldTimeOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { emitAuthSessionExpired, getSessionEnd } from "shared/lib/authSession";
import "./styles.sass";

/** Остаток сессии в секундах; null — срока нет, таймер нечему показывать. */
const secondsLeft = (): number | null => {
  const sessionEnd = getSessionEnd();

  if (sessionEnd === null) return null;

  return Math.max(0, Math.floor((sessionEnd - Date.now()) / 1000));
};

const Session = () => {
  const { t } = useTranslation();

  const [timeLeft, setTimeLeft] = useState<number | null>(secondsLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = secondsLeft();

      setTimeLeft(remaining);

      // Выход — один путь, через AuthSessionGuard: виджет только сообщает событие.
      if (remaining === 0) {
        emitAuthSessionExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--:--";
    if (seconds <= 0) return "00:00:00";

    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
      <div className="session">
        <div className="session-container">
          <div className="session-container-items">
            <div className="session-container-items-item">
              <div className="item-icon">
                <FieldTimeOutlined />
              </div>
            </div>
          </div>
          <div className="session-container-items">
            <div className="session-container-items-item">
              <div className="item-title">
                <p className="title">{t("sessionEndsIn")}:</p>
              </div>
            </div>
            <div className="session-container-items-item">
              <div className="item-timer">
                <p className="timer">{formatTime(timeLeft)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Session;
