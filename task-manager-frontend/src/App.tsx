import React from 'react';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <div className="min-h-screen bg-gray-100">
          <AppRoutes />
        </div>
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;