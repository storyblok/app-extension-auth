import http from "http";
import makeSessionParser from "grant/lib/session";
import {appendQueryParams} from "@src/utils/query-params/append-query-params";
import {AppSession, AppSessionQueryParams} from "@src/session/app-session";
import {JwtCookieParams} from "@src/storyblok-auth-api/params/jwt-cookie-params";
import {AppParams} from "@src/storyblok-auth-api/params/app-params";
import {grantCookieName} from "@src/storyblok-auth-api/grant/grant-handler";
import {sessionCookieStore} from "@src/session";
import {UserInfo} from "@src/storyblok-auth-api";
import {expireCookie} from "@src/utils/cookie/set-cookie";

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
                console.log(`Can only handle callbacks after authenticating with storyblok, 
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

            const appSessions = sessionCookieStore(params)({req: request, res: response})
            await appSessions.put(appSession)

            // Cleanup the cookie that was set by grant during the oauth flow
            expireCookie(response, grantCookieName)

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
                response.writeHead(401).end()
            }
        }
    }

const getGrantResponse = (grantSession: any): GrantResponse | undefined => (
    // TODO validate
    grantSession.grant.response
)
