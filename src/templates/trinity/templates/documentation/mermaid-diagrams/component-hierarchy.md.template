# Component Hierarchy Diagram Template

<!--
  This template generates a Mermaid flowchart showing frontend component tree structure.

  Variables:
  - {{COMPONENT_GROUPS}}: Component definitions and relationships
  - {{ROOT_COMPONENT}}: Root/App component name

  Usage: Replace variables with actual component structure before writing to docs/images/

  Example COMPONENT_GROUPS format (Mermaid flowchart syntax):
    App[App]
    Layout[Layout]
    Header[Header]
    Navigation[Navigation]
    Content[Content]
    HomePage[HomePage]
    UserList[UserList]
    UserCard[UserCard]

    App --> Layout

    Layout --> Header
    Layout --> Content
    Header --> Navigation
    Content --> HomePage
    HomePage --> UserList
    UserList --> UserCard

-->

```mermaid
flowchart TD
{{COMPONENT_GROUPS}}
```

## Description

This component hierarchy diagram illustrates the structure of the frontend application's component tree:

- **Root Component**: {{ROOT_COMPONENT}} (entry point)
- **Layout Components**: Structural components (headers, footers, navigation)
- **Page Components**: Top-level views and routes
- **Feature Components**: Reusable UI elements and widgets

**Understanding the Hierarchy:**

- Parent components pass props and context to children
- Data flows down the tree
- Events bubble up from children to parents
- Shared components may appear in multiple branches

**Benefits:**

- Understand component relationships and dependencies
- Plan component refactoring and extraction
- Identify opportunities for component reuse
- Visualize state management flow
- Plan testing strategy (test leaf components first)
