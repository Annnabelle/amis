import type {
  ChangePasswordDto,
  DeleteUserDto,
  ForgotPasswordDto,
  GetUserDto,
  GetUsersDto,
  ResetPasswordDto,
  SetPasswordDto,
  UpdateUserPreferencesDto,
  VerifyEmailDto,
} from "@edem2000/amis.contracts/api/users/requests";
import type { UserCompanyMembershipsResponseDto } from "@edem2000/amis.contracts/api/company-memberships/responses";
import type {
  AccountActionResponseDto,
  GetUserPreviewResponseDto,
  GetUserResponseDto,
  GetUserSystemAccessResponseDto,
  ResetPasswordResponseDto,
  UpdateUserResponseDto,
} from "@edem2000/amis.contracts/api/users/responses";
import type {
  ChangePasswordResponseBodyDto,
  LoginResponseBodyDto,
} from "entities/users/dtos";
import { mapCompanyMembershipDtoToEntity } from "entities/companyMemberships/mappers";
import type { CompanyMembership } from "entities/companyMemberships/types";
import { mapSystemEmployeeDtoToEntity } from "entities/systemEmployees/mappers";
import type { SystemEmployee } from "entities/systemEmployees/types";
import {
  mapChangePwdDtoToSession,
  mapChangePwdFormToChangePwdDto,
  mapCreateUserFormToDto,
  mapLoginFormToLoginDto,
  mapLoginResponseDtoToSession,
  mapRegisterFormToDto,
  mapUpdateUserDtoToEntity,
  mapUpdateUserFormToDto,
  mapUserPreviewDtoToEntity,
  mapUsersDtoToEntity,
} from "entities/users/mappers";
import type {
  AddUserForm,
  AuthSession,
  ChangePassword,
  LoginForm,
  RegisterForm,
  User,
  UserList,
  UserPreview,
} from "entities/users/types";
import {
  ApiTags,
  LIST_TAG_ID,
  baseApi,
  request,
  toPaginated,
  type SuccessOf,
} from "shared/api";
import { saveAuthSession } from "shared/lib/authSession";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const listTag = [{ type: ApiTags.User, id: LIST_TAG_ID }];
const currentUserTag = [{ type: ApiTags.User, id: "ME" }];

