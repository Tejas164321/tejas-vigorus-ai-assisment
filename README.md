# User Management Dashboard - Tejas Assessment

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

## 📋 Problem Statement

In modern web applications, managing large datasets efficiently is a common challenge. Client-side rendering of thousands of records can lead to performance bottlenecks, sluggish UI, and poor user experience. 

The goal of this project was to build a robust, scalable **User Management Dashboard** that handles data efficiently through server-side operations while providing a seamless, responsive, and aesthetically pleasing interface for administrators to view, filter, and manage user records.

## 💡 Solution

This solution implements a **Server-Driven Data Table** architecture. Instead of loading all data at once, the application leverages server-side pagination, sorting, and filtering. This ensures that the client only receives the distinct subset of data it needs, keeping the application lightning-fast regardless of the total dataset size.

Key architectural decisions include:
- **URL-Driven State**: All filter, sort, and pagination states are synchronized with the URL, allowing for easy sharing and bookmarking of specific views.
- **Debounced Search**: optimizing server requests by preventing API calls on every keystroke.
- **Responsive Layout**: A carefully crafted UI that maintains usability across devices, featuring a single-line filter interface for maximum screen real estate efficiency.

## ✨ Key Features

- **🚀 Server-Side Performance**: Pagination, sorting, and filtering logic executed on the server to handle large datasets.
- **🔍 Advanced Filtering**: 
  - **Text Search**: Real-time (debounced) search across user names and emails.
  - **Role & Status**: Dropdown filters for semantic categorization.
  - **Date Ranges**: Calendar-based filtering for "Joined Date" and "Last Active" timestamps.
- **📅 Interactive Calendar**: Custom-styled date picker with perfect alignment and multi-month view.
- **📱 Responsive Design**: 
  - Adaptive layouts for mobile and desktop.
  - **Single-Line Toolbar**: Optimized filter bar that scrolls horizontally on smaller screens to prevent UI clutter.
- **⚡ Modern Tech Stack**: Built with the latest Next.js 16 and React 19 features, utilizing Server Actions and Suspense.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Table Logic**: [TanStack Table](https://tanstack.com/table/latest) (Headless UI)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tejas164321/tejas-vigorus-ai-assisment.git
   cd tejas-vigorus-ai-assisment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📂 Project Structure

```
├── app/
│   ├── (examples)/users-table/  # Main User Table Implementation
│   │   ├── page.tsx             # Page entry point & data fetching
│   │   ├── columns.tsx          # Column definitions
│   │   └── filters.tsx          # Custom filter components
│   ├── api/users/               # Mock API route for serving user data
│   └── globals.css              # Global styles & Tailwind config
├── components/
│   ├── data-table/              # Reusable Data Table Components
│   │   ├── server-data-table.tsx
│   │   └── data-table-toolbar.tsx
│   └── ui/                      # Shared UI components (Button, Input, Calendar...)
├── lib/
│   ├── hooks/                   # Custom hooks (useTableState, etc.)
│   └── utils/                   # Helper functions
└── public/                      # Static assets
```

## 🎨 Design Decisions

- **Clean Aesthetic**: Used a minimal, whitespace-heavy design to reduce cognitive load.
- **Feedback Systems**: Loading skeletons and spinners provide immediate visual feedback during data fetches.
- **Accessibility**: All interactive elements are keyboard accessible and screen-reader friendly (via Radix UI).

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
