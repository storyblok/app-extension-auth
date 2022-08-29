import {authorizedHandler, GrantCallbackHandlerParams} from "@src/storyblok-auth-api/grant/authorized-handler";
import * as url from "url";
import {RequestHandler} from "@src/storyblok-auth-api/request-handler";
import {callbackRouteSlug, grantHandler, GrantHandlerParams} from "@src/storyblok-auth-api/grant/grant-handler";

export type AuthHandlerParams = GrantCallbackHandlerParams & GrantHandlerParams

export const authHandler = (params: AuthHandlerParams): RequestHandler => (
    async (request, response) => {
        const slugs = request.url && url.parse(request.url)?.pathname?.split('/')
        const lastSlug = slugs && slugs[slugs.length - 1]
        switch (lastSlug){
            case callbackRouteSlug:
                return authorizedHandler(params)(request, response)
            default:
                return grantHandler(params)(request, response)
        }
    }
)