import { useTranslation } from "react-i18next";
import { LuMailPlus } from "react-icons/lu";
import MainLayout from "shared/ui/layout";
import "./styles.sass";

const WelcomePage = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="welcome-page">
        <div className="welcome-card">
          <div className="welcome-card-icon">
            <LuMailPlus />
          </div>
          <span className="welcome-card-brand">AMIS</span>
          <h1 className="welcome-card-title">{t("welcome.title")}</h1>
          <p className="welcome-card-text">{t("welcome.description")}</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default WelcomePage;
