# Complete Source Code Reference

Full documentation of all files in the DevGraph application.

## Project Overview

**DevGraph** is a developer knowledge and collaboration graph database application built with:
- **Frontend/Backend:** Next.js 16 with TypeScript
- **Database:** CognoDB / Neo4j (graph database)
- **Styling:** Tailwind CSS
- **Visualization:** react-force-graph-2d

---

## Directory Structure

```
cognodb-app/
├── app/                              # Next.js App Router
├── components/                       # React components
├── lib/                             # Utilities & database queries
├── public/                          # Static assets
├── scripts/                         # Database seeding
├── docs/                            # Documentation
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.mjs              # Tailwind CSS config
├── next.config.ts                   # Next.js config
├── eslint.config.mjs                # ESLint config
├── postcss.config.mjs               # PostCSS config
├── .env.example                     # Environment template
└── README.md                        # Main documentation
```

---

## Core Application Files

### 1. Root Configuration Files

#### `package.json`
- **Purpose:** Project metadata and dependencies
- **Key scripts:**
  - `dev` - Start development server
  - `build` - Production build
  - `start` - Run production server
  - `seed` - Populate database with sample data
  - `lint` - Run ESLint
- **Dependencies:**
  - `next` - React framework
  - `neo4j-driver` - Database client
  - `react-force-graph-2d` - Graph visualization
  - `tailwindcss` - CSS framework
  - `lucide-react` - Icon library

#### `tsconfig.json`
- **Purpose:** TypeScript compiler configuration
- **Key settings:**
  - Target: ES2020
  - Lib: ES2020, DOM
  - Module: ESNext
  - Strict mode enabled
  - Path aliases: `@/` maps to `./`

#### `next.config.ts`
- **Purpose:** Next.js framework configuration
- **Key settings:**
  - React 19 compatible
  - TypeScript enabled
  - SWC compiler (faster builds)

#### `tailwind.config.mjs`
- **Purpose:** Tailwind CSS customization
- **Features:**
  - Default color palette
  - Custom spacing scale
  - Extended configuration for theme

#### `postcss.config.mjs`
- **Purpose:** CSS post-processing pipeline
- **Plugins:**
  - Tailwind CSS processor

#### `eslint.config.mjs`
- **Purpose:** Code quality & style rules
- **Extends:** Next.js ESLint config

#### `.env.example`
- **Purpose:** Template for environment variables
- **Contains:**
  - `COGNODB_URI` - Database connection string
  - `COGNODB_USERNAME` - Database username
  - `COGNODB_PASSWORD` - Database password

---

## Application Structure (`/app`)

### 2. Layout & Root Pages

#### `app/layout.tsx`
- **Purpose:** Root layout component wrapping all pages
- **Features:**
  - HTML metadata (charset, viewport)
  - Font loading (Inter)
  - Global CSS imports
  - Navigation sidebar
  - Tailwind CSS setup
- **Children:** All pages inherit this layout

#### `app/globals.css`
- **Purpose:** Global styles
- **Contains:**
  - Tailwind CSS directives
  - Reset styles
  - Custom global rules

#### `app/page.tsx`
- **Purpose:** Dashboard / home page
- **Features:**
  - Real-time statistics
  - 4 metric cards (developers, projects, technologies, relationships)
  - Fetches from `/api/stats`
  - Links to main sections
  - Error & loading states
- **Data source:** `lib/queries/stats.ts`

### 3. Page Routes

#### `app/developers/page.tsx`
- **Purpose:** Developer search page
- **Features:**
  - Search input for developers
  - Results list with pagination
  - Developer cards with basic info
  - Links to individual profiles
- **API:** `GET /api/developers?search=<term>`

#### `app/developers/[id]/page.tsx`
- **Purpose:** Individual developer profile page
- **Features:**
  - Developer details (role, location, bio, avatar)
  - Technologies they know (skill badges)
  - Projects they've worked on
  - Collaborators (auto-computed)
  - Back link to search
- **API:** `GET /api/developers/[id]`

