// export const BASE_URL = "http://localhost:3000";
import { config } from "shared/config/runtime";
export const BASE_URL = config.apiBaseUrl;


export const UserRoles = {
    superadmin: 'superadmin',
    admin: 'admin',
    operator: 'operator',
}

export type LangKey = 'ru' | 'uz' | 'en';


