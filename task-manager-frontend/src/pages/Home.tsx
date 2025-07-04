import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Loader from '../components/common/Loader';

const Home: React.FC = () => {
    const taskContext = useContext(TaskContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
    useEffect(() => {
        if (location.state && location.state.updateSuccess) {
            setShowUpdateSuccess(true);
            const timer = setTimeout(() => {
                setShowUpdateSuccess(false);
                navigate('.', { replace: true, state: {} });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [location.state, navigate]);

    if (!taskContext) {
        return <div>Error: Task context not available.</div>;
    }

    const { tasks, loading } = taskContext;

    return (
        <div>
            <h1>Task Management</h1>
            {showUpdateSuccess && (
                <div className="mb-4 text-center">
                    <div className="inline-block bg-green-100 text-green-800 px-6 py-3 rounded shadow">
                        Update successfully!
                    </div>
                </div>
            )}
            <TaskForm onSubmit={(task) => {
                // You should replace this with your actual submit logic
                if (taskContext && taskContext.addTask) {
                    // Provide assignedUserId directly, replace 'defaultUserId' as needed
                    taskContext.addTask({ ...task, assignedUserId: 'defaultUserId' });
                }
            }} />
            <div style={{ margin: '1rem 0' }} />
            {loading ? <Loader /> : <TaskList tasks={tasks} />}
            <div style={{ margin: '1rem 0' }} />
        </div>
    );
};

export default Home;