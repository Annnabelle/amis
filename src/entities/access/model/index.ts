import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  isSystemAccessInvitationActionSuccessResponse,
  isGetCurrentUserAccessSuccessResponse,
  isGetRoleReferencesSuccessResponse,
  type GetCurrentUserAccessResponseDto,
  type GetRoleReferencesResponseDto,
  type SystemAccessInvitationActionResponseDto,
  type SystemAccessInvitationDecisionDto,
} from "entities/access/dtos";
import { mapCurrentUserAccessDtoToEntity } from "entities/access/mappers";
import type { AccessState, RoleReference, RoleReferenceScope, UserAccess } from "entities/access/types";
import axiosInstance from "shared/lib/axiosInstance";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";

const initialState: AccessState = {
  data: null,
  currentCompanyId: null,
  roleReferences: {},
  roleReferencesLoading: {},
  roleReferencesLoaded: {},
  roleReferencesError: {},
  assignableRoles: {},
  assignableRolesLoading: {},
  assignableRolesLoaded: {},
  assignableRolesError: {},
  loading: false,
  error: null,
};

export const fetchCurrentUserAccess = createAsyncThunk<
  UserAccess,
  void,
  { rejectValue: string }
>(
  "access/fetchCurrentUserAccess",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetCurrentUserAccessResponseDto>(
        "/users/me/access"
      );

      if (isGetCurrentUserAccessSuccessResponse(response.data)) {
        return mapCurrentUserAccessDtoToEntity(response.data);
      }

      return rejectWithValue(
        getBackendErrorMessage(
          response.data,
          "Не удалось загрузить права доступа пользователя"
        )
      );
    } catch (error: unknown) {
      const responseData = (
        error as { response?: { data?: unknown } }
      ).response?.data;

      return rejectWithValue(
        getBackendErrorMessage(
          responseData ?? error,
          "Не удалось загрузить права доступа пользователя"
        )
      );
    }
  }
);

export const fetchAssignableRoles = createAsyncThunk<
  { scope: RoleReferenceScope; roles: RoleReference[] },
  { scope: RoleReferenceScope },
  { rejectValue: string }
>(
  "access/fetchAssignableRoles",
  async ({ scope }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetRoleReferencesResponseDto>(
        `/references/roles/${scope}/assignable`
      );

      if (isGetRoleReferencesSuccessResponse(response.data)) {
        return { scope, roles: response.data.roles };
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "Не удалось загрузить справочник ролей")
      );
    } catch (error: unknown) {
      const responseData = (
        error as { response?: { data?: unknown } }
      ).response?.data;

      return rejectWithValue(
        getBackendErrorMessage(responseData ?? error, "Не удалось загрузить справочник ролей")
      );
    }
  }
);

export const fetchRoleReferences = createAsyncThunk<
  { scope: RoleReferenceScope; roles: RoleReference[] },
  { scope: RoleReferenceScope },
  { rejectValue: string }
>(
  "access/fetchRoleReferences",
  async ({ scope }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetRoleReferencesResponseDto>(
        `/references/roles/${scope}`
      );

      if (isGetRoleReferencesSuccessResponse(response.data)) {
        return { scope, roles: response.data.roles };
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "Не удалось загрузить справочник ролей")
      );
    } catch (error: unknown) {
      const responseData = (
        error as { response?: { data?: unknown } }
      ).response?.data;

      return rejectWithValue(
        getBackendErrorMessage(responseData ?? error, "Не удалось загрузить справочник ролей")
      );
    }
  }
);

export const acceptSystemAccessInvitation = createAsyncThunk<
  void,
  { id: string },
  { rejectValue: string }
>(
  "access/acceptSystemAccessInvitation",
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<
        SystemAccessInvitationActionResponseDto
      >(
        `/users/me/system-access/invitations/${id}`,
        { decision: "accept" } satisfies SystemAccessInvitationDecisionDto
      );

      if (isSystemAccessInvitationActionSuccessResponse(response.data)) {
        await dispatch(fetchCurrentUserAccess());
        return;
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "Не удалось принять приглашение")
      );
    } catch (error: unknown) {
      const responseData = (
        error as { response?: { data?: unknown } }
      ).response?.data;

      return rejectWithValue(
        getBackendErrorMessage(responseData ?? error, "Не удалось принять приглашение")
      );
    }
  }
);

