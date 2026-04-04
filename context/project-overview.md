# 🗄️ DevStash — Project Overview

> **One fast, searchable, AI-enhanced hub for all developer knowledge & resources.**

---

## 📌 Problem Statement

Developers keep their essentials scattered across too many tools:

| What          | Where it ends up                |
| ------------- | ------------------------------- |
| Code snippets | VS Code, Notion, random gists   |
| AI prompts    | Lost in chat histories          |
| Context files | Buried in project folders       |
| Useful links  | Browser bookmarks               |
| Documentation | Random folders, Google Docs     |
| Commands      | `.txt` files, bash history      |
| Templates     | GitHub gists, boilerplate repos |

**The result:** constant context-switching, lost knowledge, and inconsistent workflows.

**DevStash** solves this by giving developers a single, fast, searchable, AI-enhanced hub to store, organize, and retrieve everything they need — snippets, prompts, commands, notes, files, images, and links.

---

## 👥 Target Users

| Persona                        | Core Need                                                          |
| ------------------------------ | ------------------------------------------------------------------ |
| **Everyday Developer**         | Fast access to snippets, prompts, commands, and links              |
| **AI-First Developer**         | Save & organize prompts, context files, workflows, system messages |
| **Content Creator / Educator** | Store code blocks, explanations, course notes                      |
| **Full-Stack Builder**         | Collect patterns, boilerplates, API examples                       |

---

## 🧱 Features

### A. Items & Item Types

Items are the core unit of DevStash. Each item has a **type** that determines its behavior and appearance. Users start with system-defined types (locked), with custom types coming later for Pro users.

**System Types:**

| Type       | Icon         | Color     | Content Model | Route             | Tier    |
| ---------- | ------------ | --------- | ------------- | ----------------- | ------- |
| 🔵 Snippet | `Code`       | `#3b82f6` | Text          | `/items/snippets` | Free    |
| 🟣 Prompt  | `Sparkles`   | `#8b5cf6` | Text          | `/items/prompts`  | Free    |
| 🟠 Command | `Terminal`   | `#f97316` | Text          | `/items/commands` | Free    |
| 🟡 Note    | `StickyNote` | `#fde047` | Text          | `/items/notes`    | Free    |
| ⚪ File    | `File`       | `#6b7280` | File (R2)     | `/items/files`    | **Pro** |
| 🩷 Image   | `Image`      | `#ec4899` | File (R2)     | `/items/images`   | **Pro** |
| 🟢 Link    | `Link`       | `#10b981` | URL           | `/items/links`    | Free    |

> **Content model categories:** `TEXT` (snippet, prompt, command, note), `URL` (link), `FILE` (file, image).

**UX note:** Items should be quick to create and access via a slide-out drawer — no full-page navigation required.

### B. Collections

Collections are user-created groups that can hold items of **any type**. An item can belong to **multiple collections** (many-to-many).

Example collections:

- _React Patterns_ → snippets, notes
- _Context Files_ → files, prompts
- _Interview Prep_ → snippets, commands, links

### C. Search

Full-text search across:

- Title
- Content body
- Tags
- Item type

### D. Authentication

- Email/password registration & login
- GitHub OAuth sign-in
- Powered by **NextAuth v5** (`Auth.js`)

### E. Core UX Features

- ⭐ Favorite items and collections
- 📌 Pin items to top of lists
- 🕐 Recently used items
- 📥 Import code from file upload
- ✍️ Markdown editor for text-based types
- 📤 File upload (R2) for file/image types
- 📦 Export data (JSON / ZIP) — **Pro**
- 🌙 Dark mode by default, light mode optional
- 🏷️ Add/remove items to/from multiple collections
- 👁️ View which collections an item belongs to

### F. AI Features (**Pro Only**)

| Feature                  | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| **Auto-Tag Suggestions** | AI analyzes content and suggests relevant tags               |
| **AI Summaries**         | Generate a concise summary of any item                       |
| **Explain This Code**    | Get a plain-English explanation of a code snippet            |
| **Prompt Optimizer**     | Rewrite and improve AI prompts for clarity and effectiveness |

---

