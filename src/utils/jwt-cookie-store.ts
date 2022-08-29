import jwt from "jsonwebtoken";
import {makeCookieStore} from "@src/utils/cookie-store";
import {RequestParams} from "@src/session/request-params";

type JwtCookieStore<Payload extends Record<string, unknown>> = {
    get: (name: string) => Payload | undefined,
    set: (name: string, value: Payload) => void,
    remove: (name: string) => void,
}

type FactoryParams = {
    jwtSecret: string
} & RequestParams

export const makeJwtCookieStore = <Payload  extends Record<string, unknown>,>(params: FactoryParams): JwtCookieStore<Payload> => {
    const {jwtSecret} = params
    const cookieStore = makeCookieStore(params)
    return {
        get: (name) => {
            const serverSessionCookie = cookieStore.get(name)
            if (!serverSessionCookie) {
                return undefined
            }
            return jwt.verify(serverSessionCookie, jwtSecret) as Payload
        },
        set: (name, value) => (
            cookieStore.set(
                name,
                jwt.sign(value, jwtSecret)
            )
        ),
        remove: cookieStore.remove
    }
}
