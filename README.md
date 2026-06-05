# TaskPilot

## 1. Project Overview

**Problem:** Teams need a lightweight, project-centric task management experience that connects authenticated users to projects, epics, tasks, and member collaboration without cumbersome setup.

**Solution:** A modern React SPA built with Vite, Tailwind and Supabase. It supports secure authentication, project creation, epic planning, member management, and a draggable task board for fast status updates.

## 2. Live Demo

https://task-management-tracker.vercel.app/

## 3. Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth + REST)
- Axios
- React Router DOM
- Redux Toolkit
- React Query
- DnD Kit
- Framer Motion
- Zod
- React Hook Form
- React Hot Toast

## 4. Architecture Decisions

- **SPA routing with nested routes:** `react-router-dom` powers project-specific workflows under `/projects/:projectId/*` with dedicated routes for statistics, members, and epics.
- **Centralized API client:** `src/API/axiosInstance.ts` handles Supabase auth headers, refresh token flows, and automatic retry logic in one place.
- **Custom hooks:** Encapsulate data fetching and page behavior (`useEpics`, `useProjectName`, `useUpdateEpics`, `useFetchTasks`, `useStatistics`, etc.).
- **Redux for auth state:** Authentication state managed through Redux Toolkit; API requests rely on cookie-based session tokens with refresh interceptor.
- **Composable layout:** `src/Components/Layout.tsx` separates navigation and shared page scaffolding from business logic.
- **Dual view architecture:** Task board and list views share data layer but render independently; mobile auto-override handled at component level.
- **Zod schema validation:** Client-side validation with React Hook Form integration for all forms (tasks, epics, projects, invitations).
- **Debounced search:** 400ms debounce on task search queries prevents excessive API calls during real-time filtering.
- **Member cache optimization:** Local member list cache reduces redundant RPC calls during epic and task operations.

## 5. Data Flow

1. User logs in or signs up via Supabase auth endpoints.
2. Access and refresh tokens are stored in cookies.
3. `axiosInstance` attaches `Authorization` and `apikey` headers to requests.
4. Pages fetch project, epic, task, and member data from Supabase REST endpoints.
5. Drag-and-drop status changes patch task records and invalidate cached queries.
6. UI state is rendered from API responses, with local state syncing for epics and task board interactions.

## 6. Technical Highlights

- **Token refresh on 401:** Axios response interceptor automatically handles session expiration and retries failed requests.
- **Dual task views:** Board view (`@dnd-kit/core`) enables intuitive drag-and-drop; list view supports infinite scroll and pagination.
- **Animated transitions:** `framer-motion` adds polished page and overlay animations.
- **Analytics dashboard:** Chart.js doughnut charts, calendar views, and date range filtering for task metrics and statistics.
- **Inline task editing:** Click-to-edit fields with async save and validation (EditableText component).
- **Email-based invitations:** RPC-based invitation system with token-based acceptance workflow.
- **Supabase REST approach:** Direct REST calls reduce backend complexity and improve iteration speed.
- **Error feedback:** `react-hot-toast` surfaces success and error states consistently across the app.
- **Mobile optimization:** Auto-detection switches board view to list view on mobile; hamburger navigation collapses sidebar.
- **Form validation:** Comprehensive Zod schemas with field-level error messages via FormInput component.

## 7. Key Features

- **Secure Authentication**: Sign up, log in, forgot password, reset password with token-based session management
- **Project Lifecycle**: Create, list, edit, and manage projects with descriptions
- **Team Collaboration**: Invite members by email with token-based acceptance flow, browse project members with roles
- **Epic Management**: Full CRUD operations with task nesting, assignee tracking, and deadline management
- **Advanced Task Management**:
  - Multiple task views: board (drag-and-drop) and list (paginated) modes
  - 8 task statuses: TO_DO, IN_PROGRESS, BLOCKED, IN_REVIEW, READY_FOR_QA, REOPENED, READY_FOR_PRODUCTION, DONE
  - Inline editing: click-to-edit title, description, due date, assignee, epic association
  - Real-time search with 400ms debounce for instant filtering
  - Mobile-optimized list view (auto-override on mobile)
