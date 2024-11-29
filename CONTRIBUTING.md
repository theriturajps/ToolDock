# Contributing to the project

Thanks for sharing your interesting in contributing to the project! 🎉

Any advice, request or report can be written in the [issues](https://github.com/theriturajps/tool-store/issues) section of the project.

## Getting Started

This project is built with **Node**.

### Environment Variables

Create a file named `.env` in the root directory of the project. This file should contain the following environment variables:

```
MONGODB_URI=
JWT_SECRET=
PORT=
```

### Implemention

- Edit Tool Actions
- UI

### Project Structure
Inside your project, you'll see the following directory structure:

```
|- .env
|- CONTRIBUTING.md
|- package-lock.json
|- package.json
|- README.md
|- vercel.json
│   
├───backend
│   |- server.js
│   │   
│   ├───middleware
│   │   |- auth.js
│   │
│   ├───models
│   │  	|- tool.js
│   │  	|- user.js
│   │
│   └───routes
│       |- auth.js
│       |- tools.js
│
└───frontend
    |- add-tool.html
    |- index.html
    |- login.html
    |- signup.html
    │
    ├───css
    │   |- styles.css
    │
    └───js
      	|- add-tool.js
      	|- index.js
      	|- login.js
      	|- signup.j
```

## How to Contribute

1. Fork the repository
2. Clone the repository to your local machine
3. Create a new branch

```
 git checkout -b <branch-name>
```

4. Make your changes
5. Commit and push your changes

```
 git add .
 git commit -m "commit message"
 git push origin <branch-name>
```

6. Create a pull request
7. Wait for the pull request to be reviewed and merged