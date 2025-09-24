import React, { useState, useRef, useEffect, useCallback } from "react";
import { Avatar } from "antd";
import { LuUserRound } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { useAppSelector, useAppDispatch } from "../../../store";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../../button";
import "./styles.sass";
import { clearUser } from "../../../store/users";

const UserInfo: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((s) => s.users.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // клик вне дропдауна
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
    localStorage.removeItem("userName");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    dispatch(clearUser()); // очистим Redux
    navigate("/", { replace: true }); // уйдём на login без reload
  };

  return (
    <div className="user" ref={dropdownRef}>
      <div
        className="user-info"
        onClick={(e) => {
          e.stopPropagation();
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
            <p className="user-text-container-name">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div className="user-text-container">
            <div className="user-text-container-role">
              {user?.role?.name?.en || ""}
            </div>
          </div>
        </div>
        <div className="user-arrow">
          <IoIosArrowDown />
        </div>
      </div>
      {isOpen && (
        <div className="user-dropdown">
          <div className="user-dropdown-action">
            <CustomButton className="outline">
              <Link to="/profile">{t("users.changePassword")}</Link>
            </CustomButton>
          </div>
          <div className="user-dropdown-action">
            <CustomButton onClick={handleLogout}>{t("users.logOut")}</CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;


