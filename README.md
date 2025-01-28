# Impact Platform

A platform connecting scholars, mentors, CSR funders, and NGOs to create meaningful social impact.

## Features

- **Authentication**: Secure user authentication with email verification
- **User Roles**: Support for different user types (scholars, mentors, CSR funders, NGOs)
- **Profile Management**: Detailed user profiles with role-specific information
- **Impact Cards**: Share and track impact initiatives
- **Messaging**: Direct communication between users
- **Resource Library**: Educational and informational resources
- **Activity Feed**: Track user activities and engagement
- **Badge System**: Recognition for achievements and contributions

## Tech Stack

- **Frontend**: React + TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **File Storage**: Supabase Storage
- **Build Tool**: Vite

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
cd impact-platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
```

## Development

- **Code Style**: The project uses TypeScript for type safety
- **Components**: Built with shadcn/ui for consistent design
- **State Management**: React Query for server state
- **Routing**: React Router for navigation
- **Form Handling**: React Hook Form for form management

## Database Schema

Key tables:
- `profiles`: User profile information
- `impact_cards`: Impact initiatives and projects
- `resources`: Educational resources
- `messages`: User communications
- `user_roles`: Role management
- `badges`: Achievement system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.