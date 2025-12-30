# blog-API
In this project I'll have the opportunity of developing something similar to my previous ideas where i can share my thoughts and ideas to other people (and self managed).
### Distribution
This project will be distributed into three sites:
- Backend (API)
- home frontend
- Dashboard frontend

### Architecture
We will be using the REST architecture
```
/posts
/posts/:post_id
/users/:id
```

then we must set the routes we will be following:
```
// HOME ROUTER
/auth/login
/auth/register

// POST ROUTER
/posts
/posts/:post_id
/posts/:post_id/comments
/posts/:post_id/comments/:comment_id

// USERS ROUTER
/users/:id
/users/:id/posts

Different site:
/users/me
/users/me/posts
/users/me/comments
```

---
### Features
This project mus contain the next features:
- My blog must have posts (Author, timestamp, title , a body, and images).
- Each post must have interactions and comments (author of the comment, body of the comment, timestamp).
- Posts and comments must be able to CRUD by their authors.
- The option of having published and non published posts

### Database models

| Users                      | Posts             | Comments       |
| -------------------------- | ----------------- | -------------- |
| id (PK)                    | id (PK)           | id (PK)        |
| username                   | author_id (FK)    | post_id (FK)   |
| password                   | title             | author_id (FK) |
| role (user, author, admin) | message           | message        |
|                            | isPublished       |                |
|                            | imageURL          |                |
|                            | Interaction count |                |
### Dashboard
Features:
- A list of all my post (indicator of their published status).
- A button to change their published status.
- A New post button that displays a form to fill.
- Manage comments (Delete them).

### Technologies
Backend:
- typescript
- express
- express-validator
- bcryptjs
- dotenv
- prisma
- jsonwebtoken
- cors (built-in express)
- supabase for images

Fronted: 
- Vite
- React
- TinyMCE
