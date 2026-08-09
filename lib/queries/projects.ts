import { getDriver } from '../neo4j';
import { Developer, Project, Technology } from './types';
import { sanitizeNode } from './utils';

export async function getProjects(): Promise<Project[]> {
  const driver = getDriver();
  const session = driver.session();
  try {
    const query = 'MATCH (p:Project) RETURN p ORDER BY p.name';
    const result = await session.executeRead(tx => tx.run(query));
    return result.records.map(record => sanitizeNode(record.get('p')) as Project);
  } finally {
    await session.close();
  }
}

export async function getProjectById(id: string) {
  const driver = getDriver();
  const session = driver.session();
  try {
    const query = `
      MATCH (p:Project {id: $id})
      OPTIONAL MATCH (d:Developer)-[:WORKED_ON]->(p)
      OPTIONAL MATCH (p)-[:USES]->(t:Technology)
      RETURN p, 
             collect(DISTINCT d) as developers, 
             collect(DISTINCT t) as technologies
    `;

    const result = await session.executeRead(tx => tx.run(query, { id }));
    
    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];
    return {
      project: sanitizeNode(record.get('p')) as Project,
      developers: record.get('developers').map((d: any) => sanitizeNode(d)) as Developer[],
      technologies: record.get('technologies').map((t: any) => sanitizeNode(t)) as Technology[],
    };
  } finally {
    await session.close();
  }
}
