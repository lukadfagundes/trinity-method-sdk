# API Endpoint Map Diagram Template

<!--
  This template generates a Mermaid flowchart showing API resource hierarchy.

  Variables:
  - {{RESOURCES}}: Resource definitions with endpoints
  - {{BASE_PATH}}: API base path (e.g., "/api/v1", "/api")

  Usage: Replace variables with actual API structure before writing to docs/images/

  Example RESOURCES format (Mermaid flowchart syntax):
    API[{{BASE_PATH}}]
    Users[Users]
    Auth[Authentication]
    Orders[Orders]

    API --> Users

    API --> Auth
    API --> Orders

    Users --> GetUsers[GET /users]
    Users --> CreateUser[POST /users]
    Users --> GetUser[GET /users/:id]

    Auth --> Login[POST /auth/login]
    Auth --> Logout[POST /auth/logout]

-->

```mermaid
flowchart TD
{{RESOURCES}}
```

## Description

This API endpoint map provides a visual overview of the application's REST API structure:

- **Base Path**: {{BASE_PATH}}
- **Resource Groups**: Logical groupings of related endpoints
- **HTTP Methods**: GET (retrieve), POST (create), PUT/PATCH (update), DELETE (remove)

**Benefits:**

- Quickly understand available API resources
- Identify endpoint patterns and conventions
- Plan new endpoint additions
- Visualize API surface area for documentation

**Navigation:**

- Top level shows the base API path
- Second level shows resource categories
- Third level shows individual endpoints with HTTP methods
