# Retink Use Case - A Blog API

## Description

This is a simple blog API that allows users to do CRUD operations on the blog posts. There are 4 entities: Author, Blog, User, and Comments. The API is built using Node.js, Express.js and MongoDB.

## Installation

Clone the repository and run the following command to install the dependencies:

```bash
git clone https://github.com/EnesDemirtas/Retink.git
cd Retink
```

```bash
npm install
```

## Running the app

To start the express server, run the following:

```bash
npm run devStart
```

Open http://localhost:3030 and take a look around.

## Models

### Author

```json
{
  "_id": "ObjectId",
  "full_name": "String",
  "email": "String",
  "blogs": "Array",
  "__v": "Int32"
}
```

### Blog

```json
{
  "_id": "ObjectId",
  "title": "String",
  "content": "String",
  "author": "ObjectId",
  "comments": "Array",
  "__v": "Int32"
}
```

### User

```json
{
  "_id": "ObjectId",
  "full_name": "String",
  "email": "String",
  "comments": "Array",
  "__v": "Int32"
}
```

### Comment

```json
{
  "_id": "ObjectId",
  "blog": "ObjectId",
  "comment": "String",
  "user": "ObjectId",
  "__v": "Int32"
}
```

## Endpoints

### Author

- GET /authors - Get all authors
- GET /authors/:id - Get author by id
- POST /authors - Create a new author
  Request Payload:
  ```json
  {
    "full_name": "John Doe",
    "email": "johndoe@email.com"
  }
  ```
- PATCH /authors/:id - Update author by id
  Request Payload:
  Both fields are optional.
  ```json
  {
    "full_name": "John Doe",
    "email": "johndoe@email.com"
  }
  ```
- DELETE /authors/:id - Delete author by id

### Blog

- GET /blogs - Get all blogs
- GET /blogs/:id - Get blog by id
- POST /blogs - Create a new blog
  Request Payload:
  ```json
  {
    "title": "My First Blog",
    "content": "This is my first blog.",
    "author": "652166667828332c4baf5d6a"
  }
  ```
- PATCH /blogs/:id - Update blog by id
  Request Payload:
  All fields are optional.
  ```json
  {
    "title": "My First Updated Blog",
    "content": "This is my first updated blog."
  }
  ```
- DELETE /blogs/:id - Delete blog by id

### User

- GET /users - Get all users
- GET /users/:id - Get user by id
- POST /users - Create a new user
  Request Payload:
  ```json
  {
    "full_name": "John Doe",
    "email": "johndoe@email.com"
  }
  ```
- PATCH /users/:id - Update user by id
  Request Payload:
  Both fields are optional.
  ```json
  {
    "full_name": "John Doe",
    "email": "johndoe@email.com"
  }
  ```
- DELETE /users/:id - Delete user by id

### Comment

- GET /comments - Get all comments
- GET /comments/:id - Get comment by id
- POST /comments - Create a new comment
  Request Payload:
  ```json
  {
    "blog": "652166d37828332c4baf5d70",
    "comment": "This is my first comment.",
    "user": "652166667828332c4baf5d6a"
  }
  ```
- PATCH /comments/:id - Update comment by id
  Request Payload:
  Comment field is optional.
  ```json
  {
    "comment": "This is my first updated comment."
  }
  ```
- DELETE /comments/:id - Delete comment by id

## Further Development

- Add like and dislike functionality to the blogs.
- Add like and dislike functionality to the comments.
- Add view count to the blogs.
- Make the blogs be able to co-authored by multiple authors.
