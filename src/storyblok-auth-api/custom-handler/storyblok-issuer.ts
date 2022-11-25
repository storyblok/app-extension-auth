import { Issuer } from 'openid-client'

const oauthUrl = 'https://app.storyblok.com/oauth'
export const userinfo_endpoint = `${oauthUrl}/user_info`
export const authorization_endpoint = `${oauthUrl}/authorize`
export const token_endpoint = `${oauthUrl}/token`
export const oauthEndpoint = 'https://app.storyblok.com/oauth'

export const storyblokIssuer = new Issuer({
  issuer: 'storyblok',
  authorization_endpoint,
  token_endpoint,
  userinfo_endpoint,
})
