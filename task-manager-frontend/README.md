# Task Manager Frontend

This is a task management frontend application built with React and TypeScript. The application allows users to manage their tasks efficiently by providing features to add, edit, and delete tasks.

## Project Structure

The project is organized into the following directories and files:

```
task-manager-frontend
├── public
│   └── index.html          # Main HTML file serving as the entry point
├── src
│   ├── components          # Contains reusable components
│   │   ├── TaskList.tsx    # Displays a list of tasks
│   │   ├── TaskItem.tsx    # Represents a single task
│   │   ├── TaskForm.tsx    # Form for adding new tasks
│   │   └── common
│   │       └── Loader.tsx   # Loading spinner/message component
│   ├── context             # Context API for state management
│   │   └── TaskContext.tsx  # Provides task state and functions
│   ├── pages               # Contains page components
│   │   ├── Home.tsx        # Main page displaying tasks
│   │   └── About.tsx       # About page with application information
│   ├── routes              # Routing setup
│   │   └── AppRoutes.tsx   # Defines application routes
│   ├── types               # TypeScript type definitions
│   │   └── task.d.ts       # Task interface definition
│   ├── App.tsx             # Main application component
│   ├── index.tsx           # Entry point of the React application
│   └── styles              # Styles for the application
│       └── main.css        # Main CSS file
├── package.json            # npm configuration file
├── tsconfig.json           # TypeScript configuration file
└── README.md               # Project documentation
```

## Features

- **Task Management**: Add, edit, and delete tasks.
- **Context API**: State management using React's Context API.
- **Routing**: Navigate between Home and About pages using React Router.
- **Responsive Design**: The application is designed to be responsive and user-friendly.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd task-manager-frontend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

The application will be running at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.