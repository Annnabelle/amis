import { Form, Input, Select, Tag, Tooltip, type SelectProps } from "antd";
import type { CSSProperties } from "react";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "app/store";
import { useCan } from "entities/access/lib";
import { fetchAssignableRoles, fetchRoleReferences } from "entities/access/model";
import {
  getRoleReferenceCacheKey,
  RoleReferenceScope,
  type RoleReference,
} from "entities/access/types";
import {
  createCompanyMembershipInvitation,
  deleteCompanyMembership,
  getCompanyMembershipById,
  getCompanyMemberships,
  updateCompanyMembershipRoles,
} from "entities/companyMemberships/model";
import {
  CompanyMembershipState,
  type CompanyMembership,
  type CompanyMembershipListQuery,
  type CompanyRole,
} from "entities/companyMemberships/types";
import {
  CompanyMembershipsTableColumns,
} from "entities/companyMemberships/ui/tableData/companyMemberships";
import type { CompanyMembershipTableDataType } from "entities/companyMemberships/ui/tableData/companyMemberships/types";
import { searchUsers } from "entities/users/model";
import type { UserPreview, UserResponse } from "entities/users/types";
import { UserPreviewCardById } from "entities/users/ui/userPreviewCard";
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
import { FormatUzbekPhoneNumber } from "shared/lib/utils";
import { isLanguage, type Language } from "shared/types/dtos";
import "./styles.sass";

type InviteForm = {
  email: string;
  userId: string;
  roles: CompanyRole[];
};

type RolesForm = {
  roles: CompanyRole[];
};

type RoleOption = {
  value: CompanyRole;
  label: string;
  description: string;
};

type SearchUsersPayload = {
  data?: UserResponse[];
};

const getLocalizedText = (
  value: Record<Language, string>,
  language: Language
) => value[language] || value.ru || value.en || value.uz;

