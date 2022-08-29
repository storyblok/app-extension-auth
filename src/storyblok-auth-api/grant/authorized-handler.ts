import http from "http";
// @ts-ignore
import makeSessionParser from "grant/lib/session";
import {appendQueryParams} from "@src/utils/append-query-params";
import {UserInfo, sessionCookieStore, AppSessionQueryParams} from "@src/index";
import {makeCookieStore} from "@src/utils/cookie-store";
import {AppSession} from "@src/session/app-session";
import {JwtCookieParams} from "@src/storyblok-auth-api/params/jwt-cookie-params";
import {AppParams} from "@src/storyblok-auth-api/params/app-params";
import {grantCookieName} from "@src/storyblok-auth-api/grant/grant-handler";

export type CallbackParams =  {
    // Will redirect back to this route after a successful authentication
    successCallback?: string
    // Will redirect back to this route after an unsuccessful authentication
    errorCallback?: string
}

export type GrantCallbackHandlerParams = CallbackParams & JwtCookieParams & AppParams

type GrantResponse = {
    refresh_token: string
    access_token: string
    profile: UserInfo
    raw?: {
        expires_in?: number
    }
}

export const authorizedHandler = (
    params: GrantCallbackHandlerParams
) =>
    async (
        request: http.IncomingMessage,
        response: http.ServerResponse,
    ): Promise<void> => {
        try {
            const sessionParser = makeSessionParser({
                name: grantCookieName,
                secret: params.jwtSecret,
            })
            const grantSession = (await sessionParser(request).get())

            if(grantSession.grant.provider !== 'storyblok'){
                console.log(`handleConnect() can only handle callbacks after authenticating with storyblok, 
                got: ${grantSession.grant.provider}. Please verify that you're not using an auth store.`)
                response.writeHead(401).end()
                return
            }

            const grantResponse = getGrantResponse(grantSession)

            if(!grantResponse){
                response.writeHead(401).end()
                return
            }

            const appSession: AppSession = ({
                refreshToken: grantResponse.refresh_token,
                accessToken: grantResponse.access_token,
                userId: grantResponse.profile.user.id,
                userName: grantResponse.profile.user.friendly_name,
                spaceId: grantResponse.profile.space.id,
                spaceName: grantResponse.profile.space.name,
                appClientId: params.appClientId,
                roles: grantResponse.profile.roles.map(role => role.name),
                expiresAt: Date.now() + (grantResponse.raw?.expires_in ?? 60 * 10) * 1000,
            })

            const queryParams: AppSessionQueryParams = {
                spaceId: appSession.spaceId.toString(),
                userId: appSession.userId.toString(),
            }

            const redirectTo = appendQueryParams(
                params?.successCallback ?? '/',
                queryParams
            )

            const appSessions = sessionCookieStore( params)({req: request, res: response})
            await appSessions.put(appSession)

            // Cleanup the cookie that was set by grant during the oauth flow
            const cookies = makeCookieStore({
                req: request,
                res: response,
            })
            cookies.remove(grantCookieName)

            response.writeHead(302, {
                Location: redirectTo.toString()
            }).end()
        } catch (e) {
            console.error(e)
            if (params?.errorCallback) {
                response.writeHead(302, {
                    Location: params.errorCallback
                }).end()
            } else {
                response.writeHead(400).end()
            }
        }
    }

const getGrantResponse = (grantSession: any): GrantResponse | undefined => (
    // TODO validate
    grantSession.grant.response
)

// const grantResponseSchema = Joi.object<GrantResponse, true>().keys({
//     raw: Joi.object<GrantResponse['raw']>().keys({
//         expires_in: Joi.number().optional(),
//     }).optional(),
//     profile: Joi.object<UserInfo>().keys({
//         roles: Joi.array().items(
//             Joi.object<Role>().keys({
//                 name: Joi.string().required(),
//             })
//         ).required(),
//         user: Joi.object<User>().keys({
//             id: Joi.number().required(),
//             friendly_name: Joi.string().required()
//         }).required(),
//         space: Joi.object<Space>().keys({
//             id: Joi.number().required(),
//             name: Joi.string().required(),
//         }).required(),
//     }),
//     access_token: Joi.string().required(),
//     refresh_token: Joi.string().required(),
// })
