# Modify video

PUT `/api/videos/modify`

## Note

Must be admin.

## Description

You supply the video id and any other props you want to modify.

## Request

```typescript
{
    videoId: string, // video id, in format yymmdd00x
    categoryId?: number, // category id, integer
    videoDisplayName?: string, // video name
    videoDuration?: number, // integer, in seconds. Please include this if you modify the videoUrl!
    videoUrl?: string, // url to video
    videoPreviewImage?: string, // url to image
    videoTag?: string[] // video tags
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
