# Frontend Workspace README

> Root guide: [../README.md](../README.md)  
> Active client workspace: `frontend/`

## 🚀 Platform Mission & Core Capabilities
This workspace is the client-side application for the full-stack platform. It presents the public landing experience, authenticated Q&A feed, profile management screens, community posts, payment entry point, and the OTP-gated chatbot experience. State is coordinated through Redux, route-level access checks, and a single Axios API layer that talks to the Express backend.

- Responsive navigation shell with a shared navbar and sidebar rail.
- Route-based experiences for home, questions, profiles, auth, community, and chatbot.
- Redux-backed data hydration for users, questions, posts, auth, and subscription status.
- Client-side media preview and upload flows for posts and profile avatars.
- Theme switching and modal alert handling through shared UI primitives.

## 🛠️ Unified Tech Stack Matrix
| Layer | Technologies | Responsibility |
| :--- | :--- | :--- |
| Runtime | React 19, Vite | App shell, bundling, and local dev server |
| State | Redux, Redux Thunk | Global user, question, post, and auth orchestration |
| Routing | React Router DOM | Public and authenticated navigation |
| Styling | Tailwind CSS, custom theme tokens | Layout, spacing, responsive presentation, and dark mode |
| Networking | Axios, JWT header injection | Backend API calls and auth persistence |
| UI Utilities | React Hot Toast, Lucide React, React Icons, Moment, copy-to-clipboard, otp-input-react, React Phone Input 2 | Alerts, icons, timestamps, clipboard actions, and OTP input |
| Integrations | Firebase SDK, OpenAI API, Cloudinary, Razorpay | Auth/storage utilities, chatbot, uploads, and payments |

## 📂 Repository File Tree Architecture
```text
frontend/
├── package.json
├── vite.config.js
├── firebase.js
├── index.html
├── public/
└── src/
	├── App.jsx
	├── App.css
	├── Allroutes.jsx
	├── api/
	├── actions/
	├── reducers/
	├── hook/
	├── components/
	└── pages/
```

## 🧩 Core Structural Module Breakdown
- `src/App.jsx` mounts the global shell, fetches initial data, and switches sidebar behavior based on auth state.
- `src/Allroutes.jsx` maps the public pages and auth-gated routes.
- `src/api/index.js` is the single client API layer for login, signup, questions, posts, users, subscriptions, and chatbot calls.
- `src/actions/` and `src/reducers/` implement the Redux data flow.
- `src/components/Navbar.jsx` manages top-bar navigation, theme toggling, search, login, and logout.
- `src/components/Leftsidebar.jsx` and `src/components/RightSidebar/RightSidebar.jsx` provide the structural left and right rails.
- `src/components/Homemainbar/` renders the feed stream and question creation entry point.
- `src/components/Posts/` manages post composition, media preview, and post list rendering.
- `src/components/Chatbot.jsx` renders the embedded AI assistant panel and its message composer.
- `src/components/AlertBox.jsx` is the shared modal alert primitive used across the app.
- `src/pages/Homepage.jsx` switches between the guest landing view and the authenticated dashboard.
- `src/pages/Auth/`, `src/pages/Authentication/`, `src/pages/AskQuestion/`, `src/pages/Questions/`, `src/pages/UserProfile/`, `src/pages/Tags/`, and `src/pages/Users/` contain the feature pages.

## 🔐 Secured Environment Configurations Matrix

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

- `VITE_OPENAI_API_KEY` powers chatbot requests from the client.
- `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` support legacy client upload flows and any external media integrations that remain in the UI.

## 🏁 Complete Workspace Initialization Guide

1. Install dependencies.

```bash
cd frontend
npm install
```

2. Add the environment variables shown above to `frontend/.env`.

3. Start the Vite dev server.

```bash
cd frontend
npm run dev
```

4. Optionally run a production build.

```bash
cd frontend
npm run build
```

5. Use `npm run lint` to check the client codebase when needed.

```bash
cd frontend
npm run lint
```
