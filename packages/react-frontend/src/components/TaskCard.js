import React, { useState } from "react";
import Checkmark from "./Checkmark";

const TaskCard = ({
    _id,
    task_name,
    task_description,
    task_due_date,
    priority,
    task_tags,
    onComplete,
    isComplete,
}) => {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div className="flex-1 max-w-[150px] p-2 bg-white border border-gray-100 rounded-lg shadow mx-2">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <h6 className="mb-1 text-sm font-semibold tracking-tight text-gray-900 truncate">
                        {task_name}
                    </h6>
                </div>
                <div className="flex items-center">
                    <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={toggleModal}>
                        <span role="img" aria-label="info">ℹ️</span>
                    </button>
                    <Checkmark
                        onToggle={() => onComplete(_id)}
                        isComplete={isComplete}
                    />
                </div>
            </div>

            <p className="mb-1 text-xs font-normal text-gray-500 truncate">
                {task_description.slice(0, 100)}
                {task_description.length > 100 && " ..."}
            </p>
            <p className="mb-1 text-xs text-gray-500">
                Due:&nbsp;
                {new Date(task_due_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                }) + ' @ ' + new Date(task_due_date).toLocaleTimeString("en-US", {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })}
            </p>

            <div className="mb-1 text-xs font-medium">
                {task_tags?.map((tag, index) => {
                    return (
                        <span key={index} className="bg-gray-100 text-gray-800 text-xxs font-medium me-1 px-1.5 py-0.5 rounded">
                            {tag}
                        </span>
                    );
                })}
            </div>

            {showModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 max-w-[300px] min-w-[300px] rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-2">Task Details</h2>
                        <div className="mb-4">
                            <p className="font-medium text-gray-700 mb-1">Title:</p>
                            <p className="text-sm text-gray-700 mb-2">{task_name}</p>
                            <p className="font-medium text-gray-700 mb-1">Description:</p>
                            <p className="text-sm text-gray-700 mb-2">{task_description}</p>
                            <p className="font-medium text-gray-700 mb-1">Tags:</p>
                            <div>
                                {task_tags?.map((tag, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-800 text-xxs font-medium me-1 px-1.5 py-0.5 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={toggleModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCard;