// src/config/env.ts
const verify = (value: any) => {
    // check if null, empty or equal to ''
    return !(value == null || value === '' || value === undefined);
}

export const PORT = verify(process.env.PORT) ? process.env.PORT: 80;
export const DB_USERNAME: string  = verify(process.env.DB_USERNAME) ? process.env.DB_USERNAME as string : '';

export const DB_PASSWORD: string = verify(process.env.DB_PASSWORD) ? process.env.DB_PASSWORD as string : '';

export const DB_HOST: string = verify(process.env.DB_HOST) ? process.env.DB_HOST as string : '';

export const DB_NAME: string = verify(process.env.DB_NAME) ? process.env.DB_NAME as string : '';

export const DB_URL: string = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?appName=mongosh+1.9.1&retryWrites=true&w=majority`;

// You should ideally store the JWT secret in an environment variable for security purposes
export const JWT_SECRET: string = verify(process.env.JWT_SECRET) ? process.env.PORT as string: 'SECRET';

export const JWT_EXPIRATION: string = verify(process.env.JWT_EXPIRATION) ? process.env.JWT_EXPIRATION as string : '';

// Keycloak
export const KEYCLOAK_REALM: string = verify(process.env.KEYCLOAK_REALM) ? process.env.KEYCLOAK_REALM as string : '';

export const KEYCLOAK_SERVER_URL: string = verify(process.env.KEYCLOAK_SERVER_URL) ? process.env.KEYCLOAK_SERVER_URL as string : '';

export const KEYCLOAK_CLIENT_ID: string = verify(process.env.KEYCLOAK_CLIENT_ID) ? process.env.KEYCLOAK_CLIENT_ID as string : '';

export const KEYCLOAK_CLIENT_SECRET: string = verify(process.env.KEYCLOAK_CLIENT_SECRET) ? process.env.KEYCLOAK_CLIENT_SECRET as string : '';

export const KEYCLOAK_ADMIN_USERNAME: string = verify(process.env.KEYCLOAK_ADMIN_USERNAME) ? process.env.KEYCLOAK_ADMIN_USERNAME as string : '';

export const KEYCLOAK_ADMIN_PASSWORD: string = verify(process.env.KEYCLOAK_ADMIN_PASSWORD) ? process.env.KEYCLOAK_ADMIN_PASSWORD as string : '';
