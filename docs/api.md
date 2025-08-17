# API Specification

Following the backend meeting, the team agreed to use a REST-based API for front-end communication.

## Base URL

`https://api.example.com`

## Authorization

Requests requiring authentication must include the header:

```
Authorization: Bearer <token>
```

Tokens are obtained via the `POST /auth/vk` endpoint using a VK access token.

## Error Format

Errors follow JSON structure with standard HTTP status codes:

```
{
  "error": {
    "code": "<string>",
    "message": "<human readable message>"
  }
}
```

## Endpoints

### `POST /auth/vk`
- **Description:** Exchange a VK `access_token` for an API JWT.
- **Body:** `{ "access_token": "string" }`
- **Response:** `{ "token": "string" }`

### `GET /members`
- **Description:** Retrieve list of club members.
- **Auth:** Required.
- **Response:** `[{ "id": number, "name": "string" }]`

### `POST /members`
- **Description:** Create a new member entry.
- **Auth:** Required.
- **Body:** `{ "name": "string" }`
- **Response:** `{ "id": number, "name": "string" }`

### `GET /events`
- **Description:** List upcoming events.
- **Auth:** Optional.
- **Response:** `[{ "id": number, "title": "string", "date": "ISO8601 string" }]`

### `POST /events`
- **Description:** Create a new event.
- **Auth:** Required.
- **Body:** `{ "title": "string", "date": "ISO8601 string" }`
- **Response:** `{ "id": number, "title": "string", "date": "ISO8601 string" }`

## Notes
- Additional endpoints will follow the same REST conventions.
- Contact the backend team for questions or to propose changes.
