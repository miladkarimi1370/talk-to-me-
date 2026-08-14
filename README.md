# 💬 Talk to Me

- [Demo Project](https://talk-to-me-coral.vercel.app/profile)

A modern real-time chat application built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Redux Toolkit**.  
Users can authenticate, discover other users, start conversations, send messages, manage their profile, and receive notifications — all within a responsive, dark-mode-ready interface.

---

## 🚀 Features

- 🔐 Secure authentication with **NextAuth.js** (Credentials Provider)
- 📝 Form validation powered by **Zod** + **React Hook Form**
- 🔍 Search and discover users in real-time
- 💬 Create one-on-one conversations instantly
- 📨 Send and receive messages with optimistic UI updates
- 🔔 Notification system with unread badges
- 👤 User profile page with editable information
- 🌙 Dark / Light mode toggle with system preference detection
- 📱 Fully responsive design with mobile drawer navigation
- 🧠 Global state management using **Redux Toolkit** & Entity Adapters
- 🗄️ **Supabase** PostgreSQL database with Row Level Security ready
- 🎨 Modern UI with gradient accents and smooth animations
- ⚡ Server-side API routes for secure data handling

---

## 🛠️ Built With

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Redux Toolkit** (RTK + Entity Adapters)
- **Supabase** (PostgreSQL)
- **NextAuth.js**
- **Zod**
- **React Hook Form**
- **bcrypt**
- **React Toastify**

---

## 📸 Screenshots

&gt; Add screenshots of your application here.

<img width="1914" height="916" alt="Image" src="https://github.com/user-attachments/assets/cea1aee9-692d-4c51-b688-57532450f3af" />

<img width="1907" height="917" alt="Image" src="https://github.com/user-attachments/assets/9109480e-37e5-4b7d-8308-04306c57d9b7" />

<img width="495" height="910" alt="Image" src="https://github.com/user-attachments/assets/cc34fbcd-b43c-4a61-bcf3-af0de033e994" />

📂 Project Structure

app/
 ├── api/                    # Next.js API Routes
 │    ├── auth/[...nextauth] # NextAuth configuration
 │    ├── conversations/     # Conversation CRUD
 │    ├── messages/          # Message sending & retrieval
 │    ├── notifications/     # User notifications
 │    ├── profile/           # Current user profile
 │    └── users/             # User search & profiles
 ├── chat/                   # Chat pages (dynamic routes)
 ├── (workspace)/            # Main app layout & pages
 │    ├── notifications/
 │    ├── profile/
 │    ├── settings/
 │    └── users/
 ├── components/             # Reusable UI components
 │    ├── HeaderChatComponent.tsx
 │    ├── MessageList.tsx
 │    ├── MobileHeader.tsx
 │    └── RightSidebar.tsx
 ├── store/                  # Redux slices & store config
 ├── lib/                    # Utilities, validation schemas, auth
 └── globals.css             # Tailwind v4 + CSS variables

⚙️ Installation
Clone the repository

git clone https://github.com/your-username/talk-to-me.git


Install dependencies
npm install


Run the development server
npm run dev

Build for production
npm run build


🔑 Environment Variables
Create a .env.local file and add the following variables:

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (if using direct connection)
DATABASE_URL=postgresql://...



💡 What I Learned
During this project I gained hands-on experience with:


-Building full-stack applications using the Next.js App Router
-Designing relational database schemas (conversations, participants, messages)
-Managing complex global state with Redux Toolkit & Entity Adapters
-Implementing authentication flows with NextAuth.js and bcrypt
-Validating forms with Zod and React Hook Form
-Creating RESTful API routes with proper error handling
-Building responsive layouts with Tailwind CSS and mobile-first drawers
-Syncing dark/light theme across the app with localStorage
-Handling optimistic UI updates for instant message feedback
-Structuring scalable Redux stores with normalized state



📈 Future Improvements

🔄 Real-time messaging with Supabase Realtime / WebSockets
🖼️ Image and file sharing in conversations
✉️ Email verification on registration
🌍 Online / offline status with heartbeat
🔊 Push notifications for new messages
🧵 Reply to specific messages
😁 Emoji picker and reactions
🌐 Multi-language support (i18n)


👨‍💻 Author

Milad Karimi
Frontend Developer
GitHub: https://github.com/miladkarimi1370

📄 License
This project is open-source and available under the MIT License.