## 🗂️ Data Model

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌───────────────┐
│     User     │       │     ItemType     │       │      Tag      │
├──────────────┤       ├──────────────────┤       ├───────────────┤
│ id           │──┐    │ id               │       │ id            │
│ name         │  │    │ name             │       │ name          │
│ email        │  │    │ icon             │       │ userId        │──▶ User
│ isPro        │  │    │ color            │       └──────┬────────┘
│ stripeIds... │  │    │ contentModel     │              │
└──────────────┘  │    │ isSystem         │              │
                  │    │ userId?          │──▶ User      │
                  │    └────────┬─────────┘              │
                  │             │                        │
                  │             │ 1:many                 │ many:many
                  │             ▼                        │
                  │    ┌──────────────────┐              │
                  └──▶ │      Item        │◀─────────────┘
                       ├──────────────────┤      (ItemTag join)
                       │ id               │
                       │ title            │
                       │ contentType      │
                       │ content          │
                       │ fileUrl          │
                       │ url              │
                       │ language         │
                       │ isFavorite       │
                       │ isPinned         │
                       │ ...              │
                       └────────┬─────────┘
                                │
                                │ many:many
                                ▼
                       ┌──────────────────┐
                       │ ItemCollection   │
                       ├──────────────────┤
                       │ itemId           │──▶ Item
                       │ collectionId     │──▶ Collection
                       │ addedAt          │
                       └──────────────────┘
                                │
                                │
                                ▼
                       ┌──────────────────┐
                       │   Collection     │
                       ├──────────────────┤
                       │ id               │
                       │ name             │
                       │ description      │
                       │ isFavorite       │
                       │ defaultTypeId    │──▶ ItemType
                       │ userId           │──▶ User
                       └──────────────────┘
```

### Prisma Schema

```prisma
// ============================================================
// DevStash — Prisma Schema
// Database: PostgreSQL (Neon)
// ORM: Prisma 7
// ============================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Auth (NextAuth v5) ─────────────────────────────────────

