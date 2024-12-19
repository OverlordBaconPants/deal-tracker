# Real Estate Deal Management System

A React-based web application for managing real estate wholesaling deals, team assignments, and commission calculations.

## Overview

This application helps real estate investment teams track and manage their wholesale deals from start to finish. It provides features for:

- Deal lifecycle management

- Team member role assignments

- Commission calculations

- Performance analytics and statistics

- Deal status tracking

## Prerequisites

- Node.js (v9.2.0 or higher)

- npm (v9.2.0)

- Modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation

1\. Clone the repository:

```bash

git clone [repository-url]

cd [repository-name]

```

2\. Install dependencies:

```bash

npm install

```

3\. Start the development server:

```bash

npm run dev

```

The application will be available at `http://localhost:5173` (or your next available port).

## Features

### Deal Management

- Create and track real estate wholesale deals

- Assign team members to specific roles

- Monitor deal status (In Progress, Complete, Dead)

- Calculate commission splits automatically

- Track important dates (First Contact, Closing)

### Team Roles

The application supports six distinct team roles with specific commission percentages:

- Hunter (30%): Responsible for finding and securing deals

- Closer (20%): Handles deal negotiations and closing

- Dispo (20%): Manages disposition of properties

- Architect (3%): Oversees deal structure

- Mentor (0.6%): Provides guidance and oversight

- Dynamo (0.9%): Supports deal momentum

### Dashboard Analytics

- Deal status distribution

- Team member earnings

- Monthly trends

- Performance metrics

- Average time to close

## Application Structure

```

src/

├── components/            # React components

│   ├── DealsManagement/  # Deal tracking and management

│   ├── StatisticsDashboard/ # Analytics and reporting

│   ├── TeamManagement/   # Team member administration

│   └── ui/               # Shared UI components

├── data/                 # Data management and utilities

└── lib/                  # Utility functions

```

## Technology Stack

- React

- Vite

- Tailwind CSS

- Recharts (for data visualization)

- shadcn/ui components

- Local Storage for data persistence

## Development

The application uses Vite as its build tool and development server. Key commands:

```bash

npm run dev    # Start development server

npm run build  # Create production build

npm run serve  # Preview production build

```

## Data Management

The application uses browser localStorage for data persistence. Initial sample data is provided for:

- Team members with predefined roles

- Example deals with various statuses

- Role assignments and commission structures

## Styling

The application uses a custom purple-gradient theme with:

- Tailwind CSS for utility classes

- Custom color palette defined in `tailwind.config.js`

- Responsive design for all screen sizes

- Dark mode support

## Build and Deployment

1\. Create a production build:

```bash

npm run build

```

2\. The build output will be in the `dist` directory, ready for deployment to any static hosting service.

## License

[Your License Here]

## Contributing

[Your Contribution Guidelines Here]