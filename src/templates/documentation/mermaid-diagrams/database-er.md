# Database Entity-Relationship Diagram Template

<!--
  This template generates a Mermaid ER diagram showing database schema structure.

  Variables:
  - {{ENTITIES}}: Entity definitions in Mermaid ER syntax
  - {{RELATIONSHIPS}}: Relationship definitions between entities

  Usage: Replace variables with actual schema structure before writing to docs/images/

  Example ENTITIES format:
    USER {
      int id PK
      string email UK
      string password
      datetime created_at
    }
    ORDER {
      int id PK
      int user_id FK
      decimal total
      string status
    }

  Example RELATIONSHIPS format:
    USER ||--o{ ORDER : places
-->

```mermaid
erDiagram
{{ENTITIES}}
{{RELATIONSHIPS}}
```

## Description

This entity-relationship diagram shows the database schema structure for the application, including:

- **Entities**: Tables/collections with their fields and types
- **Relationships**: How entities relate to each other (one-to-one, one-to-many, many-to-many)
- **Keys**: Primary keys (PK), foreign keys (FK), and unique keys (UK)

Understanding these relationships is essential for:

- Writing efficient queries
- Maintaining data integrity
- Planning schema migrations
- Optimizing database performance
