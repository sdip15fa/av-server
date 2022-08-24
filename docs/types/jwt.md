# JsonWebToken

On log in or register, the server will return a jwt token.

## Decoded format

```typescript
{
    userId: string; // of format 000000x (e.g. 0000002, 0000010)
    userName: string;
    email: string;
    role: "user" | "admin";
}
```
