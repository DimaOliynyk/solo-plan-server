**Authentication and User Management**

*POST /register*
  Purpose: Register a new user
  Request Body (JSON):
    username: string (unique)
    password: string
    any additional fields defined on the User model
  Flow:
    Check if username already exists → 409 Conflict with message "This username is already in use."
    Hash password with bcrypt (salt rounds = 12)
    Create new user with {...req.body, password: hashedPassword}
    Generate JWT with payload {_id: newUser._id}, signed with process.env.JWT_SECRET, expires in 7 days
    Save the new user
  Successful response:
    Status: 200 OK (default)
    Body: { user: , token: , message: "Registration successful!" }
  Errors:
    500 for server errors
*POST /login*
  Purpose: User login
  Request Body (JSON):
    username: string
    password: string
  Flow:
    Find user by username
    Validate password via user.validPassword(req.body.password)
    If invalid → 400 Bad Request with message "invalid credentials"
    Generate JWT with payload {_id: user._id}, expires in 7 days
  Successful response:
    Body: { user: , token: , message: "Login is successful!" }
  Errors:
  500 for server errors

**User Information**

*GET /me*
    Purpose: Retrieve the current authenticated user, including related tasks
    Middleware: auth (ensures user is authenticated and sets req.user)
  Flow:
    Find user by req.user._id and populate("tasks")
    If not found → 409 Conflict with message "This user doesn't exist."
  Successful response:
    Body: { user: }
    Errors:
    500 for server errors
   
**Task Management**

*GET / (authenticated)*
    Purpose: Retrieve all tasks for the currently authenticated user
    Middleware: auth
  Flow:
    userId = req.user._id
    Find tasks where author equals userId
  Successful response:
    Body: [ { Task1 }, { Task2 }, ... ]
    
*POST / (authenticated)*
    Purpose: Create a new task
    Request Body (JSON): task fields as defined by Task model (e.g., date, title, etc.)
  Flow:
    Extract date from req.body
    If date is before today, return 402 with message "You can't add task to previous date!"
    Create new task with {...req.body, author: req.user.id}
    Push newTask into req.user.tasks and save the user
  Successful response:
    Body: { author: , task: , message: "Task created successful!" }
    
*DELETE /:id (authenticated)*
    Purpose: Delete a task by ID
  Flow:
    Find task by id
    If not found → 404 with "Transaction not found" (note: terminology uses "Transaction" in code)
    Delete task via Task.findByIdAndDelete(id)
  Successful response:
    Body: { task: , message: "Transaction deleted and balance updated successfully" }
    Errors:
    500 for server errors
    
*PATCH /:id/complete (authenticated)*
    Purpose: Toggle task completion status
  Flow:
    Find task by id
    If not found → 404 with "Task not found"
    If task.isCompleted is true, set to false; else set to true
    Save task
  Successful response:
    Body: { task: , message: "Task status is changed successfully" }
    Errors:
    500 for server errors