model User {
  id                   String    @id @default(cuid())
  name                 String?
  email                String    @unique
  emailVerified        DateTime?
  image                String?
  password             String?   // null for OAuth-only users
  isPro                Boolean   @default(false)
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?   @unique

  accounts    Account[]
  sessions    Session[]
  items       Item[]
  collections Collection[]
  itemTypes   ItemType[]   // custom types only (system types have null userId)
  tags        Tag[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── Core Models ────────────────────────────────────────────

model ItemType {
  id           String       @id @default(cuid())
  name         String       // "snippet", "prompt", etc.
  icon         String       // Lucide icon name
  color        String       // Hex color
  contentModel ContentModel @default(TEXT)
  isSystem     Boolean      @default(false)
  userId       String?      // null = system type, set = user's custom type

  user  User?  @relation(fields: [userId], references: [id], onDelete: Cascade)
  items Item[]

  collections Collection[] @relation("CollectionDefaultType")

  createdAt DateTime @default(now())

  @@unique([name, userId]) // no duplicate type names per user
}

enum ContentModel {
  TEXT
  URL
  FILE
}

model Item {
  id          String  @id @default(cuid())
  title       String
  description String?

  // ── Content fields (determined by ItemType.contentModel) ──
  contentType ContentModel
  content     String?      // markdown body — TEXT types
  url         String?      // external URL — URL types
  fileUrl     String?      // Cloudflare R2 URL — FILE types
  fileName    String?      // original upload filename
  fileSize    Int?         // size in bytes

  // ── Metadata ──
  language   String?  // programming language (snippets, commands)
  isFavorite Boolean  @default(false)
  isPinned   Boolean  @default(false)

  // ── Relations ──
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  itemTypeId String
  itemType   ItemType @relation(fields: [itemTypeId], references: [id])

  tags        ItemTag[]
  collections ItemCollection[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId, itemTypeId])
  @@index([userId, isFavorite])
  @@index([userId, isPinned])
  @@index([userId, updatedAt])
}

model Collection {
  id          String  @id @default(cuid())
  name        String  // "React Hooks", "Interview Prep"
  description String?
  isFavorite  Boolean @default(false)

  // ── Relations ──
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  defaultTypeId String?
  defaultType   ItemType? @relation("CollectionDefaultType", fields: [defaultTypeId], references: [id])

  items ItemCollection[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

// ─── Join Tables ────────────────────────────────────────────

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

model Tag {
  id     String @id @default(cuid())
  name   String
  userId String

  user  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items ItemTag[]

  @@unique([name, userId]) // tags scoped per user
}

model ItemTag {
  itemId String
  tagId  String

  item Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
}
```

> ⚠️ **Migration policy:** Never use `prisma db push` in any environment. All schema changes go through `prisma migrate dev` locally, then `prisma migrate deploy` in production.

---

## 🛠️ Tech Stack

| Layer            | Technology                                                                        | Notes                                              |
| ---------------- | --------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Framework**    | [Next.js 16](https://nextjs.org/) + React 19                                      | SSR pages, API routes, single repo                 |
| **Language**     | [TypeScript](https://www.typescriptlang.org/)                                     | End-to-end type safety                             |
| **Database**     | [Neon](https://neon.tech/) (PostgreSQL)                                           | Serverless Postgres in the cloud                   |
| **ORM**          | [Prisma 7](https://www.prisma.io/)                                                | Type-safe DB access, migrations                    |
| **Auth**         | [NextAuth v5](https://authjs.dev/) (Auth.js)                                      | Email/password + GitHub OAuth                      |
| **File Storage** | [Cloudflare R2](https://developers.cloudflare.com/r2/)                            | S3-compatible, zero egress fees                    |
| **AI**           | [OpenAI](https://platform.openai.com/) — `gpt-5-nano`                             | Auto-tagging, summaries, explain, prompt optimizer |
| **Styling**      | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Utility-first + accessible components              |
| **Payments**     | [Stripe](https://stripe.com/)                                                     | Subscriptions + customer portal                    |
| **Caching**      | Redis _(under consideration)_                                                     | Session/query caching layer                        |

---

## 💰 Monetization — Freemium Model

```
┌─────────────────────────────────┬──────────────────────────────────────┐
│          FREE                   │       PRO  ($8/mo · $72/yr)         │
├─────────────────────────────────┼──────────────────────────────────────┤
│  50 items                       │  Unlimited items                    │
│  3 collections                  │  Unlimited collections              │
│  System types (no file/image)   │  All types + file/image uploads     │
│  Basic search                   │  Full search                        │
│  No AI features                 │  AI auto-tag, summaries, explain,   │
│  No export                      │    prompt optimizer                 │
│                                 │  Export (JSON / ZIP)                │
│                                 │  Custom types (future)              │
│                                 │  Priority support                   │
└─────────────────────────────────┴──────────────────────────────────────┘
```

> **Dev note:** During development, all users have full Pro access. Gating will be enforced before launch via middleware + `user.isPro` checks.

---

## 🎨 UI / UX Guidelines

### Design Principles

- Modern, minimal, developer-focused aesthetic
- Dark mode by default, light mode optional
- Clean typography, generous whitespace, subtle borders/shadows
- Syntax highlighting for all code blocks
- **Design references:** Notion, Linear, Raycast

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Topbar  [ Search... ]                    [⭐] [👤] [⚙]  │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  Sidebar   │  Main Content                               │
│            │                                             │
│  TYPES     │  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  ─ Snippets│  │ React   │ │ Python  │ │ AI      │      │
│  ─ Prompts │  │ Patterns│ │ Scripts │ │ Prompts │      │
│  ─ Commands│  │ 🔵 12   │ │ 🔵 8   │ │ 🟣 15  │      │
│  ─ Notes   │  └─────────┘ └─────────┘ └─────────┘      │
│  ─ Files 🔒│                                             │
│  ─ Images🔒│  ┌─────────┐ ┌─────────┐                   │
│  ─ Links   │  │ Quick   │ │ Context │                   │
│            │  │ Cmds    │ │ Files   │                   │
│  RECENT    │  │ 🟠 5    │ │ ⚪ 3   │                   │
│  COLLECTIONS  └─────────┘ └─────────┘                   │
│  ─ React.. │                                             │
│  ─ AI Pro..│  Items (color-coded cards by type)          │
│  ─ Quick.. │  ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│            │  │ 🔵 │ │ 🟣 │ │ 🟠 │ │ 🟢 │              │
│            │  └────┘ └────┘ └────┘ └────┘              │
├────────────┴─────────────────────────────────────────────┤
│  Item Drawer (slides in from right)                      │
│  ┌──────────────────────────────────────────────┐       │
│  │ Title, type badge, tags, content/editor,     │       │
│  │ collections, actions (fav, pin, delete)       │       │
│  └──────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────┘
```

- **Sidebar:** Collapsible. Shows item types (with icons), recent items, and pinned collections. Becomes a mobile drawer on small screens.
- **Main area:** Grid of collection cards (background tinted by dominant item type). Items displayed as color-coded cards (border = type color).
- **Item drawer:** Slide-out panel for viewing/editing individual items. Fast open, no page navigation.

### Micro-interactions

- Smooth transitions on drawer open/close and card hover
- Hover states on all interactive cards
- Toast notifications for CRUD actions (created, updated, deleted, copied)
- Loading skeletons for async content

---

## 📁 Suggested Project Structure

```
devstash/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                 # seed system item types
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx      # sidebar + topbar shell
│   │   │   ├── page.tsx        # home — collections grid
│   │   │   ├── items/
│   │   │   │   └── [type]/     # /items/snippets, /items/prompts …
│   │   │   ├── collections/
│   │   │   │   └── [id]/
│   │   │   └── settings/
│   │   └── api/
│   │       ├── items/
│   │       ├── collections/
│   │       ├── tags/
│   │       ├── ai/
│   │       ├── upload/         # R2 file uploads
│   │       ├── stripe/
│   │       │   └── webhook/
│   │       └── auth/[...nextauth]/
│   ├── components/
│   │   ├── ui/                 # shadcn primitives
│   │   ├── layout/             # Sidebar, Topbar, MobileDrawer
│   │   ├── items/              # ItemCard, ItemDrawer, ItemForm
│   │   ├── collections/        # CollectionCard, CollectionGrid
│   │   └── shared/             # SearchBar, TagInput, TypeBadge
│   ├── lib/
│   │   ├── prisma.ts           # PrismaClient singleton
│   │   ├── auth.ts             # NextAuth config
│   │   ├── r2.ts               # Cloudflare R2 helpers
│   │   ├── stripe.ts           # Stripe helpers
│   │   ├── ai.ts               # OpenAI helpers
│   │   └── constants.ts        # system types, colors, limits
│   ├── hooks/
│   └── types/
├── public/
├── .env.local
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 🔗 Key Resource Links

| Resource              | URL                                  |
| --------------------- | ------------------------------------ |
| Next.js Docs          | https://nextjs.org/docs              |
| Prisma Docs           | https://www.prisma.io/docs           |
| Auth.js (NextAuth v5) | https://authjs.dev                   |
| Tailwind CSS v4       | https://tailwindcss.com/docs         |
| shadcn/ui             | https://ui.shadcn.com                |
| Cloudflare R2         | https://developers.cloudflare.com/r2 |
| OpenAI API            | https://platform.openai.com/docs     |
| Stripe Billing        | https://stripe.com/docs/billing      |
| Neon Postgres         | https://neon.tech/docs               |
| Lucide Icons          | https://lucide.dev/icons             |

---

## ✅ Development Checklist

- [ ] Initialize Next.js 16 project with TypeScript
- [ ] Set up Prisma with Neon PostgreSQL
- [ ] Create initial migration with schema above
- [ ] Seed system item types (7 types with icons/colors)
- [ ] Configure NextAuth v5 (email/password + GitHub)
- [ ] Build dashboard layout (sidebar + topbar + main grid)
- [ ] Implement CRUD for items (with drawer UI)
- [ ] Implement CRUD for collections
- [ ] Build search (title, content, tags, type filtering)
- [ ] Add tagging system
- [ ] Implement favorites and pinning
- [ ] Set up Cloudflare R2 for file/image uploads
- [ ] Add markdown editor for text types
- [ ] Integrate Stripe for Pro subscriptions
- [ ] Build Pro gating middleware
- [ ] Implement AI features (auto-tag, summarize, explain, optimize)
- [ ] Add export functionality (JSON/ZIP)
- [ ] Dark/light mode theming
- [ ] Responsive/mobile layout
- [ ] Loading skeletons and micro-interactions
