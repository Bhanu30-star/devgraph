# Cypher Queries Reference Guide

This document explains all Cypher queries used in the DevGraph application.

## Table of Contents
1. [Queries Overview](#overview)
2. [Dashboard Queries](#dashboard)
3. [Search & Discovery Queries](#search)
4. [Profile & Detail Queries](#profiles)
5. [Recommendation Queries](#recommendations)
6. [Graph Explorer Queries](#graph)
7. [Query Performance Tips](#performance)

---

## Overview

The application uses 6 main query categories:

| Category | Purpose | File | Use Case |
|----------|---------|------|----------|
| **Stats** | Dashboard metrics | `lib/queries/stats.ts` | Home page aggregates |
| **Developers** | Developer-specific | `lib/queries/developers.ts` | Search, profiles, recommendations |
| **Projects** | Project-specific | `lib/queries/projects.ts` | Project listing, details |
| **Technologies** | Tech-specific | `lib/queries/technologies.ts` | Tech catalog, adoption metrics |
| **Graph** | Visualization | `lib/queries/graph.ts` | Interactive network explorer |

---

## Dashboard Queries

### Query: Get Dashboard Statistics

**File**: `lib/queries/stats.ts`  
**Endpoint**: `GET /api/stats`  
**Purpose**: Fetch aggregate counts for dashboard widgets

```cypher
MATCH (d:Developer)
WITH count(d) AS developers
MATCH (p:Project)
WITH developers, count(p) AS projects
MATCH (t:Technology)
WITH developers, projects, count(t) AS technologies
MATCH ()-[r]->()
RETURN developers, projects, technologies, count(r) AS relationships
```

**How it works:**
1. `MATCH (d:Developer)` - Find all Developer nodes
2. `count(d)` - Count them, store as `developers`
3. Repeat for Projects and Technologies
4. `MATCH ()-[r]->()` - Find all relationships
5. Return all four metrics

**Performance:** O(n) scan, ~50-100ms on 50K node graph. Can be pre-computed for better performance.

**Example Output:**
```json
{
  "developers": 20,
  "projects": 12,
  "technologies": 20,
  "relationships": 127
}
```

---

## Search & Discovery Queries

### Query 1: Search Developers by Name

**File**: `lib/queries/developers.ts`  
**Function**: `getDevelopers(searchTerm)`  
**Endpoint**: `GET /api/developers?search=alice`  
**Purpose**: Search and list all developers with optional filtering

```cypher
MATCH (d:Developer)
WHERE toLower(d.name) CONTAINS toLower($searchTerm)
RETURN d
ORDER BY d.name
LIMIT 50
```

**How it works:**
- `WHERE toLower(...) CONTAINS` - Case-insensitive substring match
- `ORDER BY d.name` - Alphabetical sorting
- `LIMIT 50` - Prevent returning too many results

**Parameters:**
```
searchTerm: "alice" (optional, omit to get all)
```

**Example Output:**
```json
[
  {
    "id": "dev-1",
    "name": "Alice Smith",
    "role": "Frontend Engineer",
    "location": "San Francisco, CA",
    "bio": "Passionate about UI/UX.",
    "avatar": "https://ui-avatars.com/api/?name=Alice+Smith&background=random"
  }
]
```

### Query 2: Search Projects by Name

**File**: `lib/queries/projects.ts`  
**Function**: `getProjects()`  
**Endpoint**: `GET /api/projects`  
**Purpose**: List all projects (currently no search param, but easily extensible)

```cypher
MATCH (p:Project)
RETURN p
ORDER BY p.name
```

### Query 3: Search Technologies by Name

**File**: `lib/queries/technologies.ts`  
**Function**: `getTechnologies()`  
**Endpoint**: `GET /api/technologies`  
**Purpose**: List all technologies with their categories

```cypher
MATCH (t:Technology)
RETURN t
ORDER BY t.name
```

---

## Profile & Detail Queries

### Query 1: Developer Profile with All Connections

**File**: `lib/queries/developers.ts`  
**Function**: `getDeveloperById(id)`  
**Endpoint**: `GET /api/developers/[id]`  
**Purpose**: Retrieve complete developer profile with all related data

```cypher
MATCH (d:Developer {id: $id})
OPTIONAL MATCH (d)-[:KNOWS]->(t:Technology)
OPTIONAL MATCH (d)-[:WORKED_ON]->(p:Project)
OPTIONAL MATCH (d)-[:COLLABORATED_WITH]-(c:Developer)
RETURN d, 
       collect(DISTINCT t) as technologies, 
       collect(DISTINCT p) as projects,
       collect(DISTINCT c) as collaborators
```

**How it works:**
1. `MATCH (d:Developer {id: $id})` - Find the specific developer by ID
2. `OPTIONAL MATCH` - Find related entities without failing if none exist
3. `collect(DISTINCT x)` - Aggregate all matches into arrays
4. Single query returns developer plus all related data

**Why It's Good:**
- ✅ Single round-trip to database (no N+1 queries)
- ✅ Automatic deduplication with `DISTINCT`
- ✅ Efficient aggregation with `collect()`
- ✅ Graceful if developer has no connections

**Parameters:**
```
id: "dev-1"
```

**Example Output:**
```json
{
  "developer": {
    "id": "dev-1",
    "name": "Alice Smith",
    "role": "Frontend Engineer",
    "location": "San Francisco, CA",
    "bio": "Passionate about UI/UX.",
    "avatar": "https://ui-avatars.com/api/?name=Alice+Smith"
  },
  "technologies": [
    { "id": "tech-1", "name": "JavaScript", "category": "Language" },
    { "id": "tech-2", "name": "TypeScript", "category": "Language" },
    { "id": "tech-3", "name": "React", "category": "Frontend" },
    { "id": "tech-4", "name": "Next.js", "category": "Frontend Framework" }
  ],
  "projects": [
    { "id": "proj-1", "name": "GraphDB Dashboard", "description": "...", "status": "Active", "year": 2024 }
  ],
  "collaborators": [
    { "id": "dev-3", "name": "Charlie Brown", "role": "Full Stack Developer", ... },
    { "id": "dev-8", "name": "Hannah Abbott", "role": "Full Stack Developer", ... }
  ]
}
```

---

### Query 2: Project Details with Team and Technology

**File**: `lib/queries/projects.ts`  
**Function**: `getProjectById(id)`  
**Endpoint**: `GET /api/projects/[id]`  
**Purpose**: Retrieve project with its team members and tech stack

```cypher
MATCH (p:Project {id: $id})
OPTIONAL MATCH (d:Developer)-[:WORKED_ON]->(p)
OPTIONAL MATCH (p)-[:USES]->(t:Technology)
RETURN p, 
       collect(DISTINCT d) as developers, 
       collect(DISTINCT t) as technologies
```

**How it works:**
- Reverse of developer query: project is center, developers and techs are connected
- `(d:Developer)-[:WORKED_ON]->(p)` - Find developers who worked on this project
- `(p)-[:USES]->(t:Technology)` - Find technologies the project uses

**Example Output:**
```json
{
  "project": {
    "id": "proj-1",
    "name": "GraphDB Dashboard",
    "description": "Analytics dashboard for graph data.",
    "status": "Active",
    "year": 2024
  },
  "developers": [
    { "id": "dev-1", "name": "Alice Smith", ... },
    { "id": "dev-3", "name": "Charlie Brown", ... },
    { "id": "dev-8", "name": "Hannah Abbott", ... }
  ],
  "technologies": [
    { "id": "tech-2", "name": "TypeScript", ... },
    { "id": "tech-4", "name": "Next.js", ... },
    { "id": "tech-9", "name": "Neo4j", ... }
  ]
}
```

---

### Query 3: Technology with Ecosystem

**File**: `lib/queries/technologies.ts`  
**Function**: `getTechnologyById(id)`  
**Endpoint**: `GET /api/technologies/[id]`  
**Purpose**: Show technology adoption and related technologies

```cypher
MATCH (t:Technology {id: $id})
OPTIONAL MATCH (d:Developer)-[:KNOWS]->(t)
OPTIONAL MATCH (p:Project)-[:USES]->(t)
OPTIONAL MATCH (t)-[:RELATED_TO]-(related:Technology)
RETURN t, 
       collect(DISTINCT d) as developers, 
       collect(DISTINCT p) as projects,
       collect(DISTINCT related) as relatedTechnologies
```

**How it works:**
- `(d:Developer)-[:KNOWS]->(t)` - Who knows this tech
- `(p:Project)-[:USES]->(t)` - What projects use it
- `(t)-[:RELATED_TO]-(related)` - Related technologies (learning paths)

**Example Output:**
```json
{
  "technology": {
    "id": "tech-3",
    "name": "React",
    "category": "Frontend"
  },
  "developers": [
    { "id": "dev-1", "name": "Alice Smith", ... },
    { "id": "dev-6", "name": "Fiona Gallagher", ... }
  ],
  "projects": [
    { "id": "proj-1", "name": "GraphDB Dashboard", ... },
    { "id": "proj-3", "name": "Social Network App", ... }
  ],
  "relatedTechnologies": [
    { "id": "tech-1", "name": "JavaScript", ... },
    { "id": "tech-2", "name": "TypeScript", ... },
    { "id": "tech-4", "name": "Next.js", ... }
  ]
}
```

---

## Recommendation Queries

### Query: Developer Recommendations for Learning a Technology

**File**: `lib/queries/developers.ts`  
**Function**: `getDeveloperRecommendations(technologyName)`  
**Endpoint**: `POST /api/recommendations`  
**Purpose**: Find developers who should learn a technology based on related tech they know

```cypher
MATCH (target:Technology {name: $technologyName})
MATCH (d:Developer)-[:KNOWS]->(known:Technology)-[:RELATED_TO]-(target)
WHERE NOT (d)-[:KNOWS]->(target)
RETURN d as developer, 
       collect(DISTINCT known) as knownTechnologies, 
       target as targetTechnology
LIMIT 10
```

**How it works:**
1. `MATCH (target:Technology {name: $technologyName})` - Find React (or target tech)
2. `MATCH (d:Developer)-[:KNOWS]->(known:Technology)-[:RELATED_TO]-(target)` - Find path:
   - Developer knows "known" tech (e.g., JavaScript)
   - "known" tech relates to React
3. `WHERE NOT (d)-[:KNOWS]->(target)` - Exclude devs who already know React
4. `collect(DISTINCT known)` - Show bridging techs (why they should learn)
5. `LIMIT 10` - Top 10 recommendations

**This is the "killer query" for graph databases:**

- ✅ **Multi-hop traversal**: Follows 2+ relationship hops naturally
- ✅ **Readable**: Easy to understand the recommendation logic
- ✅ **Efficient**: Relationship traversal is O(1) per hop, very fast
- ✅ **In SQL**: Would require multiple `JOIN`s and complex `WHERE` logic

**Comparison: SQL vs. Cypher**

SQL (awkward and complex):
```sql
SELECT DISTINCT d.*, array_agg(kt.name) as known_techs
FROM developers d
JOIN developer_technologies dt1 ON d.id = dt1.developer_id
JOIN technologies kt ON dt1.technology_id = kt.id
JOIN technology_relationships tr ON kt.id = tr.tech_id1
JOIN technologies target ON tr.tech_id2 = target.id
WHERE target.name = 'React'
AND NOT EXISTS (
  SELECT 1 FROM developer_technologies dt2
  WHERE d.id = dt2.developer_id
  AND dt2.technology_id = target.id
)
GROUP BY d.id
LIMIT 10;
```

Cypher (clear and concise):
```cypher
MATCH (target:Technology {name: 'React'})
MATCH (d:Developer)-[:KNOWS]->(known:Technology)-[:RELATED_TO]-(target)
WHERE NOT (d)-[:KNOWS]->(target)
RETURN d, collect(DISTINCT known) as knownTechnologies, target
LIMIT 10
```

**Parameters:**
```
technologyName: "React"
```

**Example Output:**
```json
[
  {
    "developer": {
      "id": "dev-11",
      "name": "Kevin Hart",
      "role": "Frontend Engineer",
      "location": "Miami, FL",
      "bio": "Vue.js expert.",
      "avatar": "..."
    },
    "knownTechnologies": [
      { "id": "tech-1", "name": "JavaScript", "category": "Language" },
      { "id": "tech-16", "name": "Vue.js", "category": "Frontend" }
    ],
    "targetTechnology": {
      "id": "tech-3",
      "name": "React",
      "category": "Frontend"
    }
  },
  {
    "developer": { "id": "dev-13", ... },
    "knownTechnologies": [...],
    "targetTechnology": { ... }
  }
]
```

---

## Graph Explorer Queries

### Query: Get All Nodes and Relationships for Visualization

**File**: `lib/queries/graph.ts`  
**Function**: `getGraphData()`  
**Endpoint**: `GET /api/graph`  
**Purpose**: Fetch complete graph data for interactive visualization

```cypher
MATCH (n)
WITH n LIMIT 150
OPTIONAL MATCH (n)-[r]->(m)
WHERE m IS NOT NULL
RETURN collect(DISTINCT n) as nodes, 
       collect(DISTINCT r) as relationships, 
       collect(DISTINCT m) as targetNodes
```

**How it works:**
1. `MATCH (n)` - Find all nodes
2. `LIMIT 150` - Prevent overloading browser with millions of nodes
3. `OPTIONAL MATCH (n)-[r]->(m)` - Find all outgoing relationships
4. `WHERE m IS NOT NULL` - Filter out relationships with no target
5. Return nodes and relationships separately for client transformation

**Client Transformation** (in `lib/queries/graph.ts`):
- Converts Neo4j internal format to force-graph format
- Creates `{ id, label, type }` objects for each node
- Creates `{ source, target, type }` objects for relationships
- Filters to ensure all linked nodes exist

**Output Format:**
```json
{
  "nodes": [
    { "id": "n123", "label": "Alice Smith", "type": "Developer", ... },
    { "id": "n456", "label": "React", "type": "Technology", ... },
    { "id": "n789", "label": "GraphDB Dashboard", "type": "Project", ... }
  ],
  "links": [
    { "source": "n123", "target": "n456", "type": "KNOWS" },
    { "source": "n123", "target": "n789", "type": "WORKED_ON" }
  ]
}
```

**Node Type Colors:**
- 🔵 **Developer** - Blue
- 🟢 **Project** - Green
- 🟣 **Technology** - Purple

---

## Query Performance Tips

### 1. Indexing Strategy

```cypher
-- Create indexes on lookup columns
CREATE INDEX ON :Developer(id);
CREATE INDEX ON :Project(id);
CREATE INDEX ON :Technology(id);
CREATE INDEX ON :Technology(name);
```

### 2. Understanding Query Costs

| Query Type | Complexity | Performance |
|-----------|-----------|-------------|
| Single node lookup (by index) | O(1) | < 1ms |
| Relationship traversal | O(1) per hop | < 1ms |
| Full scan + filter | O(n) | 10-100ms |
| Multi-hop traversal | O(1) * hops | < 5ms |
| Graph visualization (150 nodes) | O(n) | 50-200ms |

### 3. Optimization Tips

**Bad:** Full graph traversal without limits
```cypher
MATCH (a)-[r]->(b)-[r2]->(c)
RETURN a, b, c
-- Risk: Exponential result growth
```

**Good:** Limited traversal with explicit filters
```cypher
MATCH (target:Technology {name: $name})
MATCH (d:Developer)-[:KNOWS]->(t)-[:RELATED_TO]-(target)
WHERE NOT (d)-[:KNOWS]->(target)
RETURN d, collect(t) as techs
LIMIT 10
-- Result: Bounded, fast, predictable
```

### 4. Query Monitoring

Use Cypher query profiling:
```cypher
PROFILE
MATCH (d:Developer)-[:KNOWS]->(t:Technology)
RETURN count(d);
```

Monitor in Neo4j Browser or CognoDB Dashboard for execution time.

---

## Common Query Patterns

### Pattern 1: Direct Connection

```cypher
MATCH (a:Developer)-[:KNOWS]->(t:Technology)
RETURN a, t
```
**Use for:** Finding direct relationships (1-hop)

### Pattern 2: Aggregate Collection

```cypher
MATCH (d:Developer)
OPTIONAL MATCH (d)-[:KNOWS]->(t)
RETURN d, collect(t) as technologies
```
**Use for:** Fetching entity with all connected entities (profile pages)

### Pattern 3: Multi-Hop Path

```cypher
MATCH (start)-[r1]->(mid)-[r2]->(end)
RETURN start, mid, end
```
**Use for:** Finding entities connected via 2+ hops (recommendations, paths)

### Pattern 4: Negative Condition

```cypher
MATCH (d:Developer)
WHERE NOT (d)-[:KNOWS]->(t)
RETURN d
```
**Use for:** Finding entities NOT connected (gap analysis, recommendations)

### Pattern 5: Induced Subgraph

```cypher
MATCH (d:Developer)-[:WORKED_ON]->(p:Project)<-[:WORKED_ON]-(d2)
WHERE d.id < d2.id
RETURN d, d2, p
```
**Use for:** Finding shared entities (who collaborated)

---

## Debugging Queries

### Check Query Execution Plan

```cypher
EXPLAIN
MATCH (d:Developer {id: 'dev-1'})
RETURN d
```

### Count Operations

```cypher
MATCH (d:Developer)-[:KNOWS]->(t)
RETURN count(DISTINCT d) as developers, count(DISTINCT t) as technologies
```

### Find Performance Bottlenecks

```cypher
PROFILE MATCH (d:Developer)-[:KNOWS]->(t)-[:RELATED_TO]-(related)
RETURN count(*)
-- Look for high "rows" numbers in the plan
```

---

## Resources

- [Cypher Manual](https://neo4j.com/docs/cypher-manual/current/)
- [Neo4j Query Tuning Guide](https://neo4j.com/docs/operations-manual/current/performance/query-tuning/)
- [Graph Patterns](https://neo4j.com/docs/cypher-manual/current/introduction/patterns/)
