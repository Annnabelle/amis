import React, { useState, useRef, useEffect, useCallback } from "react";
import { Avatar } from "antd";
import { LuUserRound, LuKeyRound, LuLogOut } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { useAppSelector, useAppDispatch } from "app/store";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./styles.sass";
import { logout } from "entities/users/model";

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
  const dispatch = useAppDispatch();
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
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const go = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <div className="user" ref={dropdownRef}>
      <div
        className={`user-info ${showDropdown ? "" : "user-info-static"} ${isOpen ? "open" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!showDropdown) {
            onProfileClick?.();
            return;
          }
          setIsOpen((prev) => !prev);
        }}
      >
        <Avatar
          className="user-avatar"
          size="large"
          icon={<LuUserRound className="user-icon" />}
        />
        <div className="user-text">
          <div className="user-text-container">
            <p className="user-text-container-name">{displayName}</p>
          </div>
        </div>
        {showDropdown && (
          <div className="user-arrow">
            <IoIosArrowDown />
          </div>
        )}
      </div>
      {showDropdown && isOpen && (
        <div className="user-dropdown">
          {showProfileAction && (
            <>
              <button type="button" className="user-dropdown-item" onClick={() => go("/profile")}>
                <LuUserRound className="user-dropdown-item-icon" />
                <span>{t("me.title")}</span>
              </button>
              <button type="button" className="user-dropdown-item" onClick={() => go("/change-password")}>
                <LuKeyRound className="user-dropdown-item-icon" />
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
            <LuLogOut className="user-dropdown-item-icon" />
            <span>{t("users.logOut")}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;





