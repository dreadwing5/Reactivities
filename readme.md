# Reactivities

## Table of Contents

- [Reactivities](#reactivities)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [1. Clone the Repository](#1-clone-the-repository)
  - [Folder Structure](#folder-structure)
    - [Backend (`API`, `Application`, `Domain`, `Persistence`, `Infrastructure`)](#backend-api-application-domain-persistence-infrastructure)
    - [Frontend (`client-app`)](#frontend-client-app)
  - [Technologies and Libraries](#technologies-and-libraries)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Learning Resources](#learning-resources)
    - [Complete Guide to Building an App with .NET Core and React](#complete-guide-to-building-an-app-with-net-core-and-react)
    - [Student Assets](#student-assets)
    - [Documentation](#documentation)
  - [Contributing](#contributing)
  - [License](#license)

## Introduction

**Reactivities** is a project designed to help developers learn and implement Clean Architecture principles using .NET Core for the backend and React with TypeScript for the frontend. This project serves as a hands-on guide to building scalable and maintainable applications by separating concerns and ensuring a clear separation of layers.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **.NET 8.0 SDK**: [Download .NET](https://dotnet.microsoft.com/download)
- **Node.js (v14 or later)**: [Download Node.js](https://nodejs.org/)
- **Git**: [Download Git](https://git-scm.com/downloads)
- **Visual Studio 2022 or VS Code**: [Download Visual Studio](https://visualstudio.microsoft.com/) | [Download VS Code](https://code.visualstudio.com/)
- **pnpm**: [Install pnpm](https://pnpm.io/installation) 🚀
- **Postman**: [Download Postman](https://www.postman.com/downloads/) for API testing

We use pnpm instead of yarn or npm because:

- 🏎️ It's faster and more efficient
- 💾 It saves disk space with a single package storage
- 🔒 It provides better security with stricter dependency resolution
- 🌳 It has a simpler and more predictable dependency tree

## Installation

Follow these steps to set up the project locally.

### 1. Clone the Repository

The frontend will be available at `http://localhost:5173` by default.

## Folder Structure

Here's an overview of the project's structure:

### Backend (`API`, `Application`, `Domain`, `Persistence`, `Infrastructure`)

```
Reactivities/
│
├── API/
│ ├── Controllers/
│ │ ├── ActivitiesController.cs
│ │ ├── AccountController.cs
│ │ ├── BaseApiController.cs
│ │ └── ...
│ ├── DTOs/
│ │ ├── ActivityDto.cs
│ │ ├── AttendeeDto.cs
│ │ ├── LoginDto.cs
│ │ ├── RegisterDto.cs
│ │ └── ...
│ ├── Middleware/
│ │ └── ExceptionMiddleware.cs
│ ├── Extensions/
│ │ ├── ApplicationServiceExtensions.cs
│ │ ├── IdentityServiceExtensions.cs
│ │ └── ...
│ ├── Services/
│ │ ├── TokenService.cs
│ │ └── ...
│ ├── Program.cs
│ └── ...
│
├── Application/
│ ├── Activities/
│ │ ├── Create.cs
│ │ ├── Details.cs
│ │ ├── Delete.cs
│ │ ├── Edit.cs
│ │ ├── List.cs
│ │ ├── UpdateAttendance.cs
│ │ └── ...
│ ├── Core/
│ ├── Interfaces/
│ └── ...
│
├── Domain/
│ ├── Activity.cs
│ ├── ActivityAttendee.cs
│ ├── AppUser.cs
│ └── ...
│
├── Persistence/
│ ├── DataContext.cs
│ ├── Migrations/
│ └── ...
│
├── Infrastructure/
│ ├── Security/
│ │ ├── IsHostRequirement.cs
│ │ └── UserAccessor.cs
│ └── ...
│
├── client-app/
│ ├── src/
│ ├── public/
│ ├── package.json
│ ├── tsconfig.json
│ └── ...
│
├── Repositories.sln
└── ...

```

### Frontend (`client-app`)

```

client-app/
│
├── src/
│ ├── app/
│ │ ├── stores/
│ │ ├── layout/
│ │ ├── router/
│ │ └── ...
│ ├── components/
│ ├── pages/
│ ├── index.html
│ ├── main.tsx
│ └── ...
│
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── ...

```

## Technologies and Libraries

### Backend

- **.NET 8.0 Core**: Framework for building the API.
- **Entity Framework Core**: ORM for database interactions.
  - **SQLite**: Database provider.
- **MediatR**: Implements the Mediator pattern for CQRS.
- **AutoMapper**: Object-object mapping.
- **FluentValidation**: Input validation library.
- **Serilog**: Logging framework.
- **ASP.NET Core Identity**: Authentication and authorization.
- **Clean Architecture Principles**: Ensures separation of concerns and maintainability.

### Frontend

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript.
- **Vite**: Fast frontend build tool.
- **Semantic UI React**: UI component framework.
- **MobX**: State management library.
- **React Router DOM**: Routing library for React.
- **Formik**: Form management.
- **Yup**: Schema validation.
- **Axios**: Promise-based HTTP client.
- **React Toastify**: Notification library.

## Learning Resources

This project is developed alongside Neil Cumming's course.

### [Complete Guide to Building an App with .NET Core and React](https://www.udemy.com/course/complete-guide-to-building-an-app-with-net-core-and-react)

This course covers building full-stack applications using .NET Core for the backend and React for the frontend, focusing on Clean Architecture principles.

### Student Assets

In the `StudentAssets/` folder, you'll find :

- Useful code snippets
- Postman collections for API testing

### Documentation

The `docs/` folder in this project contains additional documentation, including:

- Useful learning tips and tricks
- Project-specific guides
- Any other relevant information for developers working on this project

This documentation will be regularly updated to reflect new insights and best practices learned throughout the development process.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
