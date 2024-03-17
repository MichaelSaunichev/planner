import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { formatDate } from "../libs/normalize";

import "react-datepicker/dist/react-datepicker.css";

interface AddExperienceModalProps {
    isOpen: boolean;
    setShowModal: (isOpen: boolean) => void;
    userId: string;
}

const AddExperienceModal: React.FC<AddExperienceModalProps> = ({
    isOpen,
    setShowModal,
    reloadWeek,
    userId
}) => {
    const [task, setTask] = useState({
        userid: userId,
        task_name: "",
        task_due_date: "",
        task_description: "",
        task_tags: [],
        task_completed: false,
    });

    const [due_date, set_due_date] = useState(new Date());

    if (!isOpen) return null;

    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleDueDateChange(date) {
        
        set_due_date(formatDate(date));
    }

    const processTags = (tags) => {
        if (Array.isArray(tags)) {
          return tags.map(tag => tag.trim()); 
        }
        else if (typeof tags === 'string') {
          return tags.split(",").map(tag => tag.trim());
        }
        else {
          return [];
        }
      };

    async function submitForm(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        // console.log("Test");
        try {
            console.log(task);
            // Assuming your backend expects task details in JSON format
            const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...task,
                    task_due_date: due_date,
                    task_tags: processTags(task.task_tags),
                }),
            });

            if (response.ok) {
                // Task successfully added to the backend and, consequently, MongoDB Atlas
                setTask({
                    userid: userId,
                    task_name: "",
                    task_due_date: "",
                    task_description: "",
                    task_tags: [],
                    task_completed: false,
                }); // Reset form
                setShowModal(false);
                reloadWeek(new Date());
            } else {
                //const errorText = await response.text(); // Or .json() if your backend sends a JSON response
                console.error(
                    "Failed to add task. Status:",
                    response.status,
                    //"Response:",
                    //errorText
                );
                setTask({
                    userid: "",
                    task_name: "",
                    task_due_date: "",
                    task_description: "",
                    task_tags: [],
                    task_completed: false,
                });
                // Handle server errors (e.g., invalid input or server issues)
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    }
    return (
        <>
            <div
                className="fixed inset-0 bg-black z-40 opacity-75"
                onClick={() => setShowModal(false)}
            ></div>

            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/* Content */}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/* Header */}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                            <h3 className="text-3xl font-semibold">Add Task</h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => setShowModal(false)}
                            >
                                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                </span>
                            </button>
                        </div>
                        {/* Body */}
                        <div className="relative flex-auto">
                            <form className="px-12 py-8" onSubmit={submitForm}>
                                <div className="grid gap-7 gap-x-12 mb-4 grid-cols-2">
                                    <div className="col-span-2 space-y-4">
                                        <label
                                            htmlFor="task_name"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Task Name
                                        </label>
                                        <input
                                            type="text"
                                            name="task_name"
                                            value={task.task_name}
                                            onChange={handleChange}
                                            id="task_name"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            placeholder="Type task name"
                                            required
                                        />
                                        <label
                                            htmlFor="tag"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Due Date
                                        </label>
                                        <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                            <DatePicker
                                                selected={due_date}
                                                onChange={(date) =>
                                                    set_due_date(date)
                                                }
                                                showTimeSelect
                                                timeFormat="h:mm aa"
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="YYYY-MM-dd h:mm aa"
                                                className="bg-gray-50"
                                                data-testid="mock-datepicker"
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="col-span-2 sm:col-span-1">
                                        <label
                                            htmlFor="priority"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Priority
                                        </label>
                                        <select
                                            id="priority"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        >
                                            <option value="">
                                                Select priority
                                            </option>
                                            <option value="low">Low</option>
                                            <option value="moderate">
                                                Moderate
                                            </option>
                                            <option value="high">High</option>
                                            <option value="top">Top</option>
                                        </select>
                                    </div> */}
                                    <div className="col-span-2 sm:col-span-1">
                                        <label
                                            htmlFor="description"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Task Tags
                                        </label>
                                        <input
                                            type="text"
                                            name="task_tags"
                                            value={task.task_tags}
                                            onChange={handleChange}
                                            placeholder="Task Tags (comma-separated)"
                                            className="lock p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label
                                            htmlFor="description"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Task Description
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            value={task.task_description}
                                            onChange={handleChange}
                                            name="task_description"
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Describe the task"
                                        ></textarea>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="py-2 px-8 text-md font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 "
                                    onClick={() => {
                                        setShowModal(true);
                                    }}
                                >
                                    Add Task
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddExperienceModal;