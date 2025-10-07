# API Documentation

Complete reference for all API endpoints in the EJ Development CMS.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API does not require authentication for read operations. In production, you should implement API authentication.

---

## Blog Posts API

### List All Blog Posts

Retrieve all blog posts from the database.

**Endpoint:** `GET /api/blog-posts`

**Response:**
```json
[
  {
    "id": "1704067200000",
    "category": "DESIGN",
    "title": "Marbella's Design Renaissance",
    "excerpt": "A new wave of architects...",
    "content": "Full content here...",
    "image": "https://images.unsplash.com/...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "published": true
  }
]
```

### Get Single Blog Post

Retrieve a specific blog post by ID.

**Endpoint:** `GET /api/blog-posts/[id]`

**Parameters:**
- `id` (path parameter): Blog post ID

**Response:**
```json
{
  "id": "1704067200000",
  "category": "DESIGN",
  "title": "Marbella's Design Renaissance",
  "excerpt": "A new wave of architects...",
  "content": "Full content here...",
  "image": "https://images.unsplash.com/...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "published": true
}
```

**Error Response (404):**
```json
{
  "error": "Blog post not found"
}
```

### Create Blog Post

Create a new blog post.

**Endpoint:** `POST /api/blog-posts`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "category": "DESIGN",
  "title": "New Blog Post",
  "excerpt": "Brief description of the post",
  "content": "Full content (optional)",
  "image": "https://example.com/image.jpg",
  "published": true
}
```

**Response (201):**
```json
{
  "id": "1704067200000",
  "category": "DESIGN",
  "title": "New Blog Post",
  "excerpt": "Brief description of the post",
  "content": "Full content (optional)",
  "image": "https://example.com/image.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "published": true
}
```

### Update Blog Post

Update an existing blog post.

**Endpoint:** `PUT /api/blog-posts/[id]`

**Parameters:**
- `id` (path parameter): Blog post ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "published": false
}
```

**Response:**
```json
{
  "id": "1704067200000",
  "title": "Updated Title",
  "updatedAt": "2024-01-02T00:00:00.000Z",
  ...
}
```

### Delete Blog Post

Delete a blog post permanently.

**Endpoint:** `DELETE /api/blog-posts/[id]`

**Parameters:**
- `id` (path parameter): Blog post ID

**Response:**
```json
{
  "success": true
}
```

**Error Response (404):**
```json
{
  "error": "Blog post not found"
}
```

---

## Properties API

### List All Properties

**Endpoint:** `GET /api/properties`

**Response:**
```json
[
  {
    "id": "1704067200000",
    "size": "246 m²",
    "rooms": "5 rum",
    "image": "https://example.com/property.jpg",
    "location": "Marbella",
    "price": "€2,500,000",
    "description": "Luxury villa with sea views...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "published": true
  }
]
```

### Get Single Property

**Endpoint:** `GET /api/properties/[id]`

**Response:**
```json
{
  "id": "1704067200000",
  "size": "246 m²",
  "rooms": "5 rum",
  "image": "https://example.com/property.jpg",
  "location": "Marbella",
  "price": "€2,500,000",
  "description": "Luxury villa with sea views...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "published": true
}
```

### Create Property

**Endpoint:** `POST /api/properties`

**Request Body:**
```json
{
  "size": "246 m²",
  "rooms": "5 rum",
  "image": "https://example.com/property.jpg",
  "location": "Marbella",
  "price": "€2,500,000",
  "description": "Luxury villa with sea views...",
  "published": true
}
```

**Required Fields:**
- `size`
- `rooms`
- `image`

**Optional Fields:**
- `location`
- `price`
- `description`
- `published` (defaults to true)

**Response (201):**
```json
{
  "id": "1704067200000",
  "size": "246 m²",
  ...
  "createdAt": "2024-01-01T00:00:00.000Z",
  "published": true
}
```

### Update Property

**Endpoint:** `PUT /api/properties/[id]`

**Request Body:** (all fields optional)
```json
{
  "price": "€2,800,000",
  "published": false
}
```

### Delete Property

**Endpoint:** `DELETE /api/properties/[id]`

**Response:**
```json
{
  "success": true
}
```

---

## Instagram Posts API

### List All Instagram Posts

**Endpoint:** `GET /api/instagram`

**Response:**
```json
[
  {
    "id": "1704067200000",
    "caption": "Beautiful sunset over Costa del Sol",
    "image": "https://example.com/instagram-post.jpg",
    "url": "https://instagram.com/p/abc123",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Instagram Post

**Endpoint:** `POST /api/instagram`

**Request Body:**
```json
{
  "caption": "Beautiful sunset over Costa del Sol",
  "image": "https://example.com/instagram-post.jpg",
  "url": "https://instagram.com/p/abc123"
}
```

**All fields are required.**

**Response (201):**
```json
{
  "id": "1704067200000",
  "caption": "Beautiful sunset over Costa del Sol",
  "image": "https://example.com/instagram-post.jpg",
  "url": "https://instagram.com/p/abc123",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Delete Instagram Post

**Endpoint:** `DELETE /api/instagram/[id]`

**Response:**
```json
{
  "success": true
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request body"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to process request"
}
```

---

## Rate Limiting

⚠️ **Production Recommendation**: Implement rate limiting to prevent abuse.

Suggested limits:
- Read operations: 100 requests/minute
- Write operations: 20 requests/minute

---

## CORS

By default, Next.js API routes allow same-origin requests only. To enable CORS for external applications:

```typescript
// In your API route
export async function GET(request: NextRequest) {
  const response = NextResponse.json(data);
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

---

## Testing Examples

### Using cURL

```bash
# Get all blog posts
curl http://localhost:3000/api/blog-posts

# Create a blog post
curl -X POST http://localhost:3000/api/blog-posts \
  -H "Content-Type: application/json" \
  -d '{
    "category": "DESIGN",
    "title": "Test Post",
    "excerpt": "Test excerpt",
    "image": "https://example.com/image.jpg",
    "published": true
  }'

# Update a blog post
curl -X PUT http://localhost:3000/api/blog-posts/123456 \
  -H "Content-Type: application/json" \
  -d '{"published": false}'

# Delete a blog post
curl -X DELETE http://localhost:3000/api/blog-posts/123456
```

### Using JavaScript (fetch)

```javascript
// Get all properties
const properties = await fetch('/api/properties').then(r => r.json());

// Create a property
const newProperty = await fetch('/api/properties', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    size: '200 m²',
    rooms: '4 rum',
    image: 'https://example.com/image.jpg',
    published: true
  })
}).then(r => r.json());

// Delete an Instagram post
await fetch('/api/instagram/123456', { method: 'DELETE' });
```

---

## Next Steps

For production use:
1. Add authentication middleware
2. Implement input validation (e.g., Zod)
3. Add rate limiting
4. Enable CORS if needed
5. Add logging and monitoring
6. Migrate to a proper database

