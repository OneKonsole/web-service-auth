import axios from "axios";
import * as querystring from 'querystring';

import {IUserController} from "./IUserController";
import {Request, Response} from "express";
import {
    KEYCLOAK_ADMIN_PASSWORD,
    KEYCLOAK_ADMIN_USERNAME,
    KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET,
    KEYCLOAK_REALM,
    KEYCLOAK_SERVER_URL
} from "../config/env";
import {UserProperties} from "../../types";
import {LOG_TYPE, logger} from "../utils/logger";

export default class APIUserController implements IUserController {
    private async loginUser(username: string, password: string): Promise<{
        token: any;
        refreshToken: any
    }> {
        const data = {
            'client_id': KEYCLOAK_CLIENT_ID,
            'client_secret': KEYCLOAK_CLIENT_SECRET,
            'grant_type': 'password',
            'username': username,
            'password': password
        };

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: querystring.stringify(data)
        };

        try {
            logger(`Trying to login user ${username}`, LOG_TYPE.INFO);
            const response = await axios.request(config);
            return {
                token: response.data.access_token,
                refreshToken: response.data.refresh_token
            }
        } catch (e: any) {
            logger(e.message, LOG_TYPE.ERROR);
            throw new Error('Failed to login');
        }
    }

    // declare method to get admin bearer token
    private async getAdminToken(): Promise<string> {
        // TODO : Add a method that use some admin creds to get a token and create a user
        return this.loginUser(KEYCLOAK_ADMIN_USERNAME, KEYCLOAK_ADMIN_PASSWORD)
            .then((response) => {
                return response.token;
            })
            .catch((error) => {
                console.error(error);
                return "";
            });
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const {email, password, firstname, lastname, username} = req.body;
        // get bearer token
        const bearerToken = await this.getAdminToken();

        let data = JSON.stringify({
            "username": username,
            "enabled": true,
            "firstName": firstname,
            "lastName": lastname,
            "email": email,
            "credentials": [
                {
                    "type": "password",
                    "value": password,
                    "temporary": false
                }
            ],
            "attributes": {
                "billing_info_postal_address_state_region": "",
                "billing_info_paypal_address": "",
                "billing_info_postal_address_city": "",
                "billing_info_postal_address_zipcode": "",
                "billing_info_postal_address_name": "",
                "billing_info_postal_address_street": "",
                "billing_info_postal_address_country": "",
                "company": "",
                "phone": "",
            }
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${KEYCLOAK_SERVER_URL}/admin/realms/${KEYCLOAK_REALM}/users?client_id=${KEYCLOAK_CLIENT_ID}&client_secret=${KEYCLOAK_CLIENT_SECRET}`,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + bearerToken
            },
            data: data
        };

        // use axios to create user
        try {
            logger(`Trying to create user ${username}`, LOG_TYPE.INFO);
            await axios.request(config);
            res.status(201).send({
                message: 'User created successfully',
                code: 201
            });
        } catch (e: any) {
            logger(e.message, LOG_TYPE.ERROR);
            res.status(500).send({
                message: 'Failed to create user',
                code: 500
            });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        logger(`Not implemented`, LOG_TYPE.WARNING);
        return Promise.resolve(undefined);
    }

    async getUserInfo(token: string): Promise<any> {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": token
            }
        }

        try {
            logger(`Trying to get user details`, LOG_TYPE.INFO);
            const response = await axios.request(config);
            return {
                ...response.data,
                message: 'User details retrieved successfully',
                code: 200
            }
        } catch (e: any) {
            logger(e.message, LOG_TYPE.ERROR);
            return {
                message: 'Failed to get user details',
                code: 500
            };
        }
    }

    async getUser(req: Request, res: Response): Promise<void> {

        const bearerToken = req.headers.authorization;
        if (bearerToken === undefined || bearerToken === null) {
            res.status(500).send({
                message: 'Failed to get user',
                code: 500
            });
        }
        const result = await this.getUserInfo(bearerToken as string);
        res.status(result.code).send(result);
    }

    async login(req: Request, res: Response): Promise<void> {
        // get username and password from the request
        const {username, password} = req.body;

        // login user
        try {
            logger(`Trying to login user ${username}`, LOG_TYPE.INFO);
            const {token, refreshToken} = await this.loginUser(username, password);

            if (!token || !refreshToken) {
                logger(`Failed to login user ${username}`, LOG_TYPE.ERROR);
                throw new Error('Failed to login');
            }
            logger(`User ${username} logged in successfully`, LOG_TYPE.INFO);
            res.status(201).send({
                message: 'User login successfully',
                data: {
                    token: token,
                    refreshToken: refreshToken
                },
                code: 201
            });
        } catch (e: any) {
            logger(e.message, LOG_TYPE.ERROR);
            res.status(500).send({
                message: 'Failed to login',
                code: 500
            });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const bearerToken = req.headers.authorization;

        // get the user id from the url as form /users/:id
        const userId = req.params.userUuid;


        const userInfo = await this.getUserInfo(bearerToken as string);
        // check is sub is equal to the user id

        if (userInfo.sub !== userId) {
            res.status(401).send({
                message: 'Unauthorized',
                code: 401
            });
            return;
        }

        // get admin bearer token
        const adminToken = await this.getAdminToken();

        const {
            email,
            firstName,
            lastName,
            billing_info_postal_address_state_region,
            billing_info_paypal_address,
            billing_info_postal_address_city,
            billing_info_postal_address_zipcode,
            billing_info_postal_address_name,
            billing_info_postal_address_street,
            billing_info_postal_address_country,
            company,
            phone,
            country,
            username,
            password
        } = req.body;


        const defaultProperties: { [key: string]: any } = {
            username,
            "firstName": firstName,
            "lastName": lastName,
            email
        }
        const customProperties: { [key: string]: any } = {
            phone,
            company,
            billing_info_postal_address_state_region,
            billing_info_paypal_address,
            billing_info_postal_address_city,
            billing_info_postal_address_zipcode,
            billing_info_postal_address_name,
            billing_info_postal_address_street,
            billing_info_postal_address_country,
            country
        }
        // filter undefined and null values
        Object.keys(customProperties).forEach(key => customProperties[key] === undefined || customProperties[key] === null ? delete customProperties[key] : {});
        Object.keys(defaultProperties).forEach(key => defaultProperties[key] === undefined || defaultProperties[key] === null ? delete defaultProperties[key] : {});

        let data: UserProperties = {
            "attributes": {
                ...customProperties,
            },
            ...defaultProperties
        };

        if (password !== undefined && password !== null && password !== "") {
            data = {
                ...data,
                "credentials": [
                    {
                        "type": "password",
                        "value": password,
                        "temporary": false
                    }
                ]
            }
        }

        const config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `${KEYCLOAK_SERVER_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + adminToken
            },
            data
        };

        try {
            logger(`Trying to update user ${username}`, LOG_TYPE.INFO);
            await axios.request(config);
            res.status(201).send({
                message: 'User updated successfully',
                code: 201
            });
        } catch (e: any) {
            logger(e.message, LOG_TYPE.ERROR)
            res.status(500).send({
                message: 'Failed to update user',
                code: 500
            });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        // get refresh token from the request
        const {refreshToken} = req.body;

        const data = JSON.stringify({
            'client_id': KEYCLOAK_CLIENT_ID,
            'client_secret': KEYCLOAK_CLIENT_SECRET,
            'refresh_token': refreshToken
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: data
        };

        try {
            logger(`Trying to logout user`, LOG_TYPE.INFO);
            await axios.request(config);
            res.status(201).send({
                message: 'User logout successfully',
                code: 201
            });
        } catch (e: any) {
            logger(e.message, LOG_TYPE.ERROR)
            res.status(500).send({
                message: 'Failed to logout',
                code: 500
            });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        const data = {
            'client_id': KEYCLOAK_CLIENT_ID,
            'client_secret': KEYCLOAK_CLIENT_SECRET,
            'grant_type': 'refresh_token',
            'refresh_token': req.body.refreshToken
        };

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: querystring.stringify(data)
        };

        try {
            const response = await axios.request(config);
            res.status(201).send({
                message: 'Token refreshed successfully',
                data: {
                    token: response.data.access_token,
                    refreshToken: response.data.refresh_token
                },
                code: 201
            });
        } catch (e: any) {
            logger(e.message, LOG_TYPE.ERROR)
            res.status(500).send({
                message: 'Failed to refresh token',
                code: 500
            });
        }
    }

    // TODO CHECK IF THIS IS NEEDED AT THIS POINT
    async verifyToken(token: string): Promise<void> {
        const data = {
            'client_id': KEYCLOAK_CLIENT_ID,
            'client_secret': KEYCLOAK_CLIENT_SECRET,
            'token': token
        };

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token/introspect`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: querystring.stringify(data)
        };

        const response = await axios.request(config);
        if (!response.data.active) {
            logger(`Token is not valid`, LOG_TYPE.ERROR)
            throw new Error('Token is not valid');
        }

        logger(`Token is valid`, LOG_TYPE.INFO)
    }
}