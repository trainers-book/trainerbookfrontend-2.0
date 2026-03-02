# Mock ExpressJS Server

Lightweight mock server for frontend development.

Run:

```bash
cd backend/mock-server
npm install
npm start
```

Default port: `4000` (use `PORT` env to override).

Endpoints:

- `GET /Authentication/:username/:password` — returns `{ ok, user, token }` if credentials match.
- `PUT /setPassword` — body: `{ userInfo: [{ userName, password }] }` updates/creates users.
- `POST /:collection` — create entity in collection, body is the entity.
- `GET /getUser/:personalNumber` — find user by `personalNumber`.
- `PUT /:collectionName` — update or create object in collection. If client sends a header `fieldstoremove` (JSON array or comma-separated string), those fields will be removed from the response.
- `GET /:collection` — list all entities in a collection.

Data file: `data.json` in the same folder contains sample `users` and `items`.
