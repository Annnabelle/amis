import React, { useState, useRef, useEffect, useCallback } from "react";
import { Avatar } from "antd";
import { LuUserRound } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../store";
import CustomButton from "../../button";
import "./styles.sass";
import { getUserById } from "../../../store/users";

const UserInfo: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.users.userById);
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, [isOpen]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(getUserById({ id: userId }));
    }
  }, [dispatch]);
  
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleLogout = () => {
    localStorage.removeItem("userName")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userId");
    window.location.href = "/";
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
        <Avatar className="user-avatar" size="large" icon={<LuUserRound className="user-icon" />} />
        <div className="user-text">
          <div className="user-text-container">
            <p className="user-text-container-name">{user?.firstName} {user?.lastName}</p>
          </div>
          <div className="user-text-container">
            <div className="user-text-container-role">
            {user?.role?.name.en || " "}
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
            <CustomButton onClick={handleLogout}>Logout</CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