#### `app/projects/page.tsx`
- **Purpose:** Projects listing page
- **Features:**
  - All projects in a grid or list
  - Project status (Active/Completed)
  - Year and description preview
  - Click to view details
- **API:** `GET /api/projects`

#### `app/projects/[id]/page.tsx`
- **Purpose:** Individual project detail page
- **Features:**
  - Project info (name, description, status, year)
  - Team members (all developers involved)
  - Technology stack
  - Links to individual developers/techs
- **API:** `GET /api/projects/[id]`

#### `app/technologies/page.tsx`
- **Purpose:** Technologies catalog page
- **Features:**
  - All technologies grouped by category
  - Category badges
  - Search/filter capability
  - Click to view adoption details
- **API:** `GET /api/technologies`

#### `app/technologies/[id]/page.tsx`
- **Purpose:** Individual technology detail page
- **Features:**
  - Technology info (name, category)
  - Developers who know it
  - Projects using it
  - Related technologies (learning path)
  - Recommended learners (engineers who should learn this)
- **API:** `GET /api/technologies/[id]`

#### `app/graph/page.tsx`
- **Purpose:** Interactive graph visualization page
- **Features:**
  - Force-directed graph rendering
  - Drag-and-drop interaction
  - Node color coding:
    - Blue: Developers
    - Green: Projects
    - Purple: Technologies
  - Click nodes for details
  - Physics simulation for automatic layout
- **API:** `GET /api/graph`

### 4. API Routes

#### `app/api/stats/route.ts`
- **Purpose:** Dashboard statistics endpoint
- **Method:** GET
- **Response:** 
  ```json
  {
    "success": true,
    "data": {
      "developers": 20,
      "projects": 12,
      "technologies": 20,
      "relationships": 127
    }
  }
  ```
- **Query:** `lib/queries/stats.ts` → `getStats()`
- **Performance:** ~50-100ms

#### `app/api/developers/route.ts`
- **Purpose:** List/search developers
- **Method:** GET
- **Parameters:**
  - `search` (optional): Filter by name
- **Response:** Array of Developer objects
- **Query:** `lib/queries/developers.ts` → `getDevelopers(searchTerm)`

#### `app/api/developers/[id]/route.ts`
- **Purpose:** Get single developer with all connections
- **Method:** GET
- **Parameters:**
  - `id`: Developer ID (e.g., "dev-1")
- **Response:**
  ```json
  {
    "developer": { ... },
    "technologies": [ ... ],
    "projects": [ ... ],
    "collaborators": [ ... ]
  }
  ```
- **Query:** `lib/queries/developers.ts` → `getDeveloperById(id)`

#### `app/api/projects/route.ts`
- **Purpose:** List all projects
- **Method:** GET
- **Response:** Array of Project objects
- **Query:** `lib/queries/projects.ts` → `getProjects()`

#### `app/api/projects/[id]/route.ts`
- **Purpose:** Get single project with team and tech
- **Method:** GET
- **Parameters:**
  - `id`: Project ID (e.g., "proj-1")
- **Response:**
  ```json
  {
    "project": { ... },
    "developers": [ ... ],
    "technologies": [ ... ]
  }
  ```
- **Query:** `lib/queries/projects.ts` → `getProjectById(id)`

#### `app/api/technologies/route.ts`
- **Purpose:** List all technologies
- **Method:** GET
- **Response:** Array of Technology objects
- **Query:** `lib/queries/technologies.ts` → `getTechnologies()`

#### `app/api/technologies/[id]/route.ts`
- **Purpose:** Get single technology with ecosystem
- **Method:** GET
- **Parameters:**
  - `id`: Technology ID (e.g., "tech-3")
- **Response:**
  ```json
  {
    "technology": { ... },
    "developers": [ ... ],
    "projects": [ ... ],
    "relatedTechnologies": [ ... ]
  }
  ```
- **Query:** `lib/queries/technologies.ts` → `getTechnologyById(id)`

#### `app/api/recommendations/route.ts`
- **Purpose:** Get developer recommendations for a technology
- **Method:** POST
- **Request body:**
  ```json
  {
    "technologyName": "React"
  }
  ```
