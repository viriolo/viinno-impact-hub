# Impact Platform - Australia Awards Scholar Community

Create a comprehensive platform connecting Australia Awards scholars with mentors, CSR funders, and NGOs to facilitate meaningful social impact initiatives.

## Core Features

### 1. Authentication & User Management
- Email-based authentication with Supabase
- Multi-role system (scholars, mentors, CSR funders, NGOs)
- Profile management with role-specific fields
- Profile completion tracking

### 2. Impact Cards
- Create and share impact initiatives
- Support for media uploads
- Location-based mapping
- Impact metrics tracking
- Categories and tags
- Status management (draft, published)

### 3. Interactive Map
- Global visualization of impact initiatives
- Filterable by category and status
- Heatmap visualization option
- Clickable markers with initiative details
- Geographic clustering

### 4. Community Features
- Direct messaging between users
- Activity feed
- Follow system
- Badge/achievement system
- Resource library

### 5. UI/UX Requirements
- Modern, professional design using Tailwind CSS
- Responsive layout for all devices
- Shadcn/ui components for consistent styling
- Loading states and error handling
- Toast notifications for user feedback

### 6. Data Structure

#### Profiles Table
- Basic info (name, bio, location)
- Role-specific fields
- Social links
- Skills and interests
- Organization details
- Profile completion status

#### Impact Cards Table
- Title and description
- Media attachments
- Geographic location
- Impact metrics
- Status and category
- View/share counts

#### Resources Table
- Educational materials
- Best practices
- Success stories
- Categorization system

#### Messages System
- Direct messaging
- Conversation management
- Read status tracking

### 7. Technical Requirements
- TypeScript for type safety
- React Query for data management
- React Router for navigation
- Form validation with React Hook Form
- Supabase for backend services
- Mapbox for geographic features

### 8. Security & Performance
- Row Level Security policies
- Data validation and sanitization
- Optimistic updates
- Lazy loading for media
- Proper error boundaries

## Design Guidelines
- Clean, professional aesthetic
- Accessibility compliance
- Clear navigation hierarchy
- Consistent spacing and typography
- Mobile-first approach

## User Flows

### Scholar Journey
1. Register and verify email
2. Complete profile
3. Create impact cards
4. Connect with mentors
5. Access resources
6. Track impact

### Mentor Journey
1. Register as mentor
2. Set expertise areas
3. Connect with scholars
4. Provide guidance
5. Share resources

### CSR/NGO Journey
1. Register organization
2. Browse impact initiatives
3. Connect with scholars
4. Track collaborations
5. Share opportunities

## Implementation Priority
1. Authentication system
2. Profile management
3. Impact cards
4. Interactive map
5. Messaging system
6. Resource library
7. Activity tracking
8. Badge system

## Technical Architecture
- Frontend: React + TypeScript
- UI: Tailwind CSS + shadcn/ui
- Backend: Supabase
- Database: PostgreSQL
- Storage: Supabase Storage
- Build Tool: Vite

This platform should serve as a hub for Australia Awards scholars to showcase their impact, connect with mentors and supporters, and create meaningful change in their communities.