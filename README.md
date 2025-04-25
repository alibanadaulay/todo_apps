# Todo App

A modern todo application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Create, read, update, and delete tasks
- Mark tasks as completed
- Set task priorities
- Set due dates
- Configure recurring tasks
- Filter and sort tasks

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/todo.git
cd todo
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`
```bash
cp .env.example .env.local
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Deploying to Vercel

1. Create a [Vercel account](https://vercel.com/signup) if you don't have one

2. Install Vercel CLI
```bash
npm install -g vercel
```

3. Deploy to Vercel
```bash
vercel
```

4. Set environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: URL of your backend API

### Deploying to Other Platforms

#### Netlify

1. Create a [Netlify account](https://app.netlify.com/signup)
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `out`
5. Add environment variables in the Netlify dashboard

#### GitHub Pages

1. Add a GitHub Actions workflow for deployment
2. Set up environment variables in GitHub repository settings

## Backend API

The application expects a backend API with the following endpoints:

- `GET /api/v1/tasks` - Get all tasks
- `GET /api/v1/tasks/:id` - Get a task by ID
- `POST /api/v1/tasks` - Create a new task
- `PUT /api/v1/tasks/:id` - Update a task
- `DELETE /api/v1/tasks/:id` - Delete a task

## License

MIT 