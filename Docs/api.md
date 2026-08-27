# API Documentation


# Authentication

All protected endpoints require a JWT access token.

Example:

```
Authorization: Bearer <access_token>
```

---

# Authentication

**Base URL**

```
/api/v1/auth
```

---

## 1. Register

**POST**

```
/register
```

**Access:** Public

### Description

Creates a new user account.

### Request Body

```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "StrongPassword123",
    "nativeLanguageId": 1,
    "learningLanguageId": 2
}
```

### Success Response (201 Created)

```json
{
    "message": "User registered successfully."
}
```

### Possible Errors

**400 Bad Request**

```json
{
    "message": "Validation failed."
}
```

**409 Conflict**

```json
{
    "message": "Email already exists."
}
```

---

## 2. Login

**POST**

```
/login
```

**Access:** Public

### Description

Authenticates a user and returns an access token and refresh token.

### Request Body

```json
{
    "email": "john@example.com",
    "password": "StrongPassword123"
}
```

### Success Response (200 OK)

```json
{
    "message": "Login successful.",
    "accessToken": "<JWT_ACCESS_TOKEN>",
    "refreshToken": "<JWT_REFRESH_TOKEN>",
    "user": {
        "userId": 1,
        "username": "john_doe",
        "email": "john@example.com"
    }
}
```

### Possible Errors

**401 Unauthorized**

```json
{
    "message": "Invalid email or password."
}
```

---

## 3. Get Current User

**GET**

```
/me
```

**Access:** Private

### Description

Returns the authenticated user's profile.

Requires a valid access token.

### Request Headers

```
Authorization: Bearer <access_token>
```

### Success Response (200 OK)

```json
{
    "userId": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "bio": "Learning English.",
    "profilePicture": "https://example.com/profile.jpg",
    "nativeLanguage": "Arabic",
    "learningLanguage": "English"
}
```

### Possible Errors

**401 Unauthorized**

```json
{
    "message": "Access token is missing or invalid."
}
```

---

## 4. Refresh Access Token

**POST**

```
/refresh-token
```

**Access:** Requires Refresh Token

### Description

Generates a new access token using a valid refresh token.

### Request

If using HTTP-only cookies (recommended), no request body is required.

If using the request body:

```json
{
    "refreshToken": "<JWT_REFRESH_TOKEN>"
}
```

### Success Response (200 OK)

```json
{
    "accessToken": "<NEW_ACCESS_TOKEN>"
}
```

### Possible Errors

**401 Unauthorized**

```json
{
    "message": "Refresh token is invalid or expired."
}
```

---

## 5. Logout

**POST**

```
/logout
```

**Access:** Private

### Description

Logs the authenticated user out by invalidating or removing the refresh token.

Requires a valid access token.

### Request Headers

```
Authorization: Bearer <access_token>
```

### Success Response (200 OK)

```json
{
    "message": "Logged out successfully."
}
```

### Possible Errors

**401 Unauthorized**

```json
{
    "message": "Access token is missing or invalid."
}
```

# Users

**Base URL**

```
/api/v1/users
```

---

## 1. Get All Users

**GET**

```
/
```

**Access:** Private

### Description

Returns a paginated list of users.

### Query Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| page | No | Page number (default: 1) |
| limit | No | Number of users per page (default: 20) |
| username | No | Search users by username |
| nativeLanguage | No | Filter users by native language |
| learningLanguage | No | Filter users by learning language |

### Example

```
GET /api/v1/users?page=1&limit=20
```

```
GET /api/v1/users?username=john
```

```
GET /api/v1/users?nativeLanguage=Arabic
```

```
GET /api/v1/users?learningLanguage=English
```

```
GET /api/v1/users?username=john&learningLanguage=English
```

### Success Response (200 OK)

```json
{
    "users": [],
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "totalUsers": 95
}
```

---

## 2. Get User By ID

**GET**

```
/:userId
```

**Access:** Private

### Description

Returns the profile of a specific user.

### Success Response (200 OK)

```json
{
    "userId": 15,
    "username": "john_doe",
    "email": "john@example.com",
    "bio": "Learning English.",
    "profilePicture": "https://example.com/profile.jpg",
    "nativeLanguage": "Arabic",
    "learningLanguage": "English"
}
```

### Possible Errors

**404 Not Found**

```json
{
    "message": "User not found."
}
```

---

## 3. Replace Current User Profile

**PUT**

```
/me
```

**Access:** Private

### Description

Replaces the authenticated user's profile.

### Request Body

```json
{
    "username": "john_doe",
    "bio": "I enjoy practicing languages.",
    "nativeLanguageId": 1,
    "learningLanguageId": 2
}
```

### Success Response (200 OK)

```json
{
    "message": "Profile updated successfully."
}
```

### Possible Errors

**401 Unauthorized**

```json
{
    "message": "Unauthorized."
}
```

---

## 4. Update Current User Profile

**PATCH**

```
/me
```

**Access:** Private

### Description

Updates one or more fields of the authenticated user's profile.

### Request Body

