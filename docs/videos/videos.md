# Videos

GET `/api/videos`

## Request

| Query  | Type                    | Description                                                                                                                      | default | optional |
| ------ | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------- | -------- |
| cat    | integer                 | category id                                                                                                                      |         | yes      |
| tag    | string                  | tag name: filter by tag                                                                                                          |         | yes      |
| filter | `"latest" \| "popular"` | filter by latest or popular: <br /> latest returns those created in 3 days; <br /> popular return those with more than 100 views |        | yes      |
| sort   | `"latest" \| "popular"` | sort descending by creation time or views. Automatically applied when using filter. Better not use this together with filter.             |        | yes      |
| limit  | integer                 | limit the number of results                                                                                                      | 20      | yes      |
| page   | integer                 | page number, the limit param controls the size of a page                                                                         | 1       | yes      |
| userId | string                  | user id: get only videos uploaded by this user                                                                                   |        | yes      |
| q      | string (regex / text)   | search query: return only those of which the name match the regular expression (you can treat it as search query)                |       | yes      |

### Note

You can use as many queries stated above as you want.

## Response

```typescript
{
    videos: {
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
    }[],
    count: number // number of documents matching the condition
}
```
