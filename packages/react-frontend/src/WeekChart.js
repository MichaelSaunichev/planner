"use client"
import { useState, useEffect } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import AddExperienceModal from "../src/components/addTaskModal";
import TaskCard from "./components/TaskCard";
import { formatDate } from "./libs/normalize";
import { useParams, useLocation } from 'react-router-dom';

const WeekChart = ({ fetchHealth }) => {
    const [showModal, setShowModal] = useState(false);

    // current week's data
    const [currentWeek, setCurrentWeek] = useState([]);

    const [displayDates, setDisplayDates] = useState([]);
    const [doneTasks, setDoneTasks] = useState([]);

    const now = new Date();
    const overdueTasks = currentWeek.flatMap((day) =>
        day.tasks.filter(
            (task) => new Date(task.task_due_date) < now && !task.task_completed
        )
    );

    // mount the week
    useEffect(() => {
        updateWeek(new Date());
    }, []);

    // const { userId } = useParams();
    // const grabbedUserId = userId;
    
    const {state} = useLocation();
    const { userId } = state;
    const tempU = userId;
    console.log(tempU)

    // update the week base on the current day
    async function updateWeek (currentDate) {
        const weekStart = startOfWeek(currentDate);
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(day.getDate() + i);
            dates.push(day);
        }
        setDisplayDates(dates);

        const userId = tempU; // Example user ID
        // Fetch tasks asynchronously and then update state
        const fetchedTasks = await getTasksForWeek(dates, currentDate, userId);
        setCurrentWeek(fetchedTasks);
        // fetch the initial done tasks
        const initalDoneTasks = await getDoneTasks(dates, currentDate, userId);
        setDoneTasks(initalDoneTasks);
    };

    // first day of the week
    const startOfWeek = (date) => {
        const diff = date.getDate() - date.getDay();
        return new Date(date.setDate(diff));
    };

    async function fetchWeekTasks(userId, currentDate) {
        const url = `${process.env.REACT_APP_API_URL}/tasks/week/false?userid=${userId}&current_date=${formatDate(
            currentDate
        )}`;
        try {
            const response = await fetch(url, { method: "GET" });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const json = await response.json();
            return json;
        } catch (error) {
            console.error("Fetching week tasks failed: ", error);
            throw error; // Re-throw the error if you want calling code to handle it
        }
    }

    async function getTasksForWeek(weekDates, currentDate, userId) {
        try {
            const fetchedWeekTasks = await fetchWeekTasks(userId, currentDate);

            // Convert task due dates to local time
            fetchedWeekTasks.forEach((day) => {
                day.tasks.forEach((task) => {
                    console.log("Original due date:", task.task_due_date);
                    task.task_due_date = new Date(task.task_due_date).toLocaleString();
                    console.log("Local due date:", task.task_due_date);
                });
            });

            const tasksForWeek = weekDates.map((date) => {
                const jsDay = date.getDay() + 1; // Adjust JS day to match day IDs
                const dayTasks =
                    fetchedWeekTasks.find((day) => day._id === jsDay)?.tasks || [];

                
                return { date, tasks: dayTasks };
            });
    
            // Move tasks to the correct day if they are in the wrong day
            tasksForWeek.forEach(day => {
                day.tasks.forEach(task => {
                    const dueDate = new Date(task.task_due_date);
                    const taskDay = dueDate.getDay() + 1; // Adjust JS day to match day IDs
                    if (day.date.getDay() + 1 !== taskDay) {
                        // Remove task from current day and add it to the correct day
                        const correctDay = tasksForWeek.find(d => d.date.getDay() + 1 === taskDay);
                        if (correctDay) {
                            correctDay.tasks.push(task);
                            day.tasks.splice(day.tasks.indexOf(task), 1);
                        }
                    }
                }); 
            });
            
    
            // Sort tasks
            tasksForWeek.forEach(day => {
                day.tasks.sort((a, b) => new Date(a.task_due_date) - new Date(b.task_due_date));
            });

            // Get the start and end dates
            const weekStart = startOfWeek(weekDates[0]);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);

            // Filter out tasks whose due dates are outside of the current week
            tasksForWeek.forEach(day => {
                day.tasks = day.tasks.filter(task => {
                    const taskDueDate = new Date(task.task_due_date);
                    const isWithinWeek = weekDates.some(date => {
                        const currentDate = new Date(date);
                        return taskDueDate.getFullYear() === currentDate.getFullYear() &&
                            taskDueDate.getMonth() === currentDate.getMonth() &&
                            taskDueDate.getDate() === currentDate.getDate();
                    });
                    return isWithinWeek;
                });
            });

            return tasksForWeek;
        } catch (error) {
            console.error("Error in getTasksForWeek:", error);
            return [];
        }
    }

    async function fetchDoneTasks(userId, currentDate) {
        const url = `${process.env.REACT_APP_API_URL}/tasks/week/true?userid=${userId}&current_date=${formatDate(
            currentDate
        )}`;
        try {
            const response = await fetch(url, { method: "GET" });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const json = await response.json();
            return json;
        } catch (error) {
            console.error("Fetching week tasks failed: ", error);
            throw error; // Re-throw the error if you want calling code to handle it
        }
    }

    async function getDoneTasks(weekDates, currentDate, userId) {
        try {
            const fetchedDoneTasks = await fetchDoneTasks(userId, currentDate);
            const doneTasks = weekDates.map((date) => {
                const jsDay = date.getDay() + 1; // Adjust JS day to match day IDs
                const dayDoneTasks =
                    fetchedDoneTasks.find((day) => day._id === jsDay)?.tasks || [];
                return { date, tasks: dayDoneTasks };
            });
    
            // Filter out tasks whose due dates are outside of the current week
            doneTasks.forEach(day => {
                day.tasks = day.tasks.filter(task => {
                    const taskDueDate = new Date(task.task_due_date);
                    const isWithinWeek = weekDates.some(date => {
                        const currentDate = new Date(date);
                        return taskDueDate.getFullYear() === currentDate.getFullYear() &&
                            taskDueDate.getMonth() === currentDate.getMonth() &&
                            taskDueDate.getDate() === currentDate.getDate();
                    });
                    if (!isWithinWeek) {
                        console.log(`Removing task '${task.task_name}' due on '${task.task_due_date}' from ${day.date.toLocaleDateString()}`);
                    }
                    return isWithinWeek;
                });
            });
    
            return doneTasks;
        } catch (error) {
            console.error("Error in getDoneTasks:", error);
            return [];
        }
    }

    async function setTaskCompleteTrue(taskId) {
        const url = `${process.env.REACT_APP_API_URL}/tasks/true?taskid=${taskId}`;
        try {
            const response = await fetch(url, { method: "PUT" });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const json = await response.json();
            return json;
        } catch (error) {
            console.error("changing task complete to true failed with : ", error);
            throw error; // Re-throw the error if you want calling code to handle it
        }
    }

    async function setTaskCompleteFalse(taskId) {
        const url = `${process.env.REACT_APP_API_URL}/tasks/false?taskid=${taskId}`;
        try {
            const response = await fetch(url, { method: "PUT" });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const json = await response.json();
            return json;
        } catch (error) {
            console.error("changing task complete to false failed with : ", error);
            throw error; // Re-throw the error if you want calling code to handle it
        }
    }

    // previous week
    const goToPreviousWeek = () => {
        const newDate = new Date(
            displayDates[0].setDate(displayDates[0].getDate() - 7)
        );
        updateWeek(newDate);
    };

    // next week
    const goToNextWeek = () => {
        const newDate = new Date(
            displayDates[0].setDate(displayDates[0].getDate() + 7)
        );
        updateWeek(newDate);
    };

    const handleTaskCompletion = async (taskId) => {
        const taskIsDone = doneTasks.some((day) => day.tasks.some((task) => task._id === taskId));
        try {
            if (taskIsDone) {
                await setTaskCompleteFalse(taskId);
            } else {
                await setTaskCompleteTrue(taskId);
            }
            updateWeek(new Date());
        } catch (error) {
            console.error("Failed to change task completion status: ", error);
        }
    };

    const getMonthName = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long' });
      };

    return (
        <>
            <div className="bg-white px-4 max-w lg:mx-auto lg:px-8">
                <div className="flex flex-col mx-12">
                    <div className="flex flex-row space-x-10">
                        <p className="text-4xl font-bold text-gray-800">
                            {displayDates.length > 0 ? `${getMonthName(displayDates[0])} ${displayDates[0].getFullYear()}` : 'Loading...'}
                        </p>
                        <button
                            type="button"
                            className="-mt-1 py-3 px-8 text-md font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
                            onClick={() => {
                                fetchHealth(0);
                                setShowModal(true);
                            }}
                        >
                            Add Task
                        </button>
                    </div>

                    <AddExperienceModal
                        isOpen={showModal}
                        setShowModal={setShowModal}
                        reloadWeek={updateWeek}
                        userId={tempU}
                    />

                    <div className="flex space-x-1 mt-4">
                        <GoArrowLeft size={"30px"} onClick={() => { goToPreviousWeek(); fetchHealth(0); }} />
                        <button
                            type="button"
                            className="-mt-1 px-4 text-sm text-gray-900 focus:outline-none bg-white rounded-md border border-gray-200 hover:bg-gray-100"
                        >
                            Today
                        </button>

                        <GoArrowRight size={"30px"} onClick={() => { goToNextWeek(); fetchHealth(0); }} />
                    </div>
                </div>

                <div className="flex mt-8">
                    {displayDates.map((date, index) => {
                        const formattedDisplayDate = date
                            .toISOString()
                            .slice(0, 10);

                        // Find the corresponding day in currentWeek by comparing formatted dates
                        const dayTasks =
                            currentWeek.find(
                                (day) =>
                                    day.date.toISOString().slice(0, 10) ===
                                    formattedDisplayDate
                            )?.tasks || [];
                        return (
                            <div
                                key={index}
                                className={`flex-1 min-w-40 py-2 ${
                                    index !== 6 ? "border-r" : ""
                                }`}
                            >
                                <p className="text-xl text-center font-semibold mb-4">
                                    {date.toLocaleDateString("en-US", {
                                        weekday: "short",
                                        day: "numeric",
                                    })}
                                </p>
                                <div className="overflow-y-auto h-96 space-y-5 justify-center items-center">
                                    {dayTasks.map((task) => (
                                        <TaskCard
                                            key={task._id}
                                            {...task}
                                            onComplete={handleTaskCompletion}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div>
                    <div className="m-12">
                        <p className="text-xl font-semibold mb-4">Done</p>
                        <div className="flex overflow-x-scroll w-full space-x-1 py-3">
                        {doneTasks.map((doneTask) => 
                            doneTask.tasks.map((task) => (
                                <div key={task._id} className="max-w-[16rem] shrink-0">
                                <TaskCard
                                    {...task}
                                    onComplete={handleTaskCompletion}
                                    isComplete={task.task_completed}
                                />
                                </div>
                            ))
                        )}
                        </div>
                    </div>
                    <div className="m-12">
                        <p className="text-xl font-semibold mb-4 text-red-500">
                            Overdue
                        </p>
                        <div className="flex overflow-x-scroll w-full space-x-1 py-3">
                            {overdueTasks.map((task) => (
                                <div className="max-w-[16rem] shrink-0">
                                    <TaskCard
                                        key={task._id}
                                        {...task}
                                        onComplete={handleTaskCompletion}
                                        isComplete={task.task_completed}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WeekChart;
