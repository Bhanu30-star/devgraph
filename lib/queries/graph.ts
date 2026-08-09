import { getDriver } from '../neo4j';
import { GraphNode, GraphLink } from './types';
import { sanitizeNode } from './utils';

export async function getGraphData() {
  const driver = getDriver();
  const session = driver.session();
  try {
    // We limit to 150 nodes to avoid visually overloading the graph
    const query = `
      MATCH (n)
      WITH n LIMIT 150
      OPTIONAL MATCH (n)-[r]->(m)
      WHERE m IS NOT NULL
      RETURN collect(DISTINCT n) as nodes, collect(DISTINCT r) as relationships, collect(DISTINCT m) as targetNodes
    `;

    const result = await session.executeRead(tx => tx.run(query));
    
    if (result.records.length === 0) {
      return { nodes: [], links: [] };
    }

    const record = result.records[0];
    const neoNodes = record.get('nodes');
    const neoTargetNodes = record.get('targetNodes');
    const neoRels = record.get('relationships');

    const nodeMap = new Map<string, GraphNode>();

    const addNode = (n: any) => {
      if (!nodeMap.has(n.elementId)) {
        const labels = n.labels;
        const type = labels[0] || 'Unknown';
        let label = n.properties.name || n.properties.id || 'Unknown';
        
        nodeMap.set(n.elementId, {
          id: n.elementId, // Using Neo4j internal elementId for graph links
          label,
          type: type as any,
          ...sanitizeNode(n)
        });
      }
    };

    neoNodes.forEach(addNode);
    neoTargetNodes.forEach(addNode);

    const links: GraphLink[] = neoRels.map((r: any) => ({
      source: r.startNodeElementId,
      target: r.endNodeElementId,
      type: r.type,
    }));

    // Ensure all linked nodes exist in our node list
    const validLinks = links.filter(link => nodeMap.has(link.source) && nodeMap.has(link.target));

    return {
      nodes: Array.from(nodeMap.values()),
      links: validLinks,
    };
  } finally {
    await session.close();
  }
}