- **Response:** Array of Recommendation objects
  ```json
  [
    {
      "developer": { ... },
      "knownTechnologies": [ ... ],
      "targetTechnology": { ... }
    }
  ]
  ```
- **Query:** `lib/queries/developers.ts` → `getDeveloperRecommendations(technologyName)`
- **Logic:** Multi-hop traversal to find developers who know related techs

#### `app/api/graph/route.ts`
- **Purpose:** Get graph data for visualization
- **Method:** GET
- **Response:**
  ```json
  {
    "nodes": [
      {
        "id": "n123",
        "label": "Alice Smith",
        "type": "Developer",
        ...
      }
    ],
    "links": [
      {
        "source": "n123",
        "target": "n456",
        "type": "KNOWS"
      }
    ]
  }
  ```
- **Query:** `lib/queries/graph.ts` → `getGraphData()`
- **Limit:** 150 nodes (prevents browser overload)

---

## Components (`/components`)

### Layout Components

#### `components/layout/Sidebar.tsx`
- **Purpose:** Main navigation sidebar
- **Features:**
  - DevGraph logo/branding
  - Navigation links to:
    - Dashboard
    - Developers
    - Projects
    - Technologies
    - Graph Explorer
  - Active link highlighting
  - Responsive design (collapses on mobile)

### UI Components

#### `components/ui/Loading.tsx`
- **Purpose:** Loading spinner component
- **Usage:** Shown while data is fetching
- **Features:**
  - Centered spinner animation
  - "Loading..." text
  - Consistent with design system

#### `components/ui/ErrorMessage.tsx`
- **Purpose:** Error state component
- **Usage:** Shown when API calls fail
- **Features:**
  - Error icon
  - Error message display
  - "Retry" button to refetch data
  - Professional error styling

---

## Database & Queries (`/lib`)

### Connection Management

#### `lib/neo4j.ts`
- **Purpose:** Neo4j driver initialization and management
- **Exports:**
  - `getDriver()` - Get singleton driver instance
  - `closeDriver()` - Gracefully close connection
- **Features:**
  - Singleton pattern (single driver per app)
  - Automatic auth setup from environment
  - Connection pooling built-in
- **Config:**
  - Driver URI from `COGNODB_URI`
  - Auth from `COGNODB_USERNAME` / `COGNODB_PASSWORD`

### Query Modules

#### `lib/queries/types.ts`
- **Purpose:** TypeScript type definitions
- **Exports:**
  - `Developer` - Developer node type
  - `Project` - Project node type
  - `Technology` - Technology node type
  - `GraphNode` - Generic graph node
  - `GraphLink` - Relationship edge
  - `Recommendation` - Recommendation result

#### `lib/queries/utils.ts`
- **Purpose:** Query utility functions
- **Exports:**
  - `sanitizeNode()` - Convert Neo4j node to plain object
  - Error handling utilities
  - Response formatting

#### `lib/queries/stats.ts`
- **Purpose:** Dashboard statistics queries
- **Exports:**
  - `getStats()` - Get aggregate counts
- **Query:**
  ```cypher
  MATCH (d:Developer), (p:Project), (t:Technology), ()-[r]->()
  RETURN count(d), count(p), count(t), count(r)
  ```

#### `lib/queries/developers.ts`
- **Purpose:** Developer-related queries
- **Exports:**
  - `getDevelopers(searchTerm?)` - Search/list developers
  - `getDeveloperById(id)` - Get developer + connections
  - `getDeveloperRecommendations(technologyName)` - Recommend learners
- **Queries:**
  - Full-text search by name
  - Aggregate profile with all connections
  - Multi-hop recommendation traversal

#### `lib/queries/projects.ts`
- **Purpose:** Project-related queries
- **Exports:**
  - `getProjects()` - List all projects
  - `getProjectById(id)` - Get project + team + tech stack
- **Queries:**
  - Simple listing
  - Aggregate project details

#### `lib/queries/technologies.ts`
- **Purpose:** Technology-related queries
- **Exports:**
  - `getTechnologies()` - List all technologies
  - `getTechnologyById(id)` - Get technology + adoption + related