- **Drag-and-drop Board**: Move tasks between workflow columns with visual feedback
- **Statistics & Analytics Dashboard**:
  - Calendar-based daily task breakdown
  - Task metrics: total, completed, overdue tracking
  - Status distribution with doughnut charts
  - Date range filtering with week navigation
  - Per-project and per-status filtering
- **Responsive Design**: Fully mobile-first approach with hamburger navigation
- **Form Validation**: Comprehensive client-side validation with Zod schemas and field-level error messages
- **Custom UI Components**: Avatar system, date picker, inline editable text, custom selectors
- **Skeleton Loading States**: Smooth loading feedback with pulse animations
- **Toast Notifications**: Real-time success/error feedback with React Hot Toast

## 8. Advanced Features

- **Dual Task Pagination Modes**: Toggle between infinite scroll and paginated modes for flexible data loading
- **Inline Task Editing**: Click-to-edit fields with async save and validation (no modal required)
- **Email-based Invitations**: Send invitations via RPC with invitation link and token-based acceptance
- **Invitation Workflow**: Dedicated `/invite` route for accepting team invitations with token validation
- **Mobile Auto-Override**: Mobile devices automatically switch to list view for optimal UX
- **Debounced Search**: 400ms debounce prevents excessive API calls during real-time filtering
- **Member Caching**: Efficient project member fetching with local cache to reduce API calls
- **Drag Overlay**: Visual feedback with overlay component while dragging tasks
- **Keyboard Modal Control**: ESC key closes modals automatically, click-outside support
- **Locale-Aware Date Formatting**: Configurable date locale (defaults to en-US)
- **Role Infrastructure**: ADMIN, MEMBER, VIEWER role definitions in place (permissions enforcement in development)

## 9. Performance Optimization

- **Vite bundling:** fast development startup and optimized production builds.
- **Centralized API layer:** avoids repeated request configuration.
- **React Query cache management:** targeted invalidation limits unnecessary refetches.
- **Tailwind utility CSS:** keeps styles atomic and bundle size small.
- **Minimal rerenders:** status columns and drag overlays render only when needed.
- **Debounced search:** 400ms debounce on task filtering to reduce API calls.
- **Member caching:** local member list cache to avoid redundant RPC calls.

## 10. Security Considerations

- Tokens stored in secure cookies with SameSite=strict
- Axios interceptor prevents unauthorized access loops
- Sensitive operations validated server-side via Supabase policies

## 11. Folder Structure

```
.
├── public/
├── src/
│   ├── API/
│   │   └── axiosInstance.ts
│   ├── Common/
│   ├── Components/
│   ├── Constants/
│   ├── hooks/
│   ├── Pages/
│   │   ├── Epics/
│   │   ├── Projects/
│   │   ├── Members/
│   │   ├── Statistics/
│   │   ├── Tasks/
│   │   └── Auth/
│   ├── Schema/
│   ├── Store/
│   ├── Types/
│   └── Utils/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vite.config.ts
```

## 12. Installation

1. Clone the repository

```bash
git clone <repo-url>
cd Task-Management-Tracker
pnpm install
```

2. Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

3. Run locally

```bash
pnpm dev
```

## 13. Limitations

- Offline mode is not supported.
- Unit and integration tests are not included.
- Role-based permission enforcement is not yet implemented (role infrastructure is in place).

## 14. Future Improvements

- **Dark Mode**: Complete dark theme implementation with theme toggle
- **Supabase Realtime**: WebSocket updates for real-time collaborative boards
- **Role-Based Permissions**: Enforce ADMIN, MEMBER, VIEWER access controls
- **Automated Tests**: Add unit and integration tests for auth and task flows
- **Audit History**: Track all changes with timestamps and user attribution
- **Push Notifications**: Real-time alerts for task assignments and status changes
- **Advanced Filters**: Save and manage custom task filters
- **Bulk Operations**: Batch update tasks (status, assignee, epic)
- **Comments & Activity Feed**: Add task comments and activity timeline
- **Export Reports**: Export project data and statistics as PDF/CSV

## 15. Challenges & Solutions

- Handling token expiration during concurrent requests  
  → solved using axios interceptor queueing strategy

- Drag-and-drop performance with large task lists  
  → optimized rendering using conditional overlays

- Syncing server state with local UI state  
  → solved via React Query invalidation + local state isolation
