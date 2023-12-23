// src/config/env.ts
export const PORT = process.env.PORT || 3000;

export const DB_USERNAME = process.env.DB_USERNAME || 'Cluster71885';

export const DB_PASSWORD = process.env.DB_PASSWORD || 'QklKdl9fcGxu';

export const DB_HOST = process.env.DB_HOST || 'cluster71885.1ol99nm.mongodb.net';

export const DB_NAME = process.env.DB_NAME || 'user_management_service';

// mongodb+srv://Cluster71885:QklKdl9fcGxu@cluster71885.1ol99nm.mongodb.net/user_management_service?appName=mongosh+1.9.1
export const DB_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?appName=mongosh+1.9.1&retryWrites=true&w=majority`;

// You should ideally store the JWT secret in an environment variable for security purposes
export const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

// Keycloak
export const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'test-sso';

export const KEYCLOAK_SERVER_URL = process.env.KEYCLOAK_SERVER_URL || 'http://127.0.0.1:3000';

export const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'onekonsole-client';

export const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET || 'QFTpdRcDnEycoN15aOqgfTRY3iDNgSJ6';

export const KEYCLOAK_ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN_USERNAME || 'admin';

export const KEYCLOAK_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin';