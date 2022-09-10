<div style="text-align:center">
	<h1 style="text-align:center">
        <code>
            @storyblok/app-extension-auth
        </code>
    </h1>
  <p style="text-align:center">
    A typed JavaScript library for handling authentication with <a href="https://www.storyblok.com" target="_blank">Storyblok</a> apps.
  </p>
  <br />
</div>

[![Node.js Package](https://github.com/storyblok/app-extension-auth/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/storyblok/app-extension-auth/actions/workflows/npm-publish.yml)

## Usage


### Set up App in Storyblok

Under the app settings > _Oauth 2_, handle configure the following:

**URL to your app**: 
https://_[your-domain]_/

**OAuth2 callback URL**
https://_[your-domain]_/api/connect/storyblok/callback

(Substitute _[your-domain]_ to your app's domain.)

### Define constants

In your source code, create the following object (you will need it later):

```typescript
import { AuthHandlerParams,} from '@storyblok/app-extension-auth'

export const params: AuthHandlerParams = {
  jwtSecret: process.env.JWT_SECRET,       
  appClientId: process.env.APP_CLIENT_ID,      
  appClientSecret: process.env.APP_CLIENT_SECRET,
  appUrl: process.env.APP_CLIENT_SECRET,  
  successCallback: '/',
  errorCallback: '/401',
  baseUrl: '/api/connect',  
  scope: ['read_content', 'write_content'], 
}
```

Some variables should be loaded via environmental variables (`.env.local`):

* `jwtSecret` -- Random 64-bit base64-encoded string. Generate with `openssl rand -base64 64`.
* `appClientId` -- The client ID from the app's Oauth settings on Storyblok.
* `appClientSecret` -- The client secret from the app's Oauth settings on Storyblok.
* `appUrl` -- The base URL to your app. For example, `https://my.app.com`

The other variables can be hard-coded:

* `successCallback` -- After successfully completing the OAuth authentication flow, the app will redirect the user client to this address.
* `errorCallback` -- If the OAuth authentication flow for whatever reason fails the app will redirect the user client to this address.
* `baseUrl` -- Prefix for all OAuth routes. For example, with the value `/api/connect`, the OAuth flow will be initiated when the user agent is redirected to `/api/connect/storyblok`.
* `scope` -- List of the scopes that the app will request. Omit `write_content` if your app doesn't need it.

### Create an API route

In NodeJS, create a dynamic route that handles the incoming requests with `authHandler()`. See [Framework examples](#framework-examples).

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

## API Route for various frameworks

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

TODO: This has not been tested
