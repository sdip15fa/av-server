# Log in

POST `/api/users/login`

## Request

```typescript
{
    email: string; // must be of email format
    password: string; // minlength 8
}
```

## Response

```typescript
{
    token: string; // jwt token
}
```

For jwt token see [JsonWebToken](../types/jwt.md).