export const declineSystemAccessInvitation = createAsyncThunk<
  void,
  { id: string },
  { rejectValue: string }
>(
  "access/declineSystemAccessInvitation",
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<
        SystemAccessInvitationActionResponseDto
      >(
        `/users/me/system-access/invitations/${id}`,
        { decision: "decline" } satisfies SystemAccessInvitationDecisionDto
      );

      if (isSystemAccessInvitationActionSuccessResponse(response.data)) {
        await dispatch(fetchCurrentUserAccess());
        return;
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "Не удалось отклонить приглашение")
      );
    } catch (error: unknown) {
      const responseData = (
        error as { response?: { data?: unknown } }
      ).response?.data;

      return rejectWithValue(
        getBackendErrorMessage(responseData ?? error, "Не удалось отклонить приглашение")
      );
    }
  }
);

export const accessSlice = createSlice({
  name: "access",
  initialState,
  reducers: {
    setAccessData(state, action: PayloadAction<UserAccess>) {
      state.data = action.payload;
      state.error = null;
    },
    setCurrentCompanyId(state, action: PayloadAction<string | null>) {
      state.currentCompanyId = action.payload;
    },
    setAccessLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAccessError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearAccess(state) {
      state.data = null;
      state.currentCompanyId = null;
      state.roleReferences = {};
      state.roleReferencesLoading = {};
      state.roleReferencesLoaded = {};
      state.roleReferencesError = {};
      state.assignableRoles = {};
      state.assignableRolesLoading = {};
      state.assignableRolesLoaded = {};
      state.assignableRolesError = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUserAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserAccess.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCurrentUserAccess.rejected, (state, action) => {
        state.data = null;
        state.loading = false;
        state.error =
          action.payload ?? "Не удалось загрузить права доступа пользователя";
      })
      .addCase(fetchRoleReferences.pending, (state, action) => {
        state.roleReferencesLoading[action.meta.arg.scope] = true;
        state.roleReferencesError[action.meta.arg.scope] = null;
      })
      .addCase(fetchRoleReferences.fulfilled, (state, action) => {
        state.roleReferences[action.payload.scope] = action.payload.roles;
        state.roleReferencesLoading[action.payload.scope] = false;
        state.roleReferencesLoaded[action.payload.scope] = true;
        state.roleReferencesError[action.payload.scope] = null;
      })
      .addCase(fetchRoleReferences.rejected, (state, action) => {
        state.roleReferencesLoading[action.meta.arg.scope] = false;
        state.roleReferencesLoaded[action.meta.arg.scope] = true;
        state.roleReferencesError[action.meta.arg.scope] =
          action.payload ?? "Не удалось загрузить справочник ролей";
      })
      .addCase(fetchAssignableRoles.pending, (state, action) => {
        state.assignableRolesLoading[action.meta.arg.scope] = true;
        state.assignableRolesError[action.meta.arg.scope] = null;
      })
      .addCase(fetchAssignableRoles.fulfilled, (state, action) => {
        state.assignableRoles[action.payload.scope] = action.payload.roles;
        state.assignableRolesLoading[action.payload.scope] = false;
        state.assignableRolesLoaded[action.payload.scope] = true;
        state.assignableRolesError[action.payload.scope] = null;
      })
      .addCase(fetchAssignableRoles.rejected, (state, action) => {
        state.assignableRolesLoading[action.meta.arg.scope] = false;
        state.assignableRolesLoaded[action.meta.arg.scope] = true;
        state.assignableRolesError[action.meta.arg.scope] =
          action.payload ?? "Не удалось загрузить справочник ролей";
      });
  },
});

export const {
  setAccessData,
  setCurrentCompanyId,
  setAccessLoading,
  setAccessError,
  clearAccess,
} = accessSlice.actions;

export default accessSlice.reducer;
