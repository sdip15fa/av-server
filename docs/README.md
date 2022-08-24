# Api docs

For requests and responses, see the other .md files in this directory.

Note the followings that would not be mentioned in the docs.

## Auth

Please set the authorization header in every request (if the user is logged in). Otherwise user-only (or admin-only) actions cannot be performed.

```text
Bearer <token>
```

Where token is the jwt token returned by the server at register or log in.

## Success

The responses must contain:

```typescript
{ success: boolean }
```

### True

`{ success: true }` means the request is successful.

### False

`{ success: false }` means the request is not successful.

The http response code would be an error code.

Instead of the standard response as stated in the docs,
the response would be:

```typescript
{ success: false, error: string }
```
