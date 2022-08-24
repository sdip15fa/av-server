# Tag Info

GET `/api/tags/:tagName`

## Note

404 if tag not found.

## Request

| Param     | Type   | Description |
| --------- | ------ | ----------- |
| `tagName` | string | tag name    |

## Response

```typescript
{
    tag: {
        tagName: string; // tag name
        videoCount: number; // number of videos in this tag
        lastModified: string; // last modified time, date string
    }
}
```
