import { Button, Dropdown, Menu } from "antd";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";
import CustomButton from "shared/ui/button";

type CellValue = ReactNode;

interface TextCellProps {
  value: CellValue;
  maxWidth?: CSSProperties["maxWidth"];
}

interface LinkCellProps extends TextCellProps {
  to: string;
}

interface CenteredCellProps {
  children: ReactNode;
}

export interface ActionDropdownItem {
  key: string;
  label: ReactNode;
  className?: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface ActionDropdownButtonProps {
  actions: Array<ActionDropdownItem | false | null | undefined>;
}

const ellipsisStyle = (maxWidth?: CSSProperties["maxWidth"]): CSSProperties | undefined =>
  maxWidth
    ? {
        maxWidth,
      }
    : undefined;

export const TextCell = ({ value, maxWidth }: TextCellProps) => (
  <p className="table-text" style={ellipsisStyle(maxWidth)}>
    {value}
  </p>
);

export const LinkCell = ({ value, to, maxWidth }: LinkCellProps) => (
  <Link className="table-link" to={to} style={ellipsisStyle(maxWidth)}>
    {value}
  </Link>
);

export const CenteredCell = ({ children }: CenteredCellProps) => (
  <div className="table-centered-cell">{children}</div>
);

export const ActionDropdownButton = ({ actions }: ActionDropdownButtonProps) => {
  const menuItems = actions
    .filter((action): action is ActionDropdownItem => Boolean(action))
    .map((action) => ({
      key: action.key,
      label: (
        <CustomButton
          type="button"
          className={action.className}
          onClick={(event) => {
            event.stopPropagation();
            action.onClick(event);
          }}
        >
          {action.label}
        </CustomButton>
      ),
    }));

  if (!menuItems.length) {
    return null;
  }

  return (
    <CenteredCell>
      <Dropdown
        overlay={<Menu items={menuItems} />}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button
          className="table-action-trigger"
          onClick={(event) => event.stopPropagation()}
          type="text"
          icon={<HiDotsHorizontal />}
        />
      </Dropdown>
    </CenteredCell>
  );
};
