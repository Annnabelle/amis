import { Form, Select, Tag, Tooltip, type SelectProps } from "antd";
import type { CSSProperties } from "react";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "app/store";
import { useCan } from "entities/access/lib";
import { fetchAssignableRoles, fetchRoleReferences } from "entities/access/model";
import { RoleReferenceScope, type RoleReference } from "entities/access/types";
import {
  createSystemEmployeeInvitation,
  deleteSystemEmployee,
  getSystemEmployeeById,
  getSystemEmployees,
  updateSystemEmployeeRoles,
} from "entities/systemEmployees/model";
import {
  UserSystemAccessState,
  type SystemRole,
  type SystemEmployee,
  type SystemEmployeeListQuery,
} from "entities/systemEmployees/types";
import {
  SystemEmployeesTableColumns,
} from "entities/systemEmployees/ui/tableData/systemEmployees";
import type { SystemEmployeeTableDataType } from "entities/systemEmployees/ui/tableData/systemEmployees/types";
import { searchUsers } from "entities/users/model";
import type { UserResponse } from "entities/users/types";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import CustomButton from "shared/ui/button";
import FilterBar from "shared/ui/filterBar/filterBar";
import FilterBarItem from "shared/ui/filterBar/filterBarItems";
import FormComponent from "shared/ui/formComponent";
import MainLayout from "shared/ui/layout";
import Heading from "shared/ui/mainHeading";
import ModalWindow from "shared/ui/modalWindow";
import ComponentTable from "shared/ui/table";
import { statusColors } from "shared/ui/statuses";
import { isLanguage, type Language } from "shared/types/dtos";
import { FormatUzbekPhoneNumber } from "shared/lib/utils";
import "./styles.sass";

type InviteForm = {
  userId: string;
  roles: SystemRole[];
};

type RolesForm = {
  roles: SystemRole[];
};

type RoleOption = {
  value: SystemRole;
  label: string;
  description: string;
};

const getEmployeeName = (employee: SystemEmployee) =>
  [employee.user.name.first, employee.user.name.last].filter(Boolean).join(" ") ||
  employee.user.email;

