import { Select } from "antd";

import {
  renderRoleOption,
  renderRoleTag,
  type RoleOption,
} from "shared/ui/roleSelect/renderers";

type RoleSelectProps = {
  options: RoleOption[];
  loading?: boolean;
  placeholder?: string;
};

/** Выбор ролей участника: один вид в приглашении и в правке. */
const RoleSelect = ({ options, loading, placeholder }: RoleSelectProps) => (
  <Select
    mode="multiple"
    showSearch
    className="input"
    size="large"
    options={options}
    loading={loading}
    optionFilterProp="label"
    optionLabelProp="label"
    optionRender={renderRoleOption}
    tagRender={renderRoleTag}
    placeholder={placeholder}
  />
);

export default RoleSelect;