```json
{
    "bio": "I enjoy practicing languages."
}
```

### Success Response (200 OK)

```json
{
    "message": "Profile updated successfully."
}
```

---

## 5. Delete Current User

**DELETE**

```
/me
```

**Access:** Private

### Description

Deletes the authenticated user's account.

### Success Response (200 OK)

```json
{
    "message": "Account deleted successfully."
}
```

---

# Administrator Endpoints

> These endpoints require an authenticated user with the **Administrator** role.

---

## 6. Replace User Profile (Admin)

**PUT**

```
/:userId
```

**Access:** Administrator

### Description

Replaces the profile of any user.

### Success Response (200 OK)

```json
{
    "message": "User updated successfully."
}
```

### Possible Errors

**403 Forbidden**

```json
{
    "message": "Administrator privileges required."
}
```

---

## 7. Update User Profile (Admin)

**PATCH**

```
/:userId
```

**Access:** Administrator

### Description

Updates one or more fields of any user's profile.

### Example Request

```json
{
    "bio": "Updated by administrator."
}
```

### Success Response (200 OK)

```json
{
    "message": "User updated successfully."
}
```

---

## 8. Delete User (Admin)

**DELETE**

```
/:userId
```

**Access:** Administrator

### Description

Deletes any user account.

### Success Response (200 OK)

```json
{
    "message": "User deleted successfully."
}
```

### Possible Errors

**403 Forbidden**

```json
{
    "message": "Administrator privileges required."
}
```

**404 Not Found**

```json
{
    "message": "User not found."
}
```

# Languages

## Get All Languages

**GET**

```
/languages
```

---

## Get Language By ID

**GET**

```
/languages/:id
```

---
# Posts

**Base URL**

```
/api/v1/posts
```

---

## Public / Authenticated Endpoints

### 1. Get All Posts

**GET**

```
/
```

Returns a paginated list of posts.

---

### 2. Get Post By ID

**GET**

```
/:postId
```

Returns a specific post.

---

### 3. Create Post

**POST**

```
/
```

Creates a new post for the authenticated user.

---

## Current User Endpoints

### 4. Replace Current User's Post

**PUT**

```
/api/v1/users/me/posts/:postId
```

Replaces an entire post owned by the authenticated user.

---

### 5. Update Current User's Post

**PATCH**

```
/api/v1/users/me/posts/:postId
```

Updates one or more fields of a post owned by the authenticated user.

---

### 6. Delete Current User's Post

**DELETE**

```
/api/v1/users/me/posts/:postId
```

Deletes a post owned by the authenticated user.

---

## User Posts

### 7. Get Posts By User

**GET**

```
/api/v1/users/:userId/posts
```

Returns all posts created by a specific user.

---

# Administrator Endpoints

### 8. Replace User's Post

**PUT**

```
/api/v1/users/:userId/posts/:postId
```

Administrator only.

---

### 9. Update User's Post

**PATCH**

```
/api/v1/users/:userId/posts/:postId
```

Administrator only.

---

### 10. Delete User's Post

**DELETE**

```
/api/v1/users/:userId/posts/:postId
```

Administrator only.

## Get Comments

**GET**

```
/posts/:postId/comments
```

---

## Update Comment

**PUT**

```
/posts/:postId/comments/:commentId
```

---

## Delete Comment

**DELETE**

```
/posts/:postId/comments/:commentId
```

---

# Friend Requests

## Send Friend Request

**POST**

```
/friend-requests
```

### Request

```json
{
    "receiverId": 15
}
```

---

## Get Friend Requests

**GET**

```
/friend-requests
```

Returns all pending requests for the authenticated user.

---

## Accept Friend Request

**PUT**

```
/friend-requests/:requestId/accept
```

---

## Reject Friend Request

**PUT**

```
/friend-requests/:requestId/reject
```

---

## Cancel Friend Request

**DELETE**

```
/friend-requests/:requestId
```

---

# Friends

## Get Friends

**GET**

```
/friends
```

---

## Remove Friend

**DELETE**

```
/friends/:friendId
```

---

# Chats

## Get User Chats

**GET**

```
/chats
```

---

## Create Chat

**POST**

```
/chats
```

### Request

```json
{
    "friendId": 12
}
```

---

## Get Chat

**GET**

```
/chats/:chatId
```

---

# Messages

## Get Chat Messages

**GET**

```
/chats/:chatId/messages
```

---

> Sending messages is handled through **Socket.IO**, not REST.

---

# Notifications

## Get Notifications

**GET**

```
/notifications
```

---

## Mark Notification as Read

**PUT**

```
/notifications/:notificationId/read
```

---

## Mark All Notifications as Read

**PUT**

```
/notifications/read-all
```

---

# Socket.IO Events

## Client → Server

```
join-chat

leave-chat

send-message

typing-start

typing-stop

mark-message-read
```

---

## Server → Client

```
new-message

message-read

typing

stop-typing

notification

user-online

user-offline
```

---

# HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

# API Version

Current Version

```
v1
```

Base URL

```
/api/v1
```