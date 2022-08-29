import Cookies from "cookies";

export const appCookieOptions = (expireSoon: boolean = false): Cookies.SetOption => ({
    path: '/',
    secure: true,
    sameSite: 'none', // Needed since custom apps are embedded in iframes
    httpOnly: true, // The refresh token must not be accessible via client-side javascript
    maxAge: expireSoon ? 5 * 60 * 1000 : undefined,
})