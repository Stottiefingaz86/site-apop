# Contract: APOP Tracking Events API

## Endpoint

- **Method**: `POST`
- **Path**: `/api/tracking/events`
- **Content-Type**: `application/json`

## Request Body

```json
{
  "events": [
    {
      "featureId": "cmo0gy5qw0015dd0etheq96fg",
      "eventType": "impression",
      "route": "/sports",
      "elementId": "main-nav-wallet"
    }
  ]
}
```

### Field Requirements

- `events`: required array with at least one item
- `featureId`: required non-empty string
- `eventType`: required enum `"impression" | "click"`
- `route`: optional string (pathname)
- `elementId`: optional string (client element identifier)

## Responses

### 200 OK

```json
{
  "ok": true,
  "received": 1
}
```

### 400 Bad Request

```json
{
  "error": "Invalid payload"
}
```

or

```json
{
  "error": "No valid events"
}
```

### 500 Internal Server Error

```json
{
  "error": "Supabase insert failure message"
}
```

