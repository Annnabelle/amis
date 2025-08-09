import React, { useState, useRef, useEffect, useCallback } from "react";
import { Avatar } from "antd";
import { LuUserRound } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import Button from "../../button";
import "./styles.sass";

const UserInfo: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, [isOpen]);
  
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
            <p className="user-text-container-name">User name</p>
          </div>
          <div className="user-text-container">
            <div className="user-text-container-role">
            Admin
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
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
