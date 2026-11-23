import React, { useCallback, useEffect, useRef, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { isLanguage, type Language } from "shared/types/dtos";
import { persistLanguage } from "shared/lib/languagePreference";

import "./styles.sass";

const flagMap: Record <string, string> = {
  en: "English",
  ru: "Русский",
  uz: "Uzbek",
};

type LanguagesProps = {
  /** Что сделать с выбранным языком помимо переключения интерфейса. */
  onLanguageChange?: (language: Language) => void;
};

const Languages: React.FC<LanguagesProps> = ({ onLanguageChange }) => {
  const { i18n } = useTranslation();
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
    persistLanguage(language);
    onLanguageChange?.(language);
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
        >{flagMap[i18n.language]}</p>  <DownOutlined />
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


