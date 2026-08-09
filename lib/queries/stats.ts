import { getDriver } from '../neo4j';

export async function getStats() {
  const driver = getDriver();
  const session = driver.session();
  try {
    const query = `
      MATCH (d:Developer)
      WITH count(d) AS developers
      MATCH (p:Project)
      WITH developers, count(p) AS projects
      MATCH (t:Technology)
      WITH developers, projects, count(t) AS technologies
      MATCH ()-[r]->()
      RETURN developers, projects, technologies, count(r) AS relationships
    `;

    const result = await session.executeRead(tx => tx.run(query));
    
    if (result.records.length === 0) {
      return { developers: 0, projects: 0, technologies: 0, relationships: 0 };
    }

    const record = result.records[0];
    return {
      developers: record.get('developers').toNumber(),
      projects: record.get('projects').toNumber(),
      technologies: record.get('technologies').toNumber(),
      relationships: record.get('relationships').toNumber(),
    };
  } finally {
    await session.close();
  }
}
