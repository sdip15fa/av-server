# Create video

POST `/api/videos/create`

## Note

Any user can do this. (must be logged in)

## Request

```typescript
{
    categoryId: number, // integer, must be an existing category id
    videoDisplayName: string, // video name
    videoTag: string[],
    videoDuration: number, // integer, in seconds
    videoUrl: string, // url to video
    videoPreviewImage?: string, // url to image
}
```

## Response

```typescript
{
    video: {
        category: {
            categoryId: number, // integer
            categoryName: string, // category name
            categoryImageUrl?: string, // url to image
        },
        videoId: string, // video id, in format yymmdd00x
        videoDisplayName: string, // video display name
        videoDuration: number, // integer, in seconds
        videoTag: string[], // video tags
        videoUrl: string, // url to video
        viewCount: number, // number of views
        uploadTime: string, // date string
        uploadUser: { userName: string, userId: string, role: "user" | "admin" }, // user info
        videoPreviewImage?: string, // url to preview image
    }
}
```
