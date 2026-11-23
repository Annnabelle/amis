import { Form, Select, Tag } from "antd";
import { notify } from 'shared/lib/notify';
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "app/store";
import { useCan } from "entities/access/lib";
import {
  useGetAssignableRolesQuery,
  useGetRoleReferencesQuery,
} from "entities/access/api";
import { RoleScope, type RoleReference } from "entities/access/types";
import {
  useDeleteCompanyMembershipMutation,
  useGetCompanyMembershipByIdQuery,
  useGetCompanyMembershipsQuery,
  useUpdateCompanyMembershipRolesMutation,
} from "entities/companyMemberships/api";
import { getApiErrorMessage } from "shared/api";
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
import type { UserPreview } from "entities/users/types";
import { UserPreviewCardById } from "entities/users/ui/userPreviewCard";
import RoleSelect from "shared/ui/roleSelect";
import { renderRoleOption } from "shared/ui/roleSelect/renderers";
import InviteModal from "features/companyMemberInvite/ui/inviteModal";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import CustomButton from "shared/ui/button";
import FilterBar from "shared/ui/filterBar/filterBar";
import FilterBarItem from "shared/ui/filterBar/filterBarItems";
import FormComponent from "shared/ui/formComponent";
import MainLayout from "widgets/appShell";
import Heading from "shared/ui/mainHeading";
import ModalWindow from "shared/ui/modalWindow";
import ComponentTable from "shared/ui/table";
import { statusColors } from "shared/ui/statusBadge/tagColors";
import { FormatUzbekPhoneNumber } from "shared/lib/utils";
import { isLanguage, type Language } from "shared/types/dtos";
import { formatDate, formatDateTime } from 'shared/lib/formatDate';
import "./styles.sass";

type RolesForm = {
  roles: CompanyRole[];
};

type RoleOption = {
  value: CompanyRole;
  label: string;
  description: string;
};


const getLocalizedText = (
  value: Record<Language, string>,
  language: Language
) => value[language] || value.ru || value.en || value.uz;

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

const CompanyMemberships = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const { t, i18n } = useTranslation();
  const companyId = orgId ?? "";
  const canRead = useCan(endpointAccessMap.companyMembershipsRead);
  const canCreate = useCan(endpointAccessMap.companyMembershipsCreate);
  const canUpdate = useCan(endpointAccessMap.companyMembershipsUpdate);
  const canDelete = useCan(endpointAccessMap.companyMembershipsDelete);

  const currentUser = useAppSelector((state) => state.users.currentUser);
  const { data: assignableRoles = [], isFetching: areRolesLoading } =
    useGetAssignableRolesQuery(
      { scope: RoleScope.Company, companyId },
      { skip: !companyId }
    );
  const {
    data: roleReferences = [],
    isFetching: areRoleReferencesLoading,
  } = useGetRoleReferencesQuery(
    { scope: RoleScope.Company, companyId },
    { skip: !companyId }
  );
  const assignableCompanyRoles = assignableRoles as RoleReference<CompanyRole>[];
  const companyRoleReferences = roleReferences as RoleReference<CompanyRole>[];
  const [rolesForm] = Form.useForm<RolesForm>();
  const [query, setQuery] = useState<CompanyMembershipListQuery>({
    companyId: orgId ?? "",
    page: 1,
    limit: 10,
  });
  const [selectedMembership, setSelectedMembership] = useState<CompanyMembership | null>(null);
  const [modalState, setModalState] = useState({
    invite: false,
    details: false,
    edit: false,
    delete: false,
  });
  const currentLanguage = isLanguage(i18n.language) ? i18n.language : "ru";

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

  const { data: membershipsPage, isFetching: isLoading } =
    useGetCompanyMembershipsQuery(query, { skip: !query.companyId });
  const [updateCompanyMembershipRoles] =
    useUpdateCompanyMembershipRolesMutation();
  const [deleteCompanyMembership] = useDeleteCompanyMembershipMutation();
  const memberships = useMemo(
    () => membershipsPage?.items ?? [],
    [membershipsPage]
  );
  const dataPage = query.page;
  const dataLimit = query.limit;
  const dataTotal = membershipsPage?.total ?? 0;

  useEffect(() => {
    if (modalState.edit && selectedMembership) {
      rolesForm.setFieldsValue({ roles: selectedMembership.roles });
    }
  }, [modalState.edit, rolesForm, selectedMembership]);

  const tableData = useMemo<CompanyMembershipTableDataType[]>(
    () =>
      memberships.map((membership) => ({
        key: membership.id,
        userId: membership.userId,
        user: membership.user ?? getFallbackPreview(membership.userId),
        roles: membership.roles,
        state: membership.state,
        createdAt: membership.createdAt ? formatDate(membership.createdAt) : "-",
      })),
    [memberships]
  );

  const openModal = (name: keyof typeof modalState, value: boolean) => {
    setModalState((prev) => ({ ...prev, [name]: value }));
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
      return;
    }

    if (action === "edit") {
      openModal("edit", true);
      return;
    }

    openModal("delete", true);
  };

  const handleUpdateRoles = async (values: RolesForm) => {
    if (!selectedMembership || !companyId) return;

    try {
      await updateCompanyMembershipRoles({
        companyId,
        id: selectedMembership.id,
        data: { roles: values.roles },
      }).unwrap();

      notify.success(t("companyMemberships.messages.success.update"));
      openModal("edit", false);
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, t("companyMemberships.messages.error.update"))
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedMembership || !companyId) return;

    try {
      await deleteCompanyMembership({
        companyId,
        id: selectedMembership.id,
      }).unwrap();

      notify.success(t("companyMemberships.messages.success.revoke"));
      openModal("delete", false);
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, t("companyMemberships.messages.error.revoke"))
      );
    }
  };

  const { data: membershipById } = useGetCompanyMembershipByIdQuery(
    { companyId, id: selectedMembership?.id ?? "" },
    { skip: !modalState.details || !companyId || !selectedMembership?.id }
  );
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

      <InviteModal
        companyId={companyId}
        open={modalState.invite}
        onClose={() => openModal("invite", false)}
        roleOptions={assignableRoleOptions}
        rolesLoading={areRolesLoading}
      />

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
                  {visibleDetails.createdAt ? formatDate(visibleDetails.createdAt) : "-"}
                </span>
              </div>
              <div className="company-memberships-details-item">
                <span className="company-memberships-details-label">{t("companyMemberships.fields.updatedAt")}</span>
                <span className="company-memberships-details-value">
                  {visibleDetails.updatedAt ? formatDateTime(visibleDetails.updatedAt) : "-"}
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
            <RoleSelect
              options={assignableRoleOptions}
              loading={areRolesLoading}
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
            <CustomButton variant="danger" onClick={handleDelete}>
              {t("companyMemberships.actions.revoke")}
            </CustomButton>
            <CustomButton variant="outline" onClick={() => openModal("delete", false)}>
              {t("btn.cancel")}
            </CustomButton>
          </div>
        </div>
      </ModalWindow>
    </MainLayout>
  );
};

export default CompanyMemberships;
