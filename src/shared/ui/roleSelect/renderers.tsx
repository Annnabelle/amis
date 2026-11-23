import { Tag, Tooltip, type SelectProps } from "antd";

import "./styles.sass";

export type RoleOption = {
  value: string;
  label: string;
  description: string;
};

/** Выбранная роль остаётся тегом: их у участника бывает несколько. */
export const renderRoleTag: SelectProps["tagRender"] = ({ label, closable, onClose }) => (
  <Tag
    className="role-select-tag"
    closable={closable}
    onClose={onClose}
    onMouseDown={(event) => {
      event.preventDefault();
      event.stopPropagation();
    }}
  >
    {label}
  </Tag>
);

/** Описание роли показывается подсказкой: в строке списка оно не помещается. */
export const renderRoleOption = (option: { data: RoleOption }) => (
  <Tooltip placement="right" title={option.data.description}>
    <div className="role-select-option">{option.data.label}</div>
  </Tooltip>
);
