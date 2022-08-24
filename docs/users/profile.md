# User Profile

GET `/api/users/profile/:userId`

## Request

| Param    | Type              | Description |
| -------- | ----------------- | ----------- |
| `userId` | string: `000000x` | user id     |

## Response

```typescript
{
    user: {
        userId: string; // user id, in format 000000x
        userName: string; // user name
        role: "user" | "admin"; // user role
    }
}
```