type SearchUsersParams = {
  query: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthSession, LoginForm>({
      query: (form) =>
        request(endpointAccessMap.authLogin, {
          data: mapLoginFormToLoginDto(form),
        }),
      transformResponse: (response: LoginResponseBodyDto) =>
        mapLoginResponseDtoToSession(response),
      /** Токены в хранилище пишутся здесь, а не в редьюсере: редьюсер чистый. */
      onQueryStarted: async (_form, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          saveAuthSession(data);
        } catch {
          // Отказ показывает вызывающий код; здесь глотаем, чтобы не оставить
          // необработанное отклонение промиса.
        }
      },
    }),

    /** Выход снимает httpOnly-cookie: из браузера её не удалить. */
    logout: build.mutation<void, void>({
      query: () => request(endpointAccessMap.authLogout),
      transformResponse: (): void => undefined,
    }),

    getUsers: build.query<UserList, GetUsersDto>({
      query: (params) => request(endpointAccessMap.usersList, { params }),
      transformResponse: toPaginated(mapUsersDtoToEntity),
      providesTags: listTag,
    }),

    searchUsers: build.query<UserList, SearchUsersParams>({
      query: ({ query, page = 1, limit = 10, sortOrder = "asc" }) =>
        request(endpointAccessMap.usersSearch, {
          params: { query, page, limit, sortOrder },
        }),
      transformResponse: toPaginated(mapUsersDtoToEntity),
      /** Поиск показывает те же записи, что список: мутация устаревает и его. */
      providesTags: listTag,
    }),

    getUserById: build.query<User, GetUserDto>({
      query: ({ id }) =>
        request(endpointAccessMap.usersRead, { pathParams: { id } }),
      transformResponse: (response: SuccessOf<GetUserResponseDto>) =>
        mapUsersDtoToEntity(response.user),
      providesTags: (_result, _error, { id }) => [{ type: ApiTags.User, id }],
    }),

    getUserPreview: build.query<UserPreview, GetUserDto>({
      query: ({ id }) =>
        request(endpointAccessMap.usersPreview, { pathParams: { id } }),
      transformResponse: (response: SuccessOf<GetUserPreviewResponseDto>) =>
        mapUserPreviewDtoToEntity(response.data),
      providesTags: (_result, _error, { id }) => [
        { type: ApiTags.UserPreview, id },
      ],
    }),

    /**
     * Доступы пользователя: свои читаются по /users/me/..., чужие — по id.
     * Запросы разные, поэтому переключатель живёт в аргументе.
     */
    getUserCompanyMemberships: build.query<
      CompanyMembership[],
      { self: boolean; id?: string }
    >({
      query: ({ self, id }) =>
        self
          ? request(endpointAccessMap.currentUserCompanyMemberships)
          : request(endpointAccessMap.userCompanyMemberships, {
              pathParams: { id: id ?? "" },
            }),
      transformResponse: (
        response: SuccessOf<UserCompanyMembershipsResponseDto>
      ) => response.data.map(mapCompanyMembershipDtoToEntity),
    }),

    getUserSystemAccess: build.query<
      SystemEmployee | null,
      { self: boolean; id?: string }
    >({
      query: ({ self, id }) =>
        self
          ? request(endpointAccessMap.currentUserSystemAccess)
          : request(endpointAccessMap.userSystemAccess, {
              pathParams: { id: id ?? "" },
            }),
      transformResponse: (
        response: SuccessOf<GetUserSystemAccessResponseDto>
      ) => (response.data ? mapSystemEmployeeDtoToEntity(response.data) : null),
    }),

    getCurrentUser: build.query<User, void>({
      query: () => request(endpointAccessMap.currentUser),
      transformResponse: (response: SuccessOf<GetUserResponseDto>) =>
        mapUsersDtoToEntity(response.user),
      providesTags: currentUserTag,
    }),

    /** Админ создаёт пользователя: пароля нет, бэкенд шлёт ссылку активации. */
    createUser: build.mutation<User, AddUserForm>({
      query: (form) =>
        request(endpointAccessMap.usersCreate, {
          data: mapCreateUserFormToDto(form),
        }),
      transformResponse: (response: SuccessOf<AccountActionResponseDto>) =>
        mapUsersDtoToEntity(response.user),
      invalidatesTags: listTag,
    }),

    /** Самостоятельная регистрация. */
    registerAccount: build.mutation<User, RegisterForm>({
      query: (form) =>
        request(endpointAccessMap.authRegister, {
          data: mapRegisterFormToDto(form),
        }),
      transformResponse: (response: SuccessOf<AccountActionResponseDto>) =>
        mapUsersDtoToEntity(response.user),
    }),

    verifyEmail: build.mutation<User, VerifyEmailDto>({
      query: (data) => request(endpointAccessMap.authVerifyEmail, { data }),
      transformResponse: (response: SuccessOf<AccountActionResponseDto>) =>
        mapUsersDtoToEntity(response.user),
    }),

    setPassword: build.mutation<User, SetPasswordDto>({
      query: (data) => request(endpointAccessMap.authSetPassword, { data }),
      transformResponse: (response: SuccessOf<AccountActionResponseDto>) =>
        mapUsersDtoToEntity(response.user),
    }),

    updateUser: build.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) =>
        request(endpointAccessMap.usersUpdate, {
          pathParams: { id },
          data: mapUpdateUserFormToDto(data),
        }),
      transformResponse: (response: SuccessOf<UpdateUserResponseDto>) =>
        mapUpdateUserDtoToEntity(response.user),
      invalidatesTags: (_result, _error, { id }) => [
        { type: ApiTags.User, id },
        { type: ApiTags.UserPreview, id },
        ...listTag,
      ],
    }),

    updateUserPreferences: build.mutation<User, UpdateUserPreferencesDto>({
      query: (data) =>
        request(endpointAccessMap.currentUserPreferencesUpdate, { data }),
      transformResponse: (response: SuccessOf<UpdateUserResponseDto>) =>
        mapUsersDtoToEntity(response.user),
      invalidatesTags: currentUserTag,
    }),

    /** Админ сбрасывает пароль пользователю. */
    changeUserPassword: build.mutation<
      AuthSession,
      { userId: string; data: ChangePasswordDto }
    >({
      query: ({ userId, data }) =>
        request(endpointAccessMap.usersResetPassword, {
          pathParams: { id: userId },
          data,
        }),
      transformResponse: (response: ChangePasswordResponseBodyDto) =>
        mapChangePwdDtoToSession(response),
    }),

    /** Свой пароль: в ответ приходят новые токены. */
    changeOwnPassword: build.mutation<AuthSession, ChangePassword>({
      query: (form) =>
        request(endpointAccessMap.currentUserPasswordUpdate, {
          data: mapChangePwdFormToChangePwdDto(form),
        }),
      transformResponse: (response: ChangePasswordResponseBodyDto) =>
        mapChangePwdDtoToSession(response),
      onQueryStarted: async (_form, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          saveAuthSession(data);
        } catch {
          // см. login: отказ обрабатывает страница
        }
      },
      invalidatesTags: currentUserTag,
    }),

    forgotPassword: build.mutation<void, ForgotPasswordDto>({
      query: ({ email }) =>
        request(endpointAccessMap.authForgotPassword, {
          data: { email: email.trim().toLowerCase() },
        }),
      transformResponse: (): void => undefined,
    }),

    resetPassword: build.mutation<User, ResetPasswordDto>({
      query: (data) => request(endpointAccessMap.authResetPassword, { data }),
      transformResponse: (response: SuccessOf<ResetPasswordResponseDto>) =>
        mapUsersDtoToEntity(response.user),
    }),

    deleteUser: build.mutation<void, DeleteUserDto>({
      query: ({ id }) =>
        request(endpointAccessMap.usersDelete, { pathParams: { id } }),
      transformResponse: (): void => undefined,
      invalidatesTags: (_result, _error, { id }) => [
        { type: ApiTags.User, id },
        ...listTag,
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUsersQuery,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useGetUserByIdQuery,
  useGetUserPreviewQuery,
  useGetCurrentUserQuery,
  useGetUserCompanyMembershipsQuery,
  useGetUserSystemAccessQuery,
  useCreateUserMutation,
  useRegisterAccountMutation,
  useVerifyEmailMutation,
  useSetPasswordMutation,
  useUpdateUserMutation,
  useUpdateUserPreferencesMutation,
  useChangeUserPasswordMutation,
  useChangeOwnPasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useDeleteUserMutation,
} = usersApi;
