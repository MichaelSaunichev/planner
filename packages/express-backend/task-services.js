import mongoose from "mongoose";
import taskModel from "./tasks.js";
import dotenv from "dotenv"

mongoose.set("debug", true);
dotenv.config()
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function getTask(id) {
    let promise;
    if (id === undefined) {
      promise = taskModel.find();
    } else {
      promise = findTaskByUserId(id);
    }
    return promise;
}

function setTaskTrue(taskId) {
  let promise;
  if (!taskId) {
    promise = Promise.reject(new Error('Task ID is required'));
  } else {
    promise = taskModel.findById(taskId)
      .then(task => {
        if (!task) {
          throw new Error('Task not found');
        }

        // Update task_completed field
        task.task_completed = true;

        // Save the updated task
        return task.save();
      });
  }
  return promise;
}

function setTaskFalse(taskId) {
  let promise;
  if (!taskId) {
    promise = Promise.reject(new Error('Task ID is required'));
  } else {
    promise = taskModel.findById(taskId)
      .then(task => {
        if (!task) {
          throw new Error('Task not found');
        }
        // Update task_completed field
        task.task_completed = false;
        // Save the updated task
        return task.save();
      });
  }
  return promise;
}

function getWeekTasksTrue(userId, currentDate){
    currentDate = new Date(currentDate);
    
    if (currentDate !== undefined && !(currentDate instanceof Date) || isNaN(currentDate)) {
      throw new Error("Invalid currentDate. Please provide a valid Date object.");
    }

    let promise;
    // Calculate the first Sunday from the current day
    const startOfWeek = new Date(currentDate);
  
   // console.log(startOfWeek.getDay())
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getUTCDay() - 1); // Set to the first day of the week (Sunday)

    // Calculate the end of the week (7 days later)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 9);

    // Define the aggregation pipeline
    const pipeline = [
        {
            $match: {
                userid: new mongoose.Types.ObjectId(userId),
                task_completed: true,
                task_due_date: {
                    $gte: startOfWeek,
                    $lt: endOfWeek
                }
            }
        },
        {
          $group: {
              _id: { $dayOfWeek: { date: "$task_due_date", timezone: "UTC" } },
              tasks: { $push: "$$ROOT" } // push documents into an array for each day
          }
      },
    ];

    promise = taskModel.aggregate(pipeline);
    return promise
}

function getWeekTasksFalse(userId, currentDate){
  currentDate = new Date(currentDate);
  
  if (currentDate !== undefined && !(currentDate instanceof Date) || isNaN(currentDate)) {
    throw new Error("Invalid currentDate. Please provide a valid Date object.");
  }

  let promise;
  // Calculate the first Sunday from the current day
  const startOfWeek = new Date(currentDate);

 // console.log(startOfWeek.getDay())
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getUTCDay() - 1); // Set to the first day of the week (Sunday)

  // Calculate the end of the week (7 days later)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 9);

  console.log("Start of the week:", startOfWeek.toISOString());
  console.log("End of the week:", endOfWeek.toISOString());

  // Define the aggregation pipeline
  const pipeline = [
      {
          $match: {
              userid: new mongoose.Types.ObjectId(userId),
              task_completed: false,
              task_due_date: {
                  $gte: startOfWeek,
                  $lt: endOfWeek
              }
          }
      },
      {
        $group: {
            _id: { $dayOfWeek: { date: "$task_due_date", timezone: "UTC" } },
            tasks: { $push: "$$ROOT" } // push documents into an array for each day
        }
    },
  ];

  promise = taskModel.aggregate(pipeline);

  promise.then(result => {
    // Log the result of the promise
    console.log("Promise result:");
    result.forEach(item => {
        console.log(JSON.stringify(item, null, 2));
    });
    }).catch(error => {
        // Log any errors that occur during promise execution
        console.error("Promise error:", error);
    });
  
  return promise;
}

function findTaskByUserId(id) {
    return taskModel.find({ userid: id });
  }

function addTask(task) {
    const taskToAdd = new taskModel(task);
    const promise = taskToAdd.save();
    return promise;
}

export default {
    addTask,
    getWeekTasksTrue,
    getWeekTasksFalse,
    getTask,
    findTaskByUserId,
    setTaskFalse,
    setTaskTrue,
  };