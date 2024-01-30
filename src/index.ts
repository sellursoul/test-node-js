import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

interface Job {
  id: string;
  name: string;
}

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

const db = {
  jobs: [
    { id: "1", name: "Doctor" },
    { id: "2", name: "Developer" },
    { id: "3", name: "Lawyer" },
    { id: "4", name: "Teacher" },
  ],
};

app.get("/jobs", (req: Request, res: Response) => {
  let filteredJobs = db.jobs;

  if (req.query.name) {
    filteredJobs = filteredJobs.filter(
      (item: Job) =>
        item.name.toLowerCase().indexOf(req.query.name as string) > -1
    );
  }

  res.json(filteredJobs);
});

app.get("/jobs/:id", (req: Request, res: Response) => {
  const myJob = db.jobs.find((item: Job) => item.id === req.params.id);

  if (!myJob) {
    res.sendStatus(404);
    return;
  }
  res.json(myJob);
});

app.post("/jobs", (req: Request, res: Response) => {
  if (!req.body.name) {
    res.sendStatus(400);
    return;
  }

  const createdJob: Job = {
    id: String(+new Date()),
    name: req.body.name,
  };

  db.jobs.push(createdJob);
  res.status(201).json(createdJob);
});

app.delete("/jobs/:id", (req: Request, res: Response) => {
  db.jobs = db.jobs.filter((item: Job) => item.id !== req.params.id);

  if (!req.params.id) {
    res.sendStatus(404);
    return;
  }
  res.sendStatus(204);
});

app.put("/jobs/:id", (req: Request, res: Response) => {
  if (!req.body.name) {
    res.sendStatus(400);
    return;
  }

  let myJob = db.jobs.find((item: Job) => item.id === req.params.id);
  console.log(myJob);

  if (!myJob) {
    console.log(myJob);
    res.sendStatus(404);
    return;
  }

  myJob.name = req.body.name;
  res.status(204).json(myJob);
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
