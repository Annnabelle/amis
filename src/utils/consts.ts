// export const BASE_URL = "http://localhost:3000";
// export const BASE_URL = "https://api.amis.uz";
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

console.log(BASE_URL);

export const UserRoles = {
    superadmin: 'superadmin',
    admin: 'admin',
    operator: 'operator',
}

export type LangKey = 'ru' | 'uz' | 'en';