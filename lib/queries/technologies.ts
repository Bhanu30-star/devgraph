import { getDriver } from '../neo4j';
import { Developer, Project, Technology } from './types';
import { sanitizeNode } from './utils';

export async function getTechnologies(): Promise<Technology[]> {
  const driver = getDriver();
  const session = driver.session();
  try {
    const query = 'MATCH (t:Technology) RETURN t ORDER BY t.name';
    const result = await session.executeRead(tx => tx.run(query));
    return result.records.map(record => sanitizeNode(record.get('t')) as Technology);
  } finally {
    await session.close();
  }
}

export async function getTechnologyById(id: string) {
  const driver = getDriver();
  const session = driver.session();
  try {
    const query = `
      MATCH (t:Technology {id: $id})
      OPTIONAL MATCH (d:Developer)-[:KNOWS]->(t)
      OPTIONAL MATCH (p:Project)-[:USES]->(t)
      OPTIONAL MATCH (t)-[:RELATED_TO]-(related:Technology)
      RETURN t, 
             collect(DISTINCT d) as developers, 
             collect(DISTINCT p) as projects,
             collect(DISTINCT related) as relatedTechnologies
    `;

    const result = await session.executeRead(tx => tx.run(query, { id }));
    
    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];
    return {
      technology: sanitizeNode(record.get('t')) as Technology,
      developers: record.get('developers').map((d: any) => sanitizeNode(d)) as Developer[],
      projects: record.get('projects').map((p: any) => sanitizeNode(p)) as Project[],
      relatedTechnologies: record.get('relatedTechnologies').map((rt: any) => sanitizeNode(rt)) as Technology[],
    };
  } finally {
    await session.close();
  }
}
