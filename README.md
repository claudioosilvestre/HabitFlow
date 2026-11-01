# HabitFlow

**HabitFlow** is a full-stack habit tracking application that helps users build consistency, organize their daily routines, and monitor their progress over time. Users can create and manage habits, define priorities and durations, track daily completion, and review their habit records.

The application was developed as a portfolio project to strengthen full-stack development skills using the .NET ecosystem, TypeScript, and SQL Server, with a focus on clean architecture, separation of concerns, and maintainable code.

## Tech Stack

- **Backend:** .NET 8, C#, ASP.NET Core Web API
- **Frontend:** HTML5, CSS3, TypeScript
- **Database:** Microsoft SQL Server
- **ORM:** Entity Framework Core
- **Architecture:** Clean Architecture
- **Testing:** xUnit

## Getting Started

### Prerequisites

- .NET 8 SDK installed
- SQL Server installed and running
- Entity Framework Core tools installed
- Node.js and npm installed
- An IDE or code editor (Visual Studio, VS Code, or Rider recommended)

### How to Run

1. **Clone the repository:**

```bash
git clone <repository-url>
cd HabitFlow
```

2. **Configure the Database:**

Configure the `DefaultConnection` connection string using .NET User Secrets or your preferred configuration provider.

Example connection string:

```text
Server=localhost,1433;Database=HabitFlowDb;User Id=sa;Password=your_password;TrustServerCertificate=True;
```

3. **Run the Backend:**

Navigate to the API project and start the application:

```bash
cd backend/HabitFlow.Api
dotnet run
```

4. **Run the Frontend:**

Navigate to the frontend directory and install the dependencies:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Open the local development URL provided by the development server.

> Note: Database migrations are managed through Entity Framework Core.

## Features

- **Habit Management:** Create, retrieve, update, and delete habits.
- **Habit Priorities:** Assign priorities to habits (Low, Medium, High, and Urgent).
- **Duration Tracking:** Optionally define how much time a habit should take.
- **Habit Scheduling:** Set start dates and optional end dates for habits.
- **Habit Records:** Create and manage daily records for individual habits.
- **Completion Tracking:** Track daily habit states (Pending, Completed, and NotCompleted).
- **Record History:** Retrieve habit records by habit or date.
- **Habit Descriptions:** Add optional descriptions to habits and individual records.
- **Frontend Integration:** TypeScript frontend communicating with the ASP.NET Core Web API.

## Technical Highlights

- **Clean Architecture:** Separation of responsibilities across Domain, Application, Infrastructure, and API layers.
- **Domain Validation:** Business rules and validation encapsulated within domain entities.
- **Entity Framework Core:** Database persistence and entity relationships managed through EF Core.
- **Repository Pattern:** Dedicated repositories for habit and habit record operations.
- **Unit of Work:** Coordinated persistence operations through a Unit of Work abstraction.
- **DTOs and Converters:** Separation between domain entities and API request/response models.
- **Global Exception Handling:** Centralized exception handling using ASP.NET Core's `IExceptionHandler` and Problem Details responses.
- **Dependency Injection:** Application services, repositories, converters, and database context registered through the built-in dependency injection container.
- **CORS Configuration:** Configured cross-origin access for frontend-backend communication.
- **Unit Testing:** Automated tests covering domain validation and application business rules.

## Future Improvements

- Habit history visualization and filtering.
- Additional frontend validation and error handling.
- Integration and API controller tests.
- User authentication and personal habit management.
- Responsive UI improvements.

## Author

**Cláudio Silvestre** — [LinkedIn](https://www.linkedin.com/in/claudioosilvestre)