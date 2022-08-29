<div style="text-align:center">
	<h1 style="text-align:center">@storyblok/app-extension-auth</h1>
  <p style="text-align:center">
    A typed JavaScript library that manages authentication for <a href="https://www.storyblok.com" target="_blank">Storyblok</a> apps.
  </p>
  <br />
</div>

## Usage


### Set up App in Storyblok

Under the app settings > _Oauth 2_, handle configure the following:

**URL to your app**: 
https://_[your-domain]_/

**OAuth2 callback URL**
https://_[your-domain]_/api/connect/storyblok/callback

(Substitute _[your-domain]_ to your app's domain.)

### Generate a JWT secret key

On Linux/Mac, run:

```shell
openssl rand -base64 64
```

### Define constants

In your source code, create an options object:

```typescript
import { AuthHandlerParams,} from '@storyblok/app-extension-auth'

export const params: AuthHandlerParams = {
    // Provide values for all keys
}
```

### Create an API route

In NodeJS, create a dynamic route that handles the incoming requests with `authHandler()`. See [Framework examples](#framework-examples).

For example, in Next.js, create a file `pages/api/connect/[...slugs].ts`:

```typescript
import { authHandler } from '@storyblok/app-extension-auth'

export default authHandler(params)
```

### Sign in

Sign in a user by redirecting to the api route: `/api/connect/storyblok`

This will initiate the oauth flow and redirect the user to the url specified in the `successCallback` url. The following query parameters will be appended:

* `userId`
* `spaceId`

### Retrieve the session

Now use these query parameters to retrieve the session object:

```typescript
import { sessionCookieStore } from '@storyblok/app-extension-auth'

const sessionStore = sessionCookieStore(params)(context)
const appSession = await sessionStore.get(query)

if(appSession === undefined){
    // The user is not authenticated
    //  redirect to /api/connect/storyblok
}
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
