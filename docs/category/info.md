# Category Info

GET `/api/category/:id`

## Params

| Param | Type            |
| ----- | --------------- |
| id    | integer (min 0) |

## Note

If category is not found, returns error code 404.

## Response

```typescript
{
    category: {
        categoryId: number; // the category id
        categoryName: string; // the category name
        videoCount: number; // number of videos in this category
        categoryImageUrl?: string; // the category image url
    }
}
```
