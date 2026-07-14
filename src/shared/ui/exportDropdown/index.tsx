import React from "react";
import { Dropdown, Spin } from "antd";
import type { MenuProps } from "antd";
import CustomButton from "../button";
import "./styles.sass"

type ExportType = "group" | "unit";
type ExportFormat = "short" | "long" | "long_with_group_snapshot";

type ExportDropdownOption = {
    key: ExportFormat;
    label: string;
};

interface ExportDropdownButtonProps {
    type: ExportType;
    loading: boolean;
    label: string;
    onExport: (type: ExportType, format: ExportFormat) => void;
    t: (key: string) => string;
    extraOptions?: ExportDropdownOption[];
}

const ExportDropdownButton: React.FC<ExportDropdownButtonProps> = ({
       type,
       loading,
       label,
       onExport,
       t,
       extraOptions = [],
   }) => {
    const menuItems: MenuProps["items"] = [
        {
            key: "short",
            className: "btn outline",
            label: t("export.short"),
        },
        {
            key: "long",
            className: "btn outline",
            label: t("export.long"),
        },
        ...extraOptions.map((option) => ({
            key: option.key,
            className: "btn outline",
            label: option.label,
        })),
    ];

    const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
        if (key === "short" || key === "long" || key === "long_with_group_snapshot") {
            onExport(type, key as ExportFormat);
        }
    };

    return (
        <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
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



