<div style="text-align:center">
	<h1 style="text-align:center">
        @storyblok/app-extension-auth
    </h1>
  <p style="text-align:center">
    A typed JavaScript library for handling authentication with <a href="https://www.storyblok.com" target="_blank">Storyblok</a> apps.
  </p>
  <br />
</div>

[![Node.js Package](https://github.com/storyblok/app-extension-auth/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/storyblok/app-extension-auth/actions/workflows/npm-publish.yml)

## Usage

`@storyblok/app-extension-auth` helps you manage authentication for Storyblok apps. For your project, you will need both a frontend and a backend (which can be serverless).

See our starters:

* [Next.js](https://github.com/storyblok/custom-app-examples/tree/main/app-nextjs-starter)

### Install the app

Install with npm:

```shell
npm install --save-exact @storyblok/app-extension-auth
```

or with Yarn:

```shell
yarn add --exact @storyblok/app-extension-auth
```

Note: the `@storyblok/app-extension-auth` is currently in alpha, and is prone to changes. Therefore, save the [exact version](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#dependencies) to your `package.json` with the commands above. 

### Set a URL

Decide a URL for your app. As a first step, this should be a URL for local development. For this you will need a secure tunnel, for example [ngrok](https://ngrok.com/).

To open a secure tunnel with ngrok, run:

```shell
ngrok http 3000
```

### Set up an App in Storyblok's Partner Portal

Create an App in Storyblok's Partner Portal. Then open app's settings, navigate to _Oauth 2_, and configure the following values:

* **URL to your app**: the index page of your app. For example, `https://my-app.com/`.

* **OAuth2 callback URL**: the api endpoint that will initiate the OAuth flow.
  * Calculated as: `{baseUrl}/{endpointPrefix}/storyblok/callback`
  * Example value: `https://my-app.com/api/connect/storyblok/callback`

Substitute `{baseUrl}` and `{endpointPrefix}` for your own values. These parameters will be referenced again in your code; see the next section.

### Define constants

In your source code, create the following object (you will need it later):

```typescript
import { AuthHandlerParams } from '@storyblok/app-extension-auth'

export const params: AuthHandlerParams = {
  clientId: process.env.APP_CLIENT_ID,      
  clientSecret: process.env.APP_CLIENT_SECRET,
  baseUrl: process.env.APP_URL,  
  successCallback: '/',
  errorCallback: '/401',
  endpointPrefix: '/api/connect',  
}
```

Some variables should be loaded via environmental variables (`.env.local`):

* `clientId` -- The client ID is a public identifier for your apps. Find the Client ID in the app settings on Storyblok.
* `clientSecret` -- The client secret is a secret known only to the application and the authorization server. Find the client secret in the app settings on Storyblok.
    
    Load it into the application as an environmental variable.
    It must be kept confidential.
* `baseUrl` -- The base URL specifies the base URL to use for all relative authentication API endpoints created by authHandler().
  The base URL must be absolute and secure with https.
  
  For example, the base URL `https://my-app.my-domain.com/` will create the following api endpoints:
  - `https://my-app.my-domain.com/storyblok` for initiating the authentication flow
  - `https://my-app.my-domain.com/storyblok/callback` as the OAuth2 callback URL

The other variables can be hard-coded:

* `successCallback` -- Specifies the URL that the user agent will be redirected to after a _successful_ authentication flow. Defaults to `"/"`.
* `errorCallback` -- Specifies the URL that the user agent will be redirected to after an _unsuccessful_ authentication flow. If omitted, the user agent will receive a 401 response without redirect.
* `endpointPrefix` -- Specifies the partial URL that is located between the baseUrl and the
  authentication API endpoints.

    For example, the following two properties
    - `baseUrl: "https://app.com"`
    - `endpointPrefix: "api/authenticate"`

    will result in the API endpoints
    - `https://my-app.my-domain.com/api/authenticate/storyblok` for initiating the authentication flow
    - `https://my-app.my-domain.com/api/authenticate/storyblok/callback` as the OAuth2 callback URL

### Create an API route

In NodeJS, create a dynamic route that handles the incoming requests with `authHandler()`. See [Framework examples](#Routing for various frameworks).

For example, in Next.js, create a file `pages/api/connect/[...slugs].ts`:

```typescript
import { authHandler } from '@storyblok/app-extension-auth'

export default authHandler(params)
```

### Sign in

Sign in a user by redirecting to the api route: `/api/connect/storyblok`

This will initiate the oauth flow and redirect the user to the url specified in the `successCallback` URL. The following query parameters will be appended to the `successCallback` URL:

* `userId`
* `spaceId`

### Retrieve the session

Now, use these two query parameters to retrieve the session object:

```typescript
import { sessionCookieStore } from '@storyblok/app-extension-auth'

const sessionStore = sessionCookieStore(params)(context)
const appSession = await sessionStore.get(query)

if(appSession === undefined){
    // The user is not authenticated
    //  redirect to /api/connect/storyblok
}
```

### Use the session

The `AppSession` object contain user information for personalized content, and an access token to the Storyblok management API.   

```typescript
const {
  userId, userName,
  spaceId, spaceName,
  roles,
  accessToken
} = appSession
```

### Routing

Storyblok apps are embedded within Storyblok via iframes. When a page is requested, the server must get to know

a) `spaceId`: the space the page is being embedded within
b) `userId`: the user who loaded the page

These two values needs to be encoded within the page request.

If these two values cannot be retrieved, you need to initiate the OAuth flow by redirecting the user agent to `/api/connect/storyblok`. After a successful authentication, the `spaceId` and `userId` will be added as query parameters to the `successCallback` value. Now, it should be possible to retrieve the session like so

```typescript
import { sessionCookieStore } from '@storyblok/app-extension-auth'

const sessionStore = sessionCookieStore(params)(context)
const appSession = await sessionStore.get(query)
```

When you redirect the user agent to a new page within your application, you need to _append the `spaceId` and `userId` query parameters_. Only if you do this can you retrieve the session from the `sessionCookieStore` from the other route.

```typescript
const href =  `/my/other/page?spaceId=${spaceId}&userId=${userId}`
```

## Routing for various frameworks

### Next.js

In Next.js, create a file `pages/api/connect/[...slugs].ts`

```typescript
import { authHandler } from '@storyblok/app-extension-auth'

export default authHandler(params)
```

### Express

In ExpressJs, create a route 

```typescript
import { authHandler } from '@storyblok/app-extension-auth'

app.all(
    '/api/connect/*', 
    authHandler(params)
)
```

## Useful Resources

* [Authentication Oauth2 flow](https://www.storyblok.com/docs/plugins/authentication-apps)
* [Custom Applications](https://www.storyblok.com/docs/plugins/custom-application)
