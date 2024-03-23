// backend.js
import express from "express";
import cors from "cors";
import userServices from "./user-services.js";
import taskServices from "./task-services.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World test!");
});

app.get("/test", (req, res) => {
  res.send(`Process ENV Port: ${process.env.PORT}`);
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const serverStatus = 'ok';
  const databaseStatus = await userServices.checkMongoConnection();
  res.json({ serverStatus, databaseStatus });
});

app.get("/users", (req, res) => {
  const name = req.params["name"];
  userServices.getUsers(name)
  .then( result => {
    if (result.length > 0) {
        res.status(200).send({ user: result });
      } else {
        res.status(404).send("Resources not found.");
      }
  }).catch( err => { 
    res.status(500).send("Internal Server Error.")
  })
});

app.get("/tasks", (req, res) => { 
  const userid = req.query.userid;
  taskServices.getTask(userid)
  .then( result => {
    if (result.length > 0) {
        res.status(200).send({ task: result });
      } else {
        res.status(404).send("Resources not found.");
      }
  }).catch( err => { 
    res.status(500).send("Internal Server Error.")
  })
});

app.get("/tasks/week/true", (req, res) => {
  const userid = req.query.userid;
  const current_date = req.query.current_date;
  taskServices.getWeekTasksTrue(userid, current_date)
  .then(result => {
    res.status(200).send(result);
  }).catch(err => { 
    res.status(500).send("Internal Server Error.");
  });
});

app.get("/tasks/week/false", (req, res) => {
  const userid = req.query.userid;
  const current_date = req.query.current_date;
  taskServices.getWeekTasksFalse(userid, current_date)
  .then(result => {
    res.status(200).send(result);
  }).catch(err => { 
    res.status(500).send("Internal Server Error.");
  });
});


app.put("/tasks/true", (req, res) => {
  const taskid = req.query.taskid;
  taskServices.setTaskTrue(taskid)
    .then(updatedTask => {
      res.status(200).send(updatedTask);
    })
    .catch(error => {
      if (error.message === 'Task ID is required') {
        res.status(400).send("Task ID is required.");
      } else if (error.message === 'Task not found') {
        res.status(404).send("Task not found.");
      } else {
        console.log(error)
        res.status(500).send("Internal Server Error.");
      }
    });
});

app.put("/tasks/false", (req, res) => {
  const taskid = req.query.taskid;
  taskServices.setTaskFalse(taskid)
    .then(updatedTask => {
      res.status(200).send(updatedTask);
    })
    .catch(error => {
      if (error.message === 'Task ID is required') {
        res.status(400).send("Task ID is required.");
      } else if (error.message === 'Task not found') {
        res.status(404).send("Task not found.");
      } else {
        console.log(error)
        res.status(500).send("Internal Server Error.");
      }
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userServices.addUser(userToAdd)
  .then( result => {
    if (result) {
      res.status(201).send(result);
    } else {
      res.status(404).send("Resources not found.");
    }
  }).catch( err => {
    res.status(500).send("Internal Server Error.")
  })
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Query the database to find the user with the provided credentials
  const user = await userServices.getUser( username, password );

  if (user) {
    res.status(200).json({ userId: user._id });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

app.post("/tasks", (req, res) => {
  const taskToAdd = req.body;
  taskServices.addTask(taskToAdd)
  .then( result => {
    if (result) {
      res.status(201).send(taskToAdd);
    } else {
      res.status(404).send("Resources not found.");
    }
  }).catch( err => {
    res.status(500).send("Internal Server Error.")
  })
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; 
  userServices.findUserById(id)
  .then( result => {
    if (result.length > 0) {
      res.status(200).send({ user : result})
    } else {
      res.status(404).send("Resource not found.")
    }
  }).catch( err => {
    res.status(500).send("Internal Server Error.")
  })
}); 

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});