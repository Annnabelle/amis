import React, { useState, useRef, useEffect, useCallback } from "react";
import { activateOnKey } from "shared/lib/keyboardActivate";
import { routes } from "shared/config/routes";
import { DownOutlined, KeyOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useAppSelector } from "app/store";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./styles.sass";
import { useLogout } from "entities/users/lib/useLogout";

type UserInfoProps = {
  showDropdown?: boolean;
  onProfileClick?: () => void;
  showProfileAction?: boolean;
};

const UserInfo: React.FC<UserInfoProps> = ({
  showDropdown = true,
  onProfileClick,
  showProfileAction = true,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((s) => s.users.currentUser);
  const requestLogout = useLogout();
  const navigate = useNavigate();

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleLogout = () => {
    void requestLogout().then(() => navigate(routes.login(), { replace: true }));
  };

  const go = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  const handleUserInfoActivate = () => {
    if (!showDropdown) {
      onProfileClick?.();
      return;
    }

    setIsOpen((prev) => !prev);
  };

  return (
    <div className="user" ref={dropdownRef}>
      <div
        className={`user-info ${showDropdown ? "" : "user-info-static"} ${isOpen ? "open" : ""}`}
        role="button"
        tabIndex={0}
        aria-haspopup={showDropdown ? "menu" : undefined}
        aria-expanded={showDropdown ? isOpen : undefined}
        onKeyDown={activateOnKey(handleUserInfoActivate)}
        onClick={(e) => {
          e.stopPropagation();
          handleUserInfoActivate();
        }}
      >
        <Avatar
          className="user-avatar"
          size="large"
          icon={<UserOutlined className="user-icon" />}
        />
        <div className="user-text">
          <div className="user-text-container">
            <p className="user-text-container-name">{displayName}</p>
          </div>
        </div>
        {showDropdown && (
          <div className="user-arrow">
            <DownOutlined />
          </div>
        )}
      </div>
      {showDropdown && isOpen && (
        <div className="user-dropdown">
          {showProfileAction && (
            <>
              <button type="button" className="user-dropdown-item" onClick={() => go(routes.profile())}>
                <UserOutlined className="user-dropdown-item-icon" />
                <span>{t("me.title")}</span>
              </button>
              <button type="button" className="user-dropdown-item" onClick={() => go(routes.changePassword())}>
                <KeyOutlined className="user-dropdown-item-icon" />
                <span>{t("changePwd.title")}</span>
              </button>
              <div className="user-dropdown-divider" />
            </>
          )}
          <button
            type="button"
            className="user-dropdown-item user-dropdown-item--danger"
            onClick={handleLogout}
          >
            <LogoutOutlined className="user-dropdown-item-icon" />
            <span>{t("users.logOut")}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;





