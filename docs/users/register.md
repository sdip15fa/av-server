# Register

POST `/api/users/register`

## Request

```typescript
{
    userName: string; // length 1-20
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

## Reminder

The first person to register automatically becomes an admin. (`{ role: "admin" }`).

Otherwise, they would all be normal users. (`{ role: "user" }`).
