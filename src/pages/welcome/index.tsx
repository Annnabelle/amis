import { useTranslation } from "react-i18next";
import MainLayout from "shared/ui/layout";
import "./styles.sass";

const WelcomePage = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="welcome-page">
        <div className="welcome-page-content">
          <h1>{t("welcome.title")}</h1>
          <p>{t("welcome.description")}</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default WelcomePage;