const renderRoleTag: SelectProps["tagRender"] = ({ label, closable, onClose }) => (
  <Tag
    className="system-employees-role-tag"
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

const getLocalizedText = (
  value: Record<Language, string>,
  language: Language
) => value[language] || value.ru || value.en || value.uz;

const renderRoleOption = (option: { data: RoleOption }) => (
  <Tooltip placement="right" title={option.data.description}>
    <div className="system-employees-role-option">{option.data.label}</div>
  </Tooltip>
);

const SystemEmployees = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const canRead = useCan(endpointAccessMap.systemEmployeesRead);
  const canCreate = useCan(endpointAccessMap.systemEmployeesCreate);
  const canUpdate = useCan(endpointAccessMap.systemEmployeesUpdate);
  const canDelete = useCan(endpointAccessMap.systemEmployeesDelete);
  const employees = useAppSelector((state) => state.systemEmployees.employees);
  const employeeById = useAppSelector((state) => state.systemEmployees.employeeById);
  const dataPage = useAppSelector((state) => state.systemEmployees.page);
  const dataLimit = useAppSelector((state) => state.systemEmployees.limit);
  const dataTotal = useAppSelector((state) => state.systemEmployees.total);
  const isLoading = useAppSelector((state) => state.systemEmployees.isLoading);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const searchedUsers = useAppSelector((state) => state.users.searchedUsers);
  const assignableSystemRoles = useAppSelector(
    (state) => (state.access.assignableRoles[RoleReferenceScope.System] ?? []) as RoleReference<SystemRole>[]
  );
  const systemRoleReferences = useAppSelector(
    (state) => (state.access.roleReferences[RoleReferenceScope.System] ?? []) as RoleReference<SystemRole>[]
  );
  const areRolesLoading = useAppSelector((state) =>
    Boolean(state.access.assignableRolesLoading[RoleReferenceScope.System])
  );
  const areRolesLoaded = useAppSelector((state) =>
    Boolean(state.access.assignableRolesLoaded[RoleReferenceScope.System])
  );
  const areRoleReferencesLoading = useAppSelector((state) =>
    Boolean(state.access.roleReferencesLoading[RoleReferenceScope.System])
  );
  const areRoleReferencesLoaded = useAppSelector((state) =>
    Boolean(state.access.roleReferencesLoaded[RoleReferenceScope.System])
  );
  const [inviteForm] = Form.useForm<InviteForm>();
  const [rolesForm] = Form.useForm<RolesForm>();
  const [query, setQuery] = useState<SystemEmployeeListQuery>({
    page: 1,
    limit: 10,
    sortOrder: "asc",
  });
  const [selectedEmployee, setSelectedEmployee] = useState<SystemEmployee | null>(null);
  const [modalState, setModalState] = useState({
    invite: false,
    details: false,
    edit: false,
    delete: false,
  });
  const currentLanguage = isLanguage(i18n.language) ? i18n.language : "ru";
  const roleReferenceOptions = useMemo<RoleOption[]>(
    () =>
      systemRoleReferences.map((role) => ({
        value: role.alias,
        label: getLocalizedText(role.name, currentLanguage),
        description: getLocalizedText(role.description, currentLanguage),
      })),
    [systemRoleReferences, currentLanguage]
  );
  const assignableRoleOptions = useMemo<RoleOption[]>(
    () =>
      assignableSystemRoles.map((role) => ({
        value: role.alias,
        label: getLocalizedText(role.name, currentLanguage),
        description: getLocalizedText(role.description, currentLanguage),
      })),
    [assignableSystemRoles, currentLanguage]
  );
  const assignableRoleAliases = useMemo(
    () => new Set(assignableRoleOptions.map((role) => role.value)),
    [assignableRoleOptions]
  );
  const roleLabels = useMemo(
    () =>
      roleReferenceOptions.reduce<Record<string, string>>((acc, role) => {
        acc[role.value] = role.label;
        return acc;
      }, {}),
    [roleReferenceOptions]
  );
  const roleFilterWidth = useMemo(() => {
    const longestLabelLength = Math.max(
      t("systemEmployees.fields.role").length,
      ...roleReferenceOptions.map((option) => option.label.length)
    );

    return `${Math.max(longestLabelLength + 6, 18)}ch`;
  }, [roleReferenceOptions, t]);
  const stateOptions = useMemo(
    () =>
      Object.values(UserSystemAccessState).map((state) => ({
        value: state,
        label: t(`systemEmployees.states.${state}`),
      })),
    [t]
  );

  useEffect(() => {
    dispatch(getSystemEmployees(query));
  }, [dispatch, query]);

  useEffect(() => {
    if (areRolesLoaded || areRolesLoading) {
      return;
    }

    void dispatch(fetchAssignableRoles({ scope: RoleReferenceScope.System }));
  }, [areRolesLoaded, areRolesLoading, dispatch]);

  useEffect(() => {
    if (areRoleReferencesLoaded || areRoleReferencesLoading) {
      return;
    }

    void dispatch(fetchRoleReferences({ scope: RoleReferenceScope.System }));
  }, [areRoleReferencesLoaded, areRoleReferencesLoading, dispatch]);

  useEffect(() => {
    if (modalState.edit && selectedEmployee) {
      rolesForm.setFieldsValue({ roles: selectedEmployee.roles });
    }
  }, [modalState.edit, rolesForm, selectedEmployee]);

  const tableData = useMemo<SystemEmployeeTableDataType[]>(
    () =>
      employees.map((employee) => ({
        key: employee.id,
        user: {
          id: employee.user.id,
          firstName: employee.user.name.first,
          lastName: employee.user.name.last,
          email: employee.user.email,
          phone: employee.user.phone,
          status: employee.user.status,
        },
        roles: employee.roles,
        state: employee.state,
        createdAt: dayjs(employee.createdAt).format("DD.MM.YYYY"),
      })),
    [employees]
  );

  const userOptions = useMemo(
    () =>
      searchedUsers.map((user: UserResponse) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName} · ${user.email}`,
      })),
    [searchedUsers]
  );

  const openModal = (name: keyof typeof modalState, value: boolean) => {
    setModalState((prev) => ({ ...prev, [name]: value }));
  };

  const refreshList = () => {
    dispatch(getSystemEmployees(query));
  };

  const handleTableAction = async (
    action: "read" | "edit" | "delete",
    record: SystemEmployeeTableDataType
  ) => {
    const employee = employees.find((item) => item.id === record.key) ?? null;
    setSelectedEmployee(employee);

    if (
      (action === "delete" || action === "edit") &&
      (record.state === UserSystemAccessState.Declined ||
        record.state === UserSystemAccessState.Disabled)
    ) {
      return;
    }

    if (action === "read") {
      openModal("details", true);
      if (record.key) {
        await dispatch(getSystemEmployeeById({ id: record.key }));
      }
      return;
    }

    if (action === "edit") {
      openModal("edit", true);
      return;
    }

    openModal("delete", true);
  };

  const handleInvite = async (values: InviteForm) => {
    const result = await dispatch(
      createSystemEmployeeInvitation({
        userId: values.userId,
        roles: values.roles,
      })
    );

    if (createSystemEmployeeInvitation.fulfilled.match(result)) {
      toast.success(t("systemEmployees.messages.success.invite"));
      inviteForm.resetFields();
      openModal("invite", false);
      refreshList();
      return;
    }

    toast.error(result.payload ?? t("systemEmployees.messages.error.invite"));
  };

  const handleUpdateRoles = async (values: RolesForm) => {
    if (!selectedEmployee) return;

    const result = await dispatch(
      updateSystemEmployeeRoles({
        id: selectedEmployee.id,
        data: { roles: values.roles },
      })
    );

    if (updateSystemEmployeeRoles.fulfilled.match(result)) {
      toast.success(t("systemEmployees.messages.success.update"));
      openModal("edit", false);
      refreshList();
      return;
    }

    toast.error(result.payload ?? t("systemEmployees.messages.error.update"));
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    const result = await dispatch(deleteSystemEmployee({ id: selectedEmployee.id }));

    if (deleteSystemEmployee.fulfilled.match(result)) {
      toast.success(t("systemEmployees.messages.success.revoke"));
      openModal("delete", false);
      refreshList();
      return;
    }

    toast.error(result.payload ?? t("systemEmployees.messages.error.revoke"));
  };

  const visibleDetails = employeeById ?? selectedEmployee;
  const filterStyle = {
    "--system-employees-filter-width": roleFilterWidth,
  } as CSSProperties;

  return (
    <MainLayout>
      <Heading title={t("systemEmployees.title")} subtitle={t("systemEmployees.subtitle")} totalAmount={`${dataTotal}`}>
        {canCreate && (
          <CustomButton onClick={() => openModal("invite", true)}>{t("systemEmployees.actions.invite")}</CustomButton>
        )}
      </Heading>

      <div className="box">
        <div className="box-container">
          <div className="box-container-items" style={filterStyle}>
            <FilterBar className="system-employees-filters">
              <FilterBarItem>
                <Select
                  size="large"
                  allowClear
                  placeholder={t("systemEmployees.fields.state")}
                  options={stateOptions}
                  onChange={(state) =>
                    setQuery((prev) => ({ ...prev, page: 1, state: state || undefined }))
                  }
                />
              </FilterBarItem>
              <FilterBarItem>
                <Select
                  size="large"
                  allowClear
                  placeholder={t("systemEmployees.fields.role")}
                  options={roleReferenceOptions}
                  loading={areRoleReferencesLoading}
                  optionRender={renderRoleOption}
                  popupMatchSelectWidth
                  onChange={(role) =>
                    setQuery((prev) => ({ ...prev, page: 1, role: role || undefined }))
                  }
                />
              </FilterBarItem>
            </FilterBar>
          </div>

          <div className="box-container-items">
            <ComponentTable<SystemEmployeeTableDataType>
              loading={isLoading}
              columns={SystemEmployeesTableColumns(t, handleTableAction, {
                canRead,
                canUpdate,
                canDelete,
              }, roleLabels, assignableRoleAliases, currentUser?.id)}
              data={tableData}
              onRowClick={canRead ? (record) => handleTableAction("read", record) : undefined}
              pagination={{
                current: dataPage,
                pageSize: dataLimit,
                total: dataTotal,
                showSizeChanger: { showSearch: false },
                pageSizeOptions: ["10", "20", "30", "40", "50"],
                locale: { items_per_page: "" },
                onChange: (page, limit) => {
                  setQuery((prev) => ({
                    ...prev,
                    page,
                    limit: limit || prev.limit,
                  }));
                },
              }}
            />
          </div>
        </div>
      </div>

      <ModalWindow
        className="system-employees-invite-modal"
        width="460px"
        title={t("systemEmployees.modal.inviteTitle")}
        openModal={modalState.invite}
        closeModal={() => openModal("invite", false)}
      >
        <FormComponent form={inviteForm} onFinish={handleInvite}>
          <Form.Item
            className="input"
            name="userId"
            label={t("systemEmployees.fields.existingUser")}
            rules={[{ required: true, message: t("systemEmployees.validation.userRequired") }]}
          >
            <Select
              showSearch
              className="input"
              size="large"
              filterOption={false}
              options={userOptions}
              placeholder={t("systemEmployees.placeholders.searchUsers")}
              onSearch={(value) => {
                if (value.trim().length > 0) {
                  dispatch(searchUsers({ query: value, page: 1, limit: 10, sortOrder: "asc" }));
                }
              }}
            />
          </Form.Item>
          <Form.Item
            className="input"
            name="roles"
            label={t("systemEmployees.fields.roles")}
            rules={[{ required: true, message: t("systemEmployees.validation.rolesRequired") }]}
          >
            <Select
              mode="multiple"
              showSearch
              className="input"
              size="large"
              options={assignableRoleOptions}
              loading={areRolesLoading}
              optionFilterProp="label"
              optionLabelProp="label"
              optionRender={renderRoleOption}
              tagRender={renderRoleTag}
              placeholder={t("systemEmployees.placeholders.selectRoles")}
            />
          </Form.Item>
          <CustomButton type="submit">{t("systemEmployees.actions.sendInvitation")}</CustomButton>
        </FormComponent>
      </ModalWindow>

      <ModalWindow
        className="system-employees-details-modal"
        width="620px"
        titleAction={t("systemEmployees.modal.detailsAction")}
        title={t("systemEmployees.modal.employee")}
        openModal={modalState.details}
        closeModal={() => openModal("details", false)}
      >
        {visibleDetails && (
          <div className="system-employees-details">
            <div className="system-employees-details-user">
              <div className="system-employees-details-avatar">
                {getEmployeeName(visibleDetails).charAt(0).toUpperCase()}
              </div>
              <div className="system-employees-details-user-info">
                <p className="system-employees-details-name">{getEmployeeName(visibleDetails)}</p>
                <p className="system-employees-details-email">{visibleDetails.user.email}</p>
              </div>
              <Tag className="system-employees-details-status" color={statusColors[visibleDetails.user.status] ?? "default"}>
                {t(`statuses.${visibleDetails.user.status}`, { defaultValue: visibleDetails.user.status })}
              </Tag>
            </div>

            <div className="system-employees-details-grid">
              <div className="system-employees-details-item">
                <span className="system-employees-details-label">{t("common.phone")}</span>
                <span className="system-employees-details-value">
                  {visibleDetails.user.phone ? FormatUzbekPhoneNumber(visibleDetails.user.phone) : "-"}
                </span>
              </div>
              <div className="system-employees-details-item">
                <span className="system-employees-details-label">{t("systemEmployees.fields.state")}</span>
                <Tag className="system-employees-details-tag" color={statusColors[visibleDetails.state] ?? "default"}>
                  {t(`systemEmployees.states.${visibleDetails.state}`)}
                </Tag>
              </div>
              <div className="system-employees-details-item">
                <span className="system-employees-details-label">{t("systemEmployees.fields.createdAt")}</span>
                <span className="system-employees-details-value">{dayjs(visibleDetails.createdAt).format("DD.MM.YYYY")}</span>
              </div>
              <div className="system-employees-details-item">
                <span className="system-employees-details-label">{t("systemEmployees.fields.updatedAt")}</span>
                <span className="system-employees-details-value">{dayjs(visibleDetails.updatedAt).format("DD.MM.YYYY HH:mm")}</span>
              </div>
            </div>

            <div className="system-employees-details-roles">
              <span className="system-employees-details-label">{t("systemEmployees.fields.roles")}</span>
              <div className="system-employees-details-tags">
                {visibleDetails.roles.map((role) => (
                  <Tag key={role} className="system-employees-details-tag">
                    {roleLabels[role] ?? role}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        )}
      </ModalWindow>

      <ModalWindow
        className="system-employees-roles-modal"
        titleAction={t("systemEmployees.modal.editAction")}
        title={t("systemEmployees.fields.roles")}
        openModal={modalState.edit}
        closeModal={() => openModal("edit", false)}
      >
        <FormComponent form={rolesForm} onFinish={handleUpdateRoles}>
          <Form.Item
            className="input"
            name="roles"
            label={t("systemEmployees.fields.roles")}
            rules={[{ required: true, message: t("systemEmployees.validation.rolesRequired") }]}
          >
            <Select
              mode="multiple"
              showSearch
              className="input"
              size="large"
              options={assignableRoleOptions}
              loading={areRolesLoading}
              optionFilterProp="label"
              optionLabelProp="label"
              optionRender={renderRoleOption}
              tagRender={renderRoleTag}
              placeholder={t("systemEmployees.placeholders.selectRoles")}
            />
          </Form.Item>
          <CustomButton type="submit">{t("systemEmployees.actions.saveRoles")}</CustomButton>
        </FormComponent>
      </ModalWindow>

      <ModalWindow
        titleAction={t("systemEmployees.modal.revokeAction")}
        title={t("systemEmployees.modal.systemAccess")}
        openModal={modalState.delete}
        closeModal={() => openModal("delete", false)}
        classDangerName="danger-title"
      >
        <div className="delete-modal">
          <div className="delete-modal-title">
            <p className="title">{t("systemEmployees.revokeQuestion")}</p>
            <p className="subtitle">{selectedEmployee ? getEmployeeName(selectedEmployee) : ""}</p>
          </div>
          <div className="delete-modal-btns">
            <CustomButton className="danger" onClick={handleDelete}>
              {t("systemEmployees.actions.revoke")}
            </CustomButton>
            <CustomButton className="outline" onClick={() => openModal("delete", false)}>
              {t("btn.cancel")}
            </CustomButton>
          </div>
        </div>
      </ModalWindow>
    </MainLayout>
  );
};

export default SystemEmployees;