const renderRoleTag: SelectProps["tagRender"] = ({ label, closable, onClose }) => (
  <Tag
    className="company-memberships-role-tag"
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

const renderRoleOption = (option: { data: RoleOption }) => (
  <Tooltip placement="right" title={option.data.description}>
    <div className="company-memberships-role-option">{option.data.label}</div>
  </Tooltip>
);

const getFallbackPreview = (userId: string): UserPreview => ({
  id: userId,
  firstName: "",
  lastName: "",
  email: userId,
  phone: "",
  status: "",
});

const getMembershipName = (
  membership: CompanyMembership,
  userPreview?: UserPreview
) =>
  userPreview
    ? [userPreview.firstName, userPreview.lastName].filter(Boolean).join(" ") ||
      userPreview.email
    : membership.userId;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CompanyMemberships = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const companyId = orgId ?? "";
  const companyRoleReferenceKey = getRoleReferenceCacheKey(
    RoleReferenceScope.Company,
    companyId
  );
  const canRead = useCan(endpointAccessMap.companyMembershipsRead);
  const canCreate = useCan(endpointAccessMap.companyMembershipsCreate);
  const canUpdate = useCan(endpointAccessMap.companyMembershipsUpdate);
  const canDelete = useCan(endpointAccessMap.companyMembershipsDelete);
  const memberships = useAppSelector((state) => state.companyMemberships.memberships);
  const membershipById = useAppSelector((state) => state.companyMemberships.membershipById);
  const dataPage = useAppSelector((state) => state.companyMemberships.page);
  const dataLimit = useAppSelector((state) => state.companyMemberships.limit);
  const dataTotal = useAppSelector((state) => state.companyMemberships.total);
  const isLoading = useAppSelector((state) => state.companyMemberships.isLoading);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const assignableCompanyRoles = useAppSelector(
    (state) => (state.access.assignableRoles[companyRoleReferenceKey] ?? []) as RoleReference<CompanyRole>[]
  );
  const companyRoleReferences = useAppSelector(
    (state) => (state.access.roleReferences[companyRoleReferenceKey] ?? []) as RoleReference<CompanyRole>[]
  );
  const areRolesLoading = useAppSelector((state) =>
    Boolean(state.access.assignableRolesLoading[companyRoleReferenceKey])
  );
  const areRolesLoaded = useAppSelector((state) =>
    Boolean(state.access.assignableRolesLoaded[companyRoleReferenceKey])
  );
  const areRoleReferencesLoading = useAppSelector((state) =>
    Boolean(state.access.roleReferencesLoading[companyRoleReferenceKey])
  );
  const areRoleReferencesLoaded = useAppSelector((state) =>
    Boolean(state.access.roleReferencesLoaded[companyRoleReferenceKey])
  );
  const [inviteForm] = Form.useForm<InviteForm>();
  const [rolesForm] = Form.useForm<RolesForm>();
  const [query, setQuery] = useState<CompanyMembershipListQuery>({
    companyId: orgId ?? "",
    page: 1,
    limit: 10,
  });
  const [selectedMembership, setSelectedMembership] = useState<CompanyMembership | null>(null);
  const [inviteUser, setInviteUser] = useState<UserResponse | null>(null);
  const [isInviteUserSearching, setIsInviteUserSearching] = useState(false);
  const [lastSearchedInviteEmail, setLastSearchedInviteEmail] = useState("");
  const [modalState, setModalState] = useState({
    invite: false,
    details: false,
    edit: false,
    delete: false,
  });
  const currentLanguage = isLanguage(i18n.language) ? i18n.language : "ru";
  const inviteEmail = Form.useWatch("email", inviteForm);

  useEffect(() => {
    if (!companyId) return;
    setQuery((prev) =>
      prev.companyId === companyId ? prev : { ...prev, companyId, page: 1 }
    );
  }, [companyId]);

  const roleReferenceOptions = useMemo<RoleOption[]>(
    () =>
      companyRoleReferences.map((role) => ({
        value: role.alias,
        label: getLocalizedText(role.name, currentLanguage),
        description: getLocalizedText(role.description, currentLanguage),
      })),
    [companyRoleReferences, currentLanguage]
  );
  const assignableRoleOptions = useMemo<RoleOption[]>(
    () =>
      assignableCompanyRoles.map((role) => ({
        value: role.alias,
        label: getLocalizedText(role.name, currentLanguage),
        description: getLocalizedText(role.description, currentLanguage),
      })),
    [assignableCompanyRoles, currentLanguage]
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
      t("companyMemberships.fields.role").length,
      ...roleReferenceOptions.map((option) => option.label.length)
    );

    return `${Math.max(longestLabelLength + 6, 18)}ch`;
  }, [roleReferenceOptions, t]);
  const stateOptions = useMemo(
    () =>
      Object.values(CompanyMembershipState).map((state) => ({
        value: state,
        label: t(`companyMemberships.states.${state}`),
      })),
    [t]
  );

  useEffect(() => {
    if (!query.companyId) return;
    dispatch(getCompanyMemberships(query));
  }, [dispatch, query]);

  useEffect(() => {
    if (areRolesLoaded || areRolesLoading) {
      return;
    }

    if (!companyId) return;
    void dispatch(fetchAssignableRoles({ scope: RoleReferenceScope.Company, companyId }));
  }, [areRolesLoaded, areRolesLoading, companyId, dispatch]);

  useEffect(() => {
    if (areRoleReferencesLoaded || areRoleReferencesLoading) {
      return;
    }

    if (!companyId) return;
    void dispatch(fetchRoleReferences({ scope: RoleReferenceScope.Company, companyId }));
  }, [areRoleReferencesLoaded, areRoleReferencesLoading, companyId, dispatch]);

  const searchInviteUserByEmail = useCallback(async (email: string) => {
    setInviteUser(null);
    inviteForm.setFieldValue("userId", undefined);
    setIsInviteUserSearching(true);
    setLastSearchedInviteEmail(email);

    try {
      const result = await dispatch(
        searchUsers({
          query: email,
          page: 1,
          limit: 10,
          sortOrder: "asc",
        })
      );

      if (searchUsers.fulfilled.match(result)) {
        const payload = result.payload as SearchUsersPayload;
        const user =
          payload.data?.find(
            (item) => item.email.trim().toLowerCase() === email
          ) ?? null;

        if (user) {
          setInviteUser(user);
          inviteForm.setFieldValue("userId", user.id);
          return;
        }

        inviteForm.setFields([
          {
            name: "email",
            errors: [t("companyMemberships.validation.userNotFound")],
          },
        ]);
      }
    } finally {
      setIsInviteUserSearching(false);
    }
  }, [dispatch, inviteForm, t]);

  useEffect(() => {
    if (modalState.edit && selectedMembership) {
      rolesForm.setFieldsValue({ roles: selectedMembership.roles });
    }
  }, [modalState.edit, rolesForm, selectedMembership]);

  useEffect(() => {
    const normalizedEmail =
      typeof inviteEmail === "string" ? inviteEmail.trim().toLowerCase() : "";

    if (!modalState.invite) {
      return;
    }

    if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
      setInviteUser(null);
      inviteForm.setFieldValue("userId", undefined);
      return;
    }

    if (
      normalizedEmail === lastSearchedInviteEmail ||
      normalizedEmail === inviteUser?.email.trim().toLowerCase()
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void searchInviteUserByEmail(normalizedEmail);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [
    inviteEmail,
    inviteForm,
    inviteUser,
    lastSearchedInviteEmail,
    modalState.invite,
    searchInviteUserByEmail,
  ]);

  const tableData = useMemo<CompanyMembershipTableDataType[]>(
    () =>
      memberships.map((membership) => ({
        key: membership.id,
        userId: membership.userId,
        user: membership.user ?? getFallbackPreview(membership.userId),
        roles: membership.roles,
        state: membership.state,
        createdAt: membership.createdAt ? dayjs(membership.createdAt).format("DD.MM.YYYY") : "-",
      })),
    [memberships]
  );

  const openModal = (name: keyof typeof modalState, value: boolean) => {
    if (name === "invite" && !value) {
      inviteForm.resetFields();
      setInviteUser(null);
      setLastSearchedInviteEmail("");
    }

    setModalState((prev) => ({ ...prev, [name]: value }));
  };

  const refreshList = () => {
    if (query.companyId) {
      dispatch(getCompanyMemberships(query));
    }
  };

  const handleTableAction = async (
    action: "read" | "edit" | "delete",
    record: CompanyMembershipTableDataType
  ) => {
    const membership = memberships.find((item) => item.id === record.key) ?? null;
    setSelectedMembership(membership);

    if (
      (action === "delete" || action === "edit") &&
      (record.state === CompanyMembershipState.Declined ||
        record.state === CompanyMembershipState.Disabled)
    ) {
      return;
    }

    if (action === "read") {
      openModal("details", true);
      if (record.key && companyId) {
        await dispatch(getCompanyMembershipById({ companyId, id: record.key }));
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
    if (!companyId || !values.userId) return;

    const result = await dispatch(
      createCompanyMembershipInvitation({
        companyId,
        data: {
          userId: values.userId,
          roles: values.roles,
        },
      })
    );

    if (createCompanyMembershipInvitation.fulfilled.match(result)) {
      toast.success(t("companyMemberships.messages.success.invite"));
      inviteForm.resetFields();
      openModal("invite", false);
      refreshList();
      return;
    }

    toast.error(result.payload ?? t("companyMemberships.messages.error.invite"));
  };

  const handleUpdateRoles = async (values: RolesForm) => {
    if (!selectedMembership || !companyId) return;

    const result = await dispatch(
      updateCompanyMembershipRoles({
        companyId,
        id: selectedMembership.id,
        data: { roles: values.roles },
      })
    );

    if (updateCompanyMembershipRoles.fulfilled.match(result)) {
      toast.success(t("companyMemberships.messages.success.update"));
      openModal("edit", false);
      refreshList();
      return;
    }

    toast.error(result.payload ?? t("companyMemberships.messages.error.update"));
  };

  const handleDelete = async () => {
    if (!selectedMembership || !companyId) return;

    const result = await dispatch(
      deleteCompanyMembership({ companyId, id: selectedMembership.id })
    );

    if (deleteCompanyMembership.fulfilled.match(result)) {
      toast.success(t("companyMemberships.messages.success.revoke"));
      openModal("delete", false);
      refreshList();
      return;
    }

    toast.error(result.payload ?? t("companyMemberships.messages.error.revoke"));
  };

  const visibleDetails = membershipById ?? selectedMembership;
  const visibleDetailsPreview =
    visibleDetails?.user ??
    (visibleDetails && selectedMembership?.id === visibleDetails.id
      ? selectedMembership.user
      : undefined);
  const filterStyle = {
    "--company-memberships-filter-width": roleFilterWidth,
  } as CSSProperties;

  return (
    <MainLayout>
      <Heading title={t("companyMemberships.title")} subtitle={t("companyMemberships.subtitle")} totalAmount={`${dataTotal}`}>
        {canCreate && (
          <CustomButton onClick={() => openModal("invite", true)}>{t("companyMemberships.actions.invite")}</CustomButton>
        )}
      </Heading>

      <div className="box">
        <div className="box-container">
          <div className="box-container-items" style={filterStyle}>
            <FilterBar className="company-memberships-filters">
              <FilterBarItem>
                <Select
                  size="large"
                  allowClear
                  placeholder={t("companyMemberships.fields.state")}
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
                  placeholder={t("companyMemberships.fields.role")}
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
            <ComponentTable<CompanyMembershipTableDataType>
              loading={isLoading}
              columns={CompanyMembershipsTableColumns(t, handleTableAction, {
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
        className="company-memberships-invite-modal"
        width="460px"
        title={t("companyMemberships.modal.inviteTitle")}
        openModal={modalState.invite}
        closeModal={() => openModal("invite", false)}
      >
        <FormComponent form={inviteForm} onFinish={handleInvite}>
          <Form.Item
            className="input"
            name="email"
            label={t("companyMemberships.fields.existingUser")}
            rules={[
              { required: true, message: t("companyMemberships.validation.emailRequired") },
              { type: "email", message: t("companyMemberships.validation.emailInvalid") },
            ]}
          >
            <Input
              className="input company-memberships-email-input"
              size="large"
              disabled={isInviteUserSearching}
              placeholder={t("companyMemberships.placeholders.searchUserByEmail")}
              onChange={() => {
                setInviteUser(null);
                inviteForm.setFieldValue("userId", undefined);
                setLastSearchedInviteEmail("");
              }}
            />
          </Form.Item>
          <Form.Item
            hidden
            name="userId"
            rules={[{ required: true, message: t("companyMemberships.validation.userRequired") }]}
          >
            <Input />
          </Form.Item>
          {inviteUser && (
            <div className="company-memberships-invite-user">
              <UserPreviewCardById userId={inviteUser.id} />
            </div>
          )}
          <Form.Item
            className="input"
            name="roles"
            label={t("companyMemberships.fields.roles")}
            rules={[{ required: true, message: t("companyMemberships.validation.rolesRequired") }]}
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
              placeholder={t("companyMemberships.placeholders.selectRoles")}
            />
          </Form.Item>
          <CustomButton type="submit">{t("companyMemberships.actions.sendInvitation")}</CustomButton>
        </FormComponent>
      </ModalWindow>

      <ModalWindow
        className="company-memberships-details-modal"
        width="620px"
        titleAction={t("companyMemberships.modal.detailsAction")}
        title={t("companyMemberships.modal.member")}
        openModal={modalState.details}
        closeModal={() => openModal("details", false)}
      >
        {visibleDetails && (
          <div className="company-memberships-details">
            <div className="company-memberships-details-user">
              <div className="company-memberships-details-avatar">
                {getMembershipName(visibleDetails, visibleDetailsPreview).charAt(0).toUpperCase()}
              </div>
              <div className="company-memberships-details-user-info">
                <p className="company-memberships-details-name">{getMembershipName(visibleDetails, visibleDetailsPreview)}</p>
                <p className="company-memberships-details-email">{visibleDetailsPreview?.email ?? visibleDetails.userId}</p>
              </div>
              {visibleDetailsPreview && (
                <Tag className="company-memberships-details-status" color={statusColors[visibleDetailsPreview.status] ?? "default"}>
                  {t(`statuses.${visibleDetailsPreview.status}`, { defaultValue: visibleDetailsPreview.status })}
                </Tag>
              )}
            </div>

            <div className="company-memberships-details-grid">
              <div className="company-memberships-details-item">
                <span className="company-memberships-details-label">{t("common.phone")}</span>
                <span className="company-memberships-details-value">
                  {visibleDetailsPreview?.phone ? FormatUzbekPhoneNumber(visibleDetailsPreview.phone) : "-"}
                </span>
              </div>
              <div className="company-memberships-details-item">
                <span className="company-memberships-details-label">{t("companyMemberships.fields.state")}</span>
                <Tag className="company-memberships-details-tag" color={statusColors[visibleDetails.state] ?? "default"}>
                  {t(`companyMemberships.states.${visibleDetails.state}`)}
                </Tag>
              </div>
              <div className="company-memberships-details-item">
                <span className="company-memberships-details-label">{t("companyMemberships.fields.createdAt")}</span>
                <span className="company-memberships-details-value">
                  {visibleDetails.createdAt ? dayjs(visibleDetails.createdAt).format("DD.MM.YYYY") : "-"}
                </span>
              </div>
              <div className="company-memberships-details-item">
                <span className="company-memberships-details-label">{t("companyMemberships.fields.updatedAt")}</span>
                <span className="company-memberships-details-value">
                  {visibleDetails.updatedAt ? dayjs(visibleDetails.updatedAt).format("DD.MM.YYYY HH:mm") : "-"}
                </span>
              </div>
              <div className="company-memberships-details-item company-memberships-details-preview">
                <span className="company-memberships-details-label">{t("companyMemberships.fields.invitedBy")}</span>
                <UserPreviewCardById userId={visibleDetails.createdBy} compact />
              </div>
            </div>

            <div className="company-memberships-details-roles">
              <span className="company-memberships-details-label">{t("companyMemberships.fields.roles")}</span>
              <div className="company-memberships-details-tags">
                {visibleDetails.roles.map((role) => (
                  <Tag key={role} className="company-memberships-details-tag">
                    {roleLabels[role] ?? role}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        )}
      </ModalWindow>

      <ModalWindow
        className="company-memberships-roles-modal"
        titleAction={t("companyMemberships.modal.editAction")}
        title={t("companyMemberships.fields.roles")}
        openModal={modalState.edit}
        closeModal={() => openModal("edit", false)}
      >
        <FormComponent form={rolesForm} onFinish={handleUpdateRoles}>
          <Form.Item
            className="input"
            name="roles"
            label={t("companyMemberships.fields.roles")}
            rules={[{ required: true, message: t("companyMemberships.validation.rolesRequired") }]}
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
              placeholder={t("companyMemberships.placeholders.selectRoles")}
            />
          </Form.Item>
          <CustomButton type="submit">{t("companyMemberships.actions.saveRoles")}</CustomButton>
        </FormComponent>
      </ModalWindow>

      <ModalWindow
        titleAction={t("companyMemberships.modal.revokeAction")}
        title={t("companyMemberships.modal.companyAccess")}
        openModal={modalState.delete}
        closeModal={() => openModal("delete", false)}
        classDangerName="danger-title"
      >
        <div className="delete-modal">
          <div className="delete-modal-title">
            <p className="title">{t("companyMemberships.revokeQuestion")}</p>
            <p className="subtitle">
              {selectedMembership ? getMembershipName(selectedMembership, selectedMembership.user) : ""}
            </p>
          </div>
          <div className="delete-modal-btns">
            <CustomButton className="danger" onClick={handleDelete}>
              {t("companyMemberships.actions.revoke")}
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

export default CompanyMemberships;
