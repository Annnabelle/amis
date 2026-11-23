import { Form } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCreateCompanyMembershipInvitationMutation } from "entities/companyMemberships/api";
import { useLazySearchUsersQuery } from "entities/users/api";
import type { User } from "entities/users/types";
import { getApiErrorMessage } from "shared/api";
import type { CompanyRole } from "entities/companyMemberships/types";
import { notify } from "shared/lib/notify";
import { useSubmitGuard } from "shared/lib/useSubmitGuard";

export type MemberInviteForm = {
  email: string;
  userId?: string;
  roles: CompanyRole[];
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Почту вводят по букве: поиск ждёт паузу в наборе. */
const SEARCH_DELAY = 350;

/**
 * Приглашение в компанию: по почте находится уже заведённый пользователь.
 *
 * Приглашение выписывается на существующего пользователя, поэтому почта сначала
 * ищется среди пользователей, и только найденный уходит в приглашение.
 */
export const useMemberInvite = ({
  companyId,
  isOpen,
  onInvited,
}: {
  companyId: string;
  isOpen: boolean;
  onInvited: () => void;
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<MemberInviteForm>();
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchedEmail, setLastSearchedEmail] = useState("");

  const [searchUsersByQuery] = useLazySearchUsersQuery();
  const [createInvitation] = useCreateCompanyMembershipInvitationMutation();

  const email = Form.useWatch("email", form);

  const searchByEmail = useCallback(
    async (normalizedEmail: string) => {
      setFoundUser(null);
      form.setFieldValue("userId", undefined);
      setIsSearching(true);
      setLastSearchedEmail(normalizedEmail);

      try {
        const found = await searchUsersByQuery({
          query: normalizedEmail,
          page: 1,
          limit: 10,
          sortOrder: "asc",
        }).unwrap();

        const user =
          found.items.find((item) => item.email.trim().toLowerCase() === normalizedEmail) ?? null;

        if (user) {
          setFoundUser(user);
          form.setFieldValue("userId", user.id);
          return;
        }

        form.setFields([
          { name: "email", errors: [t("companyMemberships.validation.userNotFound")] },
        ]);
      } finally {
        setIsSearching(false);
      }
    },
    [form, searchUsersByQuery, t],
  );

  useEffect(() => {
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!isOpen) {
      return;
    }

    if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
      setFoundUser(null);
      form.setFieldValue("userId", undefined);
      return;
    }

    if (
      normalizedEmail === lastSearchedEmail ||
      normalizedEmail === foundUser?.email.trim().toLowerCase()
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void searchByEmail(normalizedEmail);
    }, SEARCH_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [email, foundUser, form, isOpen, lastSearchedEmail, searchByEmail]);

  const reset = () => {
    form.resetFields();
    setFoundUser(null);
    setLastSearchedEmail("");
  };

  const submit = async (values: MemberInviteForm) => {
    if (!companyId || !values.userId) return;

    try {
      await createInvitation({
        companyId,
        data: { userId: values.userId, roles: values.roles },
      }).unwrap();

      notify.success(t("companyMemberships.messages.success.invite"));
      reset();
      onInvited();
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, t("companyMemberships.messages.error.invite")),
      );
    }
  };

  const { isSubmitting, onSubmit } = useSubmitGuard(submit);

  /** Правка почты сбрасывает найденного пользователя. */
  const handleEmailChange = () => {
    setFoundUser(null);
    form.setFieldValue("userId", undefined);
    setLastSearchedEmail("");
  };

  return { form, foundUser, isSearching, isSubmitting, handleEmailChange, reset, onSubmit };
};