- **Queries:**
  - Listing by category
  - Adoption metrics

#### `lib/queries/graph.ts`
- **Purpose:** Graph visualization queries
- **Exports:**
  - `getGraphData()` - Get nodes and edges for force-graph
- **Queries:**
  - Fetch limited nodes (max 150)
  - Format for react-force-graph-2d
  - Relationship aggregation

---

## Database Seeding (`/scripts`)

#### `scripts/seed.ts`
- **Purpose:** Populate database with sample data
- **Usage:** `npm run seed`
- **Features:**
  - Safe to run multiple times (uses MERGE)
  - No data duplication
  - Creates comprehensive sample dataset
- **Data created:**
  - 20 Developers with realistic profiles
  - 12 Projects with descriptions and status
  - 20 Technologies across multiple categories
  - 5 relationship types with realistic connections
- **Relationships created:**
  - `KNOWS`: Developers know technologies (~3-6 each)
  - `WORKED_ON`: Developers work on projects (~1-3 each)
  - `COLLABORATED_WITH`: Auto-generated from shared projects
  - `USES`: Projects use technologies (~4-5 each)
  - `RELATED_TO`: Technology ecosystem (~13 relationships)
- **Total data:**
  - 52 nodes (20 devs + 12 projects + 20 techs)
  - 127 relationships (approximately)
- **Execution time:** ~2-5 seconds

---

## Documentation (`/docs`)

#### `docs/CYPHER_QUERIES.md`
- **Purpose:** Complete Cypher query reference
- **Contents:**
  - Query purpose and explanation
  - SQL vs. Cypher comparison
  - Performance characteristics
  - Example output
  - Query patterns and tips

#### `docs/DEPLOYMENT_GUIDE.md`
- **Purpose:** Deployment instructions
- **Contents:**
  - Vercel deployment (recommended)
  - Alternative platforms (Railway, Render, Fly.io)
  - Custom domain setup
  - Monitoring and troubleshooting
  - Production best practices
  - Scaling considerations

#### `docs/SCREEN_RECORDING_GUIDE.md`
- **Purpose:** Demo video creation guide
- **Contents:**
  - Recording tools (OBS, ScreenFlow, CapCut)
  - Demo script (3-5 minutes)
  - Technical recording tips
  - Post-production editing
  - Upload and sharing

---

## Data Model

### Nodes

#### Developer
```javascript
{
  id: "dev-1",           // Unique identifier
  name: "Alice Smith",    // Full name
  role: "Frontend Engineer", // Job title
  location: "San Francisco, CA", // Location
  bio: "Passionate about UI/UX.", // Bio/description
  avatar: "https://..." // Avatar URL
}
```

#### Project
```javascript
{
  id: "proj-1",          // Unique identifier
  name: "GraphDB Dashboard", // Project name
  description: "Analytics dashboard for graph data.",
  status: "Active",      // Active or Completed
  year: 2024            // Launch/target year
}
```

#### Technology
```javascript
{
  id: "tech-1",          // Unique identifier
  name: "JavaScript",    // Technology name
  category: "Language"   // Category (Language, Frontend, Backend, etc.)
}
```

### Relationships

| Relationship | From | To | Meaning | Example |
|---|---|---|---|---|
| `KNOWS` | Developer | Technology | Developer has expertise | Alice KNOWS React |
| `WORKED_ON` | Developer | Project | Developer contributed | Alice WORKED_ON Dashboard |
| `COLLABORATED_WITH` | Developer | Developer | Worked together | Alice COLLABORATED_WITH Bob |
| `USES` | Project | Technology | Project uses tech stack | Dashboard USES Neo4j |
| `RELATED_TO` | Technology | Technology | Related or complementary | React RELATED_TO Next.js |

---

## Key Cypher Queries Used

### 1. Dashboard Stats
```cypher
MATCH (d:Developer) WITH count(d) AS developers
MATCH (p:Project) WITH developers, count(p) AS projects
MATCH (t:Technology) WITH developers, projects, count(t) AS technologies
MATCH ()-[r]->() RETURN developers, projects, technologies, count(r) AS relationships
```

