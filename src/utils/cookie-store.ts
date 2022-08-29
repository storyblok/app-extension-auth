import Cookies from "cookies";
import {RequestParams} from "@src/session/request-params";
import {appCookieOptions} from "@src/storyblok-auth-api/cookie-options";

type CookieStore = {
    get: (name: string) => string | undefined,
    set: (name: string, value: string) => void,
    remove: (name: string) => void,
}

type FactoryParams = RequestParams

type CookieStoreFactory = (params: FactoryParams) => CookieStore

export const makeCookieStore: CookieStoreFactory = (params) => {
    const {req, res} = params
    const cookies = new Cookies(req, res, {
        secure: true  // Prevent the Cookie package from checking whether the request is https.
    })
    return {
        get: (name) => cookies.get(name),
        set: (name, value) => cookies.set(name, value, appCookieOptions()),
        remove: (name) => cookies.set(name)
    }
}
