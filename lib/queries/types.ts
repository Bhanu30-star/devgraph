export interface Developer {
  id: string;
  name: string;
  role: string;
  avatar: string;
  location: string;
  bio: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  year: number;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'Developer' | 'Project' | 'Technology';
  [key: string]: any;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
}

export interface Recommendation {
  developer: Developer;
  knownTechnologies: Technology[];
  targetTechnology: Technology;
}
