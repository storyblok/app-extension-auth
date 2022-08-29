import {Issuer} from "openid-client";

export const oauthEndpoint = 'https://app.storyblok.com/oauth'
export const profile_url = `${oauthEndpoint}/user_info`

export const storyblokIssuer = new Issuer({
    issuer: 'storyblok',
    authorization_endpoint: require('grant/config/oauth.json').storyblok.authorize_url,
    token_endpoint: require('grant/config/oauth.json').storyblok.access_url,
    userinfo_endpoint: profile_url,
})