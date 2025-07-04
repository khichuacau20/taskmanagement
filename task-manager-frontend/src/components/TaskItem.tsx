import React from 'react';
import { Task } from '../types/task';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
    return (
        <div className="task-item">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <button onClick={() => onEdit(task)}>Edit</button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
    );
};

export default TaskItem;