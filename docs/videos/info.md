# Video Info

GET `/api/videos/:videoId`

## Request

| Param     | Type                    |
| --------- | ----------------------- |
| `videoId` | integer: `yymmdd000000x` |

## Note

Each request increase the view count by 1.

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
