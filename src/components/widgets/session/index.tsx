import { useEffect, useState } from "react";
import { FieldTimeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {useAppDispatch} from "../../../store";
import {logout} from "../../../store/users";
import "./styles.sass";

const Session = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const SESSION_DURATION = 60 * 60;

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const sessionEnd = localStorage.getItem("sessionEnd");
    if (sessionEnd) {
      return Math.floor((parseInt(sessionEnd) - Date.now()) / 1000);
    }
    return SESSION_DURATION;
  });

  useEffect(() => {
    const sessionEndStr = localStorage.getItem("sessionEnd");
    let endTimestamp: number;

    if (sessionEndStr) {
      endTimestamp = parseInt(sessionEndStr);
    } else {
      endTimestamp = Date.now() + SESSION_DURATION * 1000;
      localStorage.setItem("sessionEnd", String(endTimestamp));
    }

    const timer = setInterval(() => {
      const remaining = Math.floor((endTimestamp - Date.now()) / 1000);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        dispatch(logout());
        navigate("/");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, navigate]);

  const formatTime = (seconds: number) => {
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