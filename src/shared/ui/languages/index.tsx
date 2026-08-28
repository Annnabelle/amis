import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";
import { useAppDispatch } from "app/store";
import { updateUserPreferences } from "entities/users/model";
import { isLanguage } from "shared/types/dtos";

import "./styles.sass";

const flagMap: Record <string, string> = {
  en: "English",
  ru: "Русский",
  uz: "Uzbek",
};

const Languages: React.FC = () => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
     if (isOpen && userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
       setIsOpen(false);
     }
   }, [isOpen]);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [handleClickOutside])
  const handleLanguageChange = (language: string) => {
    if (!isLanguage(language)) return;

    void i18n.changeLanguage(language);
    void dispatch(updateUserPreferences({ language }));
    setIsOpen(false);
  };

  return (
    <div className='language-switcher' ref={userDropdownRef}>
      <div
        className={`selected-language ${isOpen ? "open" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev)
        }}
      >
        <p
          className='flag'
        >{flagMap[i18n.language]}</p>  <IoIosArrowDown />
        <div className='dropdown-arrow'></div>
      </div>
      {isOpen && (
        <div className='dropdown-menu'>
          {Object.keys(flagMap).map((language) => (
            <div
              key={language}
              className='language-option'
              onClick={() => handleLanguageChange(language)}
            >
              <p
                className='flag'
              >{flagMap[language]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Languages;


