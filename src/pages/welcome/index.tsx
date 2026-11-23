import { useTranslation } from "react-i18next";
import { MailOutlined } from "@ant-design/icons";
import MainLayout from "widgets/appShell";
import "./styles.sass";

const WelcomePage = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="welcome-page">
        <div className="welcome-card">
          <div className="welcome-card-icon">
            <MailOutlined />
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
