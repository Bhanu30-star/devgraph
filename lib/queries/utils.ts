import { isInt } from 'neo4j-driver';

export function sanitizeNode(node: any) {
  if (!node || !node.properties) return node;
  const props = { ...node.properties };
  for (const key in props) {
    if (isInt(props[key])) {
      props[key] = props[key].toNumber();
    }
  }
  return props;
}