### 2. Developer Profile
```cypher
MATCH (d:Developer {id: $id})
OPTIONAL MATCH (d)-[:KNOWS]->(t:Technology)
OPTIONAL MATCH (d)-[:WORKED_ON]->(p:Project)
OPTIONAL MATCH (d)-[:COLLABORATED_WITH]-(c:Developer)
RETURN d, collect(DISTINCT t) as technologies, collect(DISTINCT p) as projects, collect(DISTINCT c) as collaborators
```

### 3. Recommendations (Multi-Hop)
```cypher
MATCH (target:Technology {name: $technologyName})
MATCH (d:Developer)-[:KNOWS]->(known:Technology)-[:RELATED_TO]-(target)
WHERE NOT (d)-[:KNOWS]->(target)
RETURN d as developer, collect(DISTINCT known) as knownTechnologies, target as targetTechnology LIMIT 10
```

### 4. Graph Visualization
```cypher
MATCH (n) WITH n LIMIT 150
OPTIONAL MATCH (n)-[r]->(m) WHERE m IS NOT NULL
RETURN collect(DISTINCT n) as nodes, collect(DISTINCT r) as relationships, collect(DISTINCT m) as targetNodes
```

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.3.0 | React framework |
| `react` | 19.2.8 | UI library |
| `react-dom` | 19.2.8 | React DOM rendering |
| `neo4j-driver` | 6.2.0 | Neo4j database client |
| `react-force-graph-2d` | 1.29.1 | Force-directed graph visualization |
| `tailwindcss` | 4.x | CSS framework |
| `lucide-react` | 1.30.0 | Icon library |
| `typescript` | 5.x | Type safety |
| `tsx` | 4.23.11 | TypeScript executor (scripts) |
| `eslint` | 9.x | Code linter |

---

## Environment Variables

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `COGNODB_URI` | Yes | `bolt+s://db.cognodb.com` | Database connection string |
| `COGNODB_USERNAME` | Yes | `cognodb` | Database username |
| `COGNODB_PASSWORD` | Yes | `***` | Database password (keep secret!) |

---

## Scripts

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Run production server
npm run seed         # Populate database
npm run lint         # Run ESLint
```

---

## Performance Characteristics

| Operation | Time | Notes |
|---|---|---|
| Get stats | ~50ms | Cached well, lightweight |
| Search developers | ~100ms | Full name scan, limited to 50 results |
| Get developer profile | ~150ms | Includes all relationships |
| Get graph (150 nodes) | ~200ms | Browser rendering takes ~500ms |
| Recommendations | ~200ms | Multi-hop traversal, limited to 10 results |

---

## File Size Reference

```
app/             ~5 KB   (JSX/TSX files)
components/      ~2 KB   (React components)
lib/             ~3 KB   (TypeScript queries)
public/          ~0 KB   (Assets folder)
scripts/         ~8 KB   (seed.ts)
package.json     ~1 KB   (Metadata)
docs/           ~50 KB   (Markdown documentation)
Total source:   ~70 KB   (Highly compressible)
```

---

## Git Repository Structure

```
main branch
├── Production-ready code
├── CI/CD passes
└── Ready to deploy to Vercel

develop branch (optional)
├── Feature development
├── Preview deployments
└── Pull requests from feature branches
```

---

## Quick Reference

### Adding a New Page
1. Create `app/[feature]/page.tsx`
2. Import components and data fetching
3. Create API route in `app/api/[feature]/route.ts`
4. Implement query in `lib/queries/[feature].ts`
5. Add to sidebar navigation

### Adding a New Query
1. Create function in `lib/queries/[entity].ts`
2. Export TypeScript type in `lib/queries/types.ts`
3. Create API route handler
4. Call from React component via `fetch()`

### Debugging
1. Check browser console for errors
2. Check terminal output for server errors
3. Use Neo4j Browser to test queries directly
4. Profile queries with `PROFILE` prefix

---

This reference covers all source files and their relationships. For more details on specific topics, see the respective documentation files.
