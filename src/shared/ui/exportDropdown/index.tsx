import React from "react";
import { Dropdown, Spin } from "antd";
import type { MenuProps } from "antd";
import CustomButton from "../button";
import "./styles.sass"

type ExportType = "group" | "unit";
type ExportFormat = "short" | "long";

interface ExportDropdownButtonProps {
    type: ExportType;
    loading: boolean;
    label: string;
    onExport: (type: ExportType, format: ExportFormat) => void;
    t: (key: string) => string;
}

const ExportDropdownButton: React.FC<ExportDropdownButtonProps> = ({
       type,
       loading,
       label,
       onExport,
       t,
   }) => {
    const menuItems: MenuProps["items"] = [
        {
            key: "short",
            className: "btn outline",
            label: t("export.short"),
            onClick: () => onExport(type, "short"),
        },
        {
            key: "long",
            className: "btn outline",
            label: t("export.long"),
            onClick: () => onExport(type, "long"),
        },
    ];

    return (
        <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            disabled={loading}
            className="export-dropdown"
        >
          <span>
            <CustomButton className="btn">
              {loading ? <Spin size="small" /> : label}
            </CustomButton>
          </span>
        </Dropdown>
    );
};

export default ExportDropdownButton;



