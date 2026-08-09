import { getDriver } from '../neo4j';
import { Developer, Project, Technology } from './types';
import { sanitizeNode } from './utils';

export async function getDevelopers(searchTerm?: string): Promise<Developer[]> {
  const driver = getDriver();
  const session = driver.session();
  try {
    let query = 'MATCH (d:Developer) ';
    const params: any = {};

    if (searchTerm) {
      query += 'WHERE toLower(d.name) CONTAINS toLower($searchTerm) ';
      params.searchTerm = searchTerm;
    }

    query += 'RETURN d ORDER BY d.name LIMIT 50';

    const result = await session.executeRead(tx => tx.run(query, params));
    return result.records.map(record => sanitizeNode(record.get('d')) as Developer);
  } finally {
    await session.close();
  }
}

export async function getDeveloperById(id: string) {
  const driver = getDriver();
  const session = driver.session();
  try {
    const query = `
      MATCH (d:Developer {id: $id})
      OPTIONAL MATCH (d)-[:KNOWS]->(t:Technology)
      OPTIONAL MATCH (d)-[:WORKED_ON]->(p:Project)
      OPTIONAL MATCH (d)-[:COLLABORATED_WITH]-(c:Developer)
      RETURN d, 
             collect(DISTINCT t) as technologies, 
             collect(DISTINCT p) as projects,
             collect(DISTINCT c) as collaborators
    `;

    const result = await session.executeRead(tx => tx.run(query, { id }));
    
    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];
    return {
      developer: sanitizeNode(record.get('d')) as Developer,
      technologies: record.get('technologies').map((t: any) => sanitizeNode(t)) as Technology[],
      projects: record.get('projects').map((p: any) => sanitizeNode(p)) as Project[],
      collaborators: record.get('collaborators').map((c: any) => sanitizeNode(c)) as Developer[],
    };
  } finally {
    await session.close();
  }
}

// 2+ hop traversal for recommendations based on related technologies
export async function getDeveloperRecommendations(technologyName: string) {
  const driver = getDriver();
  const session = driver.session();
  try {
    // Find developers who know a technology RELATED TO the target technology,
    // but don't explicitly know the target technology yet.
    // Developer -> KNOWS -> Technology -> RELATED_TO -> Target Technology
    const query = `
      MATCH (target:Technology {name: $technologyName})
      MATCH (d:Developer)-[:KNOWS]->(known:Technology)-[:RELATED_TO]-(target)
      WHERE NOT (d)-[:KNOWS]->(target)
      RETURN d as developer, collect(DISTINCT known) as knownTechnologies, target as targetTechnology
      LIMIT 10
    `;

    const result = await session.executeRead(tx => tx.run(query, { technologyName }));
    
    return result.records.map(record => ({
      developer: sanitizeNode(record.get('developer')) as Developer,
      knownTechnologies: record.get('knownTechnologies').map((t: any) => sanitizeNode(t)) as Technology[],
      targetTechnology: sanitizeNode(record.get('targetTechnology')) as Technology,
    }));
  } finally {
    await session.close();
  }
}
