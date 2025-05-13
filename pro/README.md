# 2D to 3D Conversion Project

A modern web application that transforms 2D designs into immersive 3D experiences. Built with React, TypeScript, and modern web technologies.

## Features

- Convert 2D designs to 3D models
- User Authentication with role-based access
- Interactive 3D visualization
- Modern, responsive UI
- Secure data handling

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn-ui
- **Build Tool**: Vite
- **Authentication**: Supabase
- **State Management**: React Context

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <your-repository-url>
cd pro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Supabase credentials

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
  ├── api/        # API integrations
  ├── components/ # Reusable components
  ├── context/    # React context providers
  ├── hooks/      # Custom hooks
  ├── lib/        # Utility functions
  ├── models/     # TypeScript interfaces
  ├── pages/      # Page components
  └── main.tsx    # Application entry point
```

## Build and Deployment

1. Create a production build:
```bash
npm run build
```

2. Preview the build locally:
```bash
npm run preview
```

3. Deploy the `dist` folder to your preferred hosting service

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
