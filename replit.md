# Cryptocurrency Market Data Dashboard

## Overview

This is a full-stack cryptocurrency market data dashboard built with React, TypeScript, and Express. The application displays real-time cryptocurrency prices, market statistics, and trading data using the CoinPaprika API. It features a modern, responsive design with dark/light theme support and comprehensive cryptocurrency market information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom theme provider with dark/light/system modes

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Integration**: CoinPaprika API for cryptocurrency data
- **Data Validation**: Zod schemas for runtime type checking
- **Development**: Hot module replacement with Vite middleware integration

### Database Strategy
- **Current**: Memory-based storage (no persistent database)
- **Configured**: Drizzle ORM with PostgreSQL support ready for future expansion
- **Migration**: Drizzle Kit configured for database schema management

## Key Components

### Data Layer
- **API Client**: Custom fetch wrapper with error handling and authentication support
- **Schema Validation**: Zod schemas for cryptocurrency data types (coins, tickers, global stats, OHLCV)
- **Type Safety**: Shared TypeScript types between frontend and backend

### UI Components
- **CryptoTable**: Paginated, sortable table displaying cryptocurrency data with real-time updates
- **GlobalStats**: Market overview section showing total market cap, volume, and Bitcoin dominance
- **Header**: Navigation with search, theme toggle, and mobile-responsive design
- **Theme Provider**: Context-based theme management with system preference detection

### Features
- Real-time cryptocurrency price updates (30-second intervals)
- Sortable and paginated cryptocurrency table
- Global market statistics dashboard
- Responsive design with mobile navigation
- Dark/light theme switching
- Search functionality (UI prepared)
- Loading states and error handling

## Data Flow

1. **API Requests**: Frontend makes requests to Express backend endpoints
2. **External API**: Backend fetches data from CoinPaprika API
3. **Data Transformation**: Backend validates and transforms API responses using Zod schemas
4. **Caching**: TanStack Query caches responses and manages refetching
5. **UI Updates**: Components automatically re-render when data changes
6. **Error Handling**: Comprehensive error boundaries and user feedback

## External Dependencies

### Core Dependencies
- **CoinPaprika API**: Primary data source for cryptocurrency information
- **Neon Database**: PostgreSQL provider (configured but not currently used)
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **Vite**: Development server and build tool
- **Drizzle Kit**: Database migration and management
- **TypeScript**: Static type checking
- **ESBuild**: Production bundling

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles Express server to `dist/index.js`
3. **Dependencies**: External packages remain as modules (not bundled)

### Environment Requirements
- Node.js with ESM support
- Environment variables:
  - `DATABASE_URL`: PostgreSQL connection string (optional)
  - `COINPAPRIKA_API_KEY`: API key for enhanced rate limits (optional)
  - `NODE_ENV`: Environment mode (development/production)

### Production Considerations
- Express serves static files from `dist/public` in production
- API endpoints prefixed with `/api` for clear separation
- Error handling middleware for production error responses
- Configurable API rate limiting and caching strategies

### Scalability Notes
- Database layer is prepared for future implementation
- Modular architecture allows easy feature additions
- Component-based design enables code reusability
- API abstraction layer facilitates data source changes