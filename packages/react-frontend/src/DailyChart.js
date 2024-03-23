import React, { useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import AddExperienceModal from "../src/components/addTaskModal";

const DailyChart = () => {
    // Dummy data for demonstration purposes
    const tasks = [
        { date: "Today", task: "Task 1", overdue: false },
        { date: "Tomorrow", task: "Task 2", overdue: true },
        // Add your actual task data here
    ];

    // State to manage modal visibility
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="bg-white px-4 max-w-lg mx-auto lg:px-8">
            <div className="flex flex-col mx-12">
                {/* Date */}
                <p className="text-4xl font-bold text-gray-800 text-center">
                    {tasks[0].date} {/* Display today's date */}
                </p>

                <div className="flex space-x-1 mt-4 justify-center">
                    <GoArrowLeft />
                    <button
                        type="button"
                        className="-mt-1 px-6 py-2 text-lg font-medium text-gray-900 focus:outline-none bg-white rounded-md border border-gray-500 hover:bg-gray-100 hover:text-blue-700 border-gray-200"
                    >
                        Today
                    </button>
                    <GoArrowRight />
                </div>

                {/* Box containing daily tasks */}
                <div className="border border-gray-200 rounded-md mt-8">
                    {/* Daily tasks */}
                    <div className="p-4">
                        <p className="text-xl font-semibold mb-4 text-gray-800">
                            Tasks
                        </p>
                        {/* Tasks list */}
                        {tasks.map((task, index) => (
                            <div key={index} className="flex items-center">
                                <p className={`mb-1 flex-1 ${task.overdue ? 'text-red-500' : 'text-gray-800'}`}>
                                    {task.task}
                                </p>
                                {index !== tasks.length - 1 && <hr className="w-full my-2 border-gray-200" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Task button centered below tasks */}
                <div className="flex justify-center mt-4">
                    <button
                        type="button"
                        className="py-3 px-8 text-md font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 "
                        onClick={() => {
                            setShowModal(true);
                        }}
                    >
                        Add Task
                    </button>
                </div>
            </div>

            {/* Modal */}
            <AddExperienceModal isOpen={showModal} setShowModal={setShowModal} />
        </div>
    );
};

export default DailyChart;



