# ER Diagram - Language Exchange Mobile Application

## Overview

This document describes the logical database design for the Language Exchange mobile application.

The application allows users to:

- Create a profile
- Practice languages with native speakers
- Send and accept friend requests
- Chat only with friends
- Create posts
- Like and comment on posts
- Receive notifications

> **Note:** AI translation (camera translation and voice translation) is performed locally on the mobile device and is **not** part of the backend database.

---

# Main Entities

- User
- Language
- Post
- Like
- Comment
- FriendRequest
- Friendship
- Chat
- ChatParticipant
- Message
- Notification

---

# Entity Relationships

## User

A user:

- Creates many posts
- Likes many posts
- Writes many comments
- Sends many friend requests
- Receives many friend requests
- Has many friendships
- Participates in chats
- Sends many messages
- Receives many notifications
- Speaks one native language
- Learns one language

---

## Language

A language:

- Can be the native language of many users.
- Can be the learning language of many users.

---

## Post

A post:

- Belongs to one user.
- Can receive many likes.
- Can receive many comments.

---

## Like

A like:

- Belongs to one user.
- Belongs to one post.

This entity resolves the many-to-many relationship between Users and Posts.

---

## Comment

A comment:

- Belongs to one user.
- Belongs to one post.

---

## FriendRequest

A friend request:

- Has one sender.
- Has one receiver.
- Contains a status:
  - Pending
  - Accepted
  - Rejected
  - Cancelled

---

## Friendship

A friendship:

- Connects two users.
- Represents an accepted friend request.

Only friends are allowed to chat.

---

## Chat

A chat:

- Represents a conversation.
- Has multiple participants.
- Contains many messages.

---

## ChatParticipant

A chat participant:

- Connects a user to a chat.

This design allows future support for group chats.

---

## Message

A message:

- Belongs to one chat.
- Has one sender.

---

## Notification

A notification:

- Belongs to one user.

Possible notification types include:

- Friend Request
- Friend Request Accepted
- New Message
- Post Like
- Post Comment

---

# Logical Entities

## User

- userId (PK)
- username
- email
- password
- bio
- profilePicture
- nativeLanguageId (FK)
- learningLanguageId (FK)
- createdAt
- updatedAt

---

## Language

- languageId (PK)
- name
- code

---

## Post

- postId (PK)
- userId (FK)
- content
- imageUrl
- createdAt
- updatedAt

---

## Like

- likeId (PK)
- userId (FK)
- postId (FK)
- createdAt

---

## Comment

- commentId (PK)
- userId (FK)
- postId (FK)
- content
- createdAt
- updatedAt

---

## FriendRequest

- requestId (PK)
- senderId (FK)
- receiverId (FK)
- status
- createdAt

---

## Friendship

- friendshipId (PK)
- user1Id (FK)
- user2Id (FK)
- createdAt

---

## Chat

- chatId (PK)
- createdAt

---

## ChatParticipant

- chatId (FK)
- userId (FK)

---

## Message

- messageId (PK)
- chatId (FK)
- senderId (FK)
- content
- isRead
- createdAt

---

## Notification

- notificationId (PK)
- userId (FK)
- type
- content
- isRead
- createdAt

---

# Design Notes

- Each user has exactly one native language.
- Each user learns exactly one language.
- Only friends can exchange messages.
- AI translation is performed locally on the mobile application and is not stored or processed by the backend.
- The chat system uses a `ChatParticipant` entity to support future group chats without redesigning the database.