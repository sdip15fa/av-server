# Tags

GET `/api/tags`

## Request

| Query  | Type                    | Description                                                                                            | optional |
| ------ | ----------------------- | ------------------------------------------------------------------------------------------------------ | -------- |
| `sort` | `"latest" \| "popular"` | sort descending by last modified time (creation time of the last wideo with this tag) or number of videos. | yes      |

## Response

```typescript
{
    tags: {
        tagName: string; // tag name
        videoCount: number; // number of videos in this tag
        lastModified: string; // last modified time, date string
    }
    [];
}
```
