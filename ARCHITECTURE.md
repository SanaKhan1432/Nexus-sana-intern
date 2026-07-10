# Business Nexus - Project Architecture & Component Structure

## Overview
Business Nexus is a React-based web application built with Vite, TypeScript, and Tailwind CSS. The application connects Entrepreneurs with Investors through a secure dashboard environment.

## Tech Stack
* **Framework:** React 18
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM v6
* **Icons:** Lucide React

## Directory Structure
The application follows a feature-based and modular architecture located within the `/src` directory:

### 1. `/components`
Contains reusable UI building blocks, divided into sub-domains:
* **`/ui`**: Generic, reusable design system components (Buttons, Inputs, Cards, Badges, Avatars).
* **`/layout`**: Structural components (Navbar, Sidebar, DashboardLayout).
* **`/chat`**: Real-time messaging UI components.
* **`/collaboration`, `/entrepreneur`, `/investor`**: Feature-specific UI cards and components.

### 2. `/context`
Handles global state management.
* **`AuthContext.tsx`**: Manages user authentication state, login/logout logic, and role-based access (Entrepreneur vs. Investor).

### 3. `/data`
Contains mock data and local storage logic for the frontend environment.
* Acts as a temporary mock backend database (`users.ts`, `messages.ts`, `collaborationRequests.ts`).

### 4. `/pages`
Contains the top-level route components, organized by feature area:
* **`/auth`**: Login, Registration, and Password Reset screens.
* **`/dashboard`**: Role-specific landing pages (EntrepreneurDashboard, InvestorDashboard).
* **`/profile`, `/chat`, `/deals`, `/documents`**: Core application feature views.

### 5. `/types`
* **`index.ts`**: Contains all global TypeScript interfaces and type definitions, ensuring type safety across the application.

## Responsive Grid Strategy
The application utilizes Tailwind CSS's utility classes for a mobile-first responsive design:
* Default classes apply to mobile views.
* `sm:`, `md:`, and `lg:` prefixes control layout shifts (e.g., stacking columns on mobile, utilizing CSS Grid/Flexbox on desktop).