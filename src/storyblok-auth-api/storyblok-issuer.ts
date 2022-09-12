import {Issuer} from "openid-client";

const oauthEndpoint = 'https://app.storyblok.com/oauth'
export const profile_url = `${oauthEndpoint}/user_info`

export const storyblokIssuer = new Issuer({
  issuer: 'storyblok',
  authorization_endpoint: 'https://app.storyblok.com/oauth/authorize',
  token_endpoint: "https://app.storyblok.com/oauth/token",
  userinfo_endpoint: profile_url,
})