import grant from 'grant'
import {RequestHandler} from "@src/storyblok-auth-api/request-handler";
import {JwtCookieParams} from "@src/storyblok-auth-api/params/jwt-cookie-params";
import {AppParams} from "@src/storyblok-auth-api/params/app-params";
import {UrlParams} from "@src/storyblok-auth-api/url-params";
import {StoryblokOauthParams} from "@src/storyblok-auth-api/grant/storyblok-oauth-params";
import {profile_url} from "@src/storyblok-auth-api/storyblok-issuer";

export type GrantHandlerParams = JwtCookieParams & AppParams & UrlParams & StoryblokOauthParams

export const grantCookieName = 'grant'
export const callbackRouteSlug = 'authorized'

export const grantHandler = (params: GrantHandlerParams): RequestHandler => async (req, res) => {
    const {
        jwtSecret,
        appClientId,
        appClientSecret,
        appUrl,
        baseUrl,
    } = params
    void await grant.node({
        config: {
            defaults: {
                origin: appUrl,
                transport: 'session',
                prefix: baseUrl,
            },
            storyblok: {
                client_id: appClientId,
                client_secret: appClientSecret,
                scope: ['read_content'],
                callback: `${baseUrl}/${callbackRouteSlug}`,
                profile_url, // TODO add to grant profile.json > storyblok
                response: ['tokens', 'profile', 'raw'], // raw is needed for the expires_in, token is needed for profile
                pkce: true,
                state: true,
                token_endpoint_auth_method: 'client_secret_post',
            },
        },
        session: {
            secret: jwtSecret,
            name: grantCookieName,
            cookie: ({
                path: '/',
                secure: true,
                sameSite: 'none', // Needed since custom apps are embedded in iframes
                httpOnly: true, // The refresh token must not be accessible via client-side javascript
            }),
        },
    })(req, res)
}