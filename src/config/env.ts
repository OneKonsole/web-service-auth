// src/config/env.ts
export const PORT = process.env.PORT || 80;

export const DB_USERNAME = process.env.DB_USERNAME || '';

export const DB_PASSWORD = process.env.DB_PASSWORD || '';

export const DB_HOST = process.env.DB_HOST || '';

export const DB_NAME = process.env.DB_NAME || '';

export const DB_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?appName=mongosh+1.9.1&retryWrites=true&w=majority`;

// You should ideally store the JWT secret in an environment variable for security purposes
export const JWT_SECRET = process.env.JWT_SECRET || '';

export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '';

// Keycloak
export const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || '';

export const KEYCLOAK_SERVER_URL = process.env.KEYCLOAK_SERVER_URL || '';

export const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || '';

export const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET || '';

export const KEYCLOAK_ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN_USERNAME || '';

export const KEYCLOAK_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || '';