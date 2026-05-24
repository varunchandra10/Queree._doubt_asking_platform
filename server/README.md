# Server README

Express and MongoDB backend for the Queree platform.

Root guide: [../README.md](../README.md)

## What This Workspace Contains

The `server/` app handles:

- JWT-based signup and login
- OTP email delivery and verification
- Questions and answers
- User profiles, friend/unfriend actions, and profile image upload
- Community posts, comments, likes, and media upload
- Razorpay subscription ordering and verification
- QuereeGPT proxying through Gemini
- API smoke testing with a local script

## Stack

| Area | Tools |
| :--- | :--- |
| Runtime | Node.js |
| Server | Express |
| Database | MongoDB, Mongoose |
| Auth | JSON Web Tokens, bcryptjs |
| Uploads | multer, Cloudinary |
| Email | Nodemailer |
| Payments | Razorpay |
| AI integration | `@google/genai` |

## Key Structure

```text
server/
|-- controllers/
|-- middleware/
|-- models/
|-- routes/
|-- scripts/
|-- index.js
|-- package.json
`-- procfile
```

## Important Files

- `index.js` loads env vars, mounts all route groups, and starts the server with port fallback if the preferred port is busy.
- `middleware/auth.js` validates bearer tokens and sets `req.userId`.
- `controllers/auth.js` contains signup, login, OTP send, and OTP verify logic.
- `controllers/GeminiChat.js` proxies chat requests to Gemini and supports mock replies.
- `controllers/Post.js` and `controllers/users.js` stream uploads to Cloudinary.
- `scripts/test-all-apis.js` is a smoke-test runner for the API surface.

## Scripts

```bash
npm install
npm run start
npm run test:apis
```

`npm run start` uses `nodemon index.js`.

## API Routes

| Module | Method | Endpoint | Purpose |
| :--- | :--- | :--- | :--- |
| Base | `GET` | `/` | Returns a simple API status string |
| Users | `POST` | `/user/signup` | Create a user account |
| Users | `POST` | `/user/login` | Authenticate a user and return a token |
| Users | `POST` | `/user/send-otp` | Send an email OTP |
| Users | `POST` | `/user/verify-otp` | Verify an email OTP |
| Users | `GET` | `/user/getAllUsers` | Fetch all users |
| Users | `PATCH` | `/user/update/:id` | Update a user profile |
| Users | `POST` | `/user/upload-profile` | Upload a profile image |
| Users | `GET` | `/user/upload-test` | Simple route check for upload router mounting |
| Users | `PATCH` | `/user/friend` | Add or follow a friend |
| Users | `PATCH` | `/user/unfriend` | Remove or unfollow a friend |
| Questions | `POST` | `/questions/Ask` | Create a question |
| Questions | `GET` | `/questions/get` | Fetch all questions |
| Questions | `DELETE` | `/questions/delete/:id` | Delete a question |
| Questions | `PATCH` | `/questions/vote/:id` | Vote on a question |
| Answers | `PATCH` | `/answer/post/:id` | Post an answer to a question |
| Answers | `PATCH` | `/answer/delete/:id` | Delete an answer from a question |
| Posts | `GET` | `/post/get` | Fetch all posts |
| Posts | `GET` | `/post/user-posts/:id` | Fetch posts for one user |
| Posts | `POST` | `/post/add` | Create a post |
| Posts | `POST` | `/post/upload-media` | Upload post media |
| Posts | `PATCH` | `/post/like/:id` | Like a post |
| Posts | `PATCH` | `/post/dislike/:id` | Remove a like from a post |
| Posts | `PATCH` | `/post/add-comment/:id` | Add a comment to a post |
| Posts | `DELETE` | `/post/delete-comment/:id` | Delete a comment from a post |
| Subscriptions | `GET` | `/subscription/check-subscription/:userId` | Check the current subscription state |
| Subscriptions | `POST` | `/subscription/order` | Create a Razorpay order |
| Subscriptions | `POST` | `/subscription/is-order-complete` | Verify payment completion |
| Chat | `POST` | `/chat/add` | Send a prompt through the Gemini chat proxy |

## Environment

Create `server/.env` with the values your setup needs:

```env
PORT=5000
CONNECTION_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

KEY_ID=your_razorpay_key_id
KEY_SECRET=your_razorpay_key_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_SERVICE=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_app_password
SMTP_FROM=your_sender_email

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
USE_MOCK_CHAT=false
```

Notes:

- `SMTP_SERVICE` is optional if you provide `SMTP_HOST`.
- The repo currently does not include a committed `server/.env.example`.

## API Smoke Test Script

`npm run test:apis` expects the server to already be running.

Optional env vars for the script:

```env
API_BASE_URL=http://localhost:5000
TEST_IMAGE_PATH=
TEST_VIDEO_PATH=
TEST_OTP_EMAIL=
TEST_OTP_CODE=
```

The script skips OTP, upload, Razorpay, or Gemini-related checks when those integrations are not configured.

## Current Alignment Notes

- The frontend includes a forgot-password flow and calls password-reset endpoints.
- Those forgot-password routes are not currently mounted in this server workspace, so they are not part of the live API yet.
