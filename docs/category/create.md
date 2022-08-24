# Create category

POST `/api/category/create`

## Note

This action can only be performed by admins. Otherwise an error would be returned.

## Request

```typescript
{
    categoryName: string; // length 1-15
    categoryImageUrl?: string; // must be a uri
}
```

## Response

```typescript
{
    categoryId: number; // the new category id
}
```
