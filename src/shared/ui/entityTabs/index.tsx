import { Tabs } from "antd";
import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import "./styles.sass";

export type EntityTabItem = {
  key: string;
  label: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
};

/** Ключ первой, сводной вкладки карточки сущности — общий для всех карточек. */
export const OVERVIEW_TAB_KEY = "overview";

type EntityTabsProps = {
  items: EntityTabItem[];
  /** Имя query-параметра, в котором живёт активная вкладка. */
  paramName?: string;
  defaultActiveKey?: string;
  className?: string;
  /** Вкладки-соседи не монтируются, пока их не открыли. */
  lazy?: boolean;
  /** true — переключение вкладок не копится в истории браузера. */
  replaceHistory?: boolean;
  size?: "small" | "middle" | "large";
};

/**
 * Вкладки карточки сущности с синхронизацией в URL: ссылка на вкладку
 * открывается такой же, «назад» работает предсказуемо.
 */
const EntityTabs = ({
  items,
  paramName = "tab",
  defaultActiveKey,
  className,
  lazy = true,
  replaceHistory = true,
  size = "large",
}: EntityTabsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const availableKeys = useMemo(
    () => items.filter((item) => !item.disabled).map((item) => item.key),
    [items]
  );
  const fallbackKey = defaultActiveKey ?? availableKeys[0] ?? items[0]?.key ?? "";
  const requestedKey = searchParams.get(paramName);
  const activeKey =
    requestedKey && availableKeys.includes(requestedKey)
      ? requestedKey
      : fallbackKey;

  const handleChange = useCallback(
    (key: string) => {
      const nextParams = new URLSearchParams(searchParams);

      if (key === fallbackKey) {
        nextParams.delete(paramName);
      } else {
        nextParams.set(paramName, key);
      }

      setSearchParams(nextParams, { replace: replaceHistory });
    },
    [fallbackKey, paramName, replaceHistory, searchParams, setSearchParams]
  );

  return (
    <Tabs
      className={["entity-tabs", className].filter(Boolean).join(" ")}
      activeKey={activeKey}
      onChange={handleChange}
      size={size}
      destroyOnHidden={false}
      items={items.map((item) => ({
        key: item.key,
        label: item.label,
        disabled: item.disabled,
        children: item.children,
        /** Монтируем содержимое вкладки только после первого открытия. */
        forceRender: !lazy,
      }))}
    />
  );
};

export default EntityTabs;
