export default function WorkingWithObjects(app) {
  // Assignment object
  const assignment = {
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  };

  // Module object with id, name, description, and course
  const module = {
    id: "CS101",
    name: "Introduction to Computer Science",
    description: "Learn the fundamentals of programming",
    course: "Computer Science",
  };

  // Get assignment
  app.get("/lab5/assignment", (req, res) => {
    res.json(assignment);
  });

  // Update assignment title
  app.get("/lab5/assignment/title/:newTitle", (req, res) => {
    const { newTitle } = req.params;
    assignment.title = newTitle;
    res.json(assignment);
  });

  // Update assignment score
  app.get("/lab5/assignment/score/:newScore", (req, res) => {
    const { newScore } = req.params;
    assignment.score = parseInt(newScore);
    res.json(assignment);
  });

  // Update assignment completed status
  app.get("/lab5/assignment/completed/:completed", (req, res) => {
    const { completed } = req.params;
    assignment.completed = completed === "true";
    res.json(assignment);
  });

  // Get module - responds with full module object
  app.get("/lab5/module", (req, res) => {
    res.json(module);
  });

  // Get module name only - this must come BEFORE the update route
  app.get("/lab5/module/name", (req, res) => {
    res.json(module.name);
  });

  // Update module name
  app.get("/lab5/module/name/:newName", (req, res) => {
    const { newName } = req.params;
    module.name = newName;
    res.json(module);
  });

  // Get module description
  app.get("/lab5/module/description", (req, res) => {
    res.json(module.description);
  });

  // Update module description
  app.get("/lab5/module/description/:newDescription", (req, res) => {
    const { newDescription } = req.params;
    module.description = newDescription;
    res.json(module);
  });
}