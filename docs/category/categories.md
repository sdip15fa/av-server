# Categories

GET `/api/category`

## Response

```typescript
{
    categories: {
        categoryId: number; // the category id
        categoryName: string; // the category name
        videoCount: number; // number of videos in this category
        categoryImageUrl?: string; // the category image url
    }[]
}
```
