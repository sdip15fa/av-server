# Modify category

PUT `/api/category/modify`

## Note

This action can only be performed by admins. Otherwise an error would be returned.

## Request

```typescript
{
    categoryId: number; // the category id
    categoryName?: string; // length 1-15
    categoryImageUrl?: string; // uri
}
```

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
