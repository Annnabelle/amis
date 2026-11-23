import { Form, Input } from "antd";
import { useTranslation } from "react-i18next";

import RoleSelect from "entities/companyMemberships/ui/roleSelect";
import type { RoleOption } from "entities/companyMemberships/ui/roleSelect/renderers";
import { UserPreviewCardById } from "entities/users/ui/userPreviewCard";
import { useMemberInvite } from "features/companyMemberInvite/lib/useMemberInvite";
import CustomButton from "shared/ui/button";
import FormComponent from "shared/ui/formComponent";
import ModalWindow from "shared/ui/modalWindow";

type InviteModalProps = {
  companyId: string;
  open: boolean;
  onClose: () => void;
  roleOptions: RoleOption[];
  rolesLoading: boolean;
};

/** Приглашение участника: почта, найденный пользователь и его роли. */
const InviteModal = ({
  companyId,
  open,
  onClose,
  roleOptions,
  rolesLoading,
}: InviteModalProps) => {
  const { t } = useTranslation();
  const { form, foundUser, isSearching, isSubmitting, handleEmailChange, reset, onSubmit } =
    useMemberInvite({ companyId, isOpen: open, onInvited: onClose });

  const close = () => {
    reset();
    onClose();
  };

  return (
    <ModalWindow
      className="company-memberships-invite-modal"
      width="460px"
      title={t("companyMemberships.modal.inviteTitle")}
      openModal={open}
      closeModal={close}
    >
      <FormComponent form={form} onFinish={onSubmit}>
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
            disabled={isSearching}
            placeholder={t("companyMemberships.placeholders.searchUserByEmail")}
            onChange={handleEmailChange}
          />
        </Form.Item>
        <Form.Item
          hidden
          name="userId"
          rules={[{ required: true, message: t("companyMemberships.validation.userRequired") }]}
        >
          <Input />
        </Form.Item>
        {foundUser && (
          <div className="company-memberships-invite-user">
            <UserPreviewCardById userId={foundUser.id} />
          </div>
        )}
        <Form.Item
          className="input"
          name="roles"
          label={t("companyMemberships.fields.roles")}
          rules={[{ required: true, message: t("companyMemberships.validation.rolesRequired") }]}
        >
          <RoleSelect
            options={roleOptions}
            loading={rolesLoading}
            placeholder={t("companyMemberships.placeholders.selectRoles")}
          />
        </Form.Item>
        <CustomButton type="submit" loading={isSubmitting}>
          {t("companyMemberships.actions.sendInvitation")}
        </CustomButton>
      </FormComponent>
    </ModalWindow>
  );
};

export default InviteModal;
