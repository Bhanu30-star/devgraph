import { config } from 'dotenv';
import neo4j from 'neo4j-driver';

// Load environment variables from .env.local
config({ path: '.env.local' });

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  console.error('Neo4j credentials are not set in the environment variables');
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

async function seed() {
  const session = driver.session();
  console.log('Starting seed process...');

  try {
    // 1. Create constraints (Cypher specific syntax might vary, MERGE handles uniqueness mostly for this simple dataset)
    // We'll rely on MERGE with unique IDs.
    
    // Clear existing data (optional, but requested to have a controlled approach if needed. 
    // The prompt says "Do not delete or reset my database unless absolutely necessary."
    // I will NOT delete. I will use MERGE to safely add or update data.)

    console.log('Seeding Technologies...');
    await session.executeWrite(tx => tx.run(`
      UNWIND [
        {id: 'tech-1', name: 'JavaScript', category: 'Language'},
        {id: 'tech-2', name: 'TypeScript', category: 'Language'},
        {id: 'tech-3', name: 'React', category: 'Frontend'},
        {id: 'tech-4', name: 'Next.js', category: 'Frontend Framework'},
        {id: 'tech-5', name: 'Node.js', category: 'Backend'},
        {id: 'tech-6', name: 'Python', category: 'Language'},
        {id: 'tech-7', name: 'Django', category: 'Backend Framework'},
        {id: 'tech-8', name: 'PostgreSQL', category: 'Database'},
        {id: 'tech-9', name: 'Neo4j', category: 'Database'},
        {id: 'tech-10', name: 'Redis', category: 'Cache'},
        {id: 'tech-11', name: 'GraphQL', category: 'API'},
        {id: 'tech-12', name: 'Tailwind CSS', category: 'Styling'},
        {id: 'tech-13', name: 'Docker', category: 'DevOps'},
        {id: 'tech-14', name: 'Kubernetes', category: 'DevOps'},
        {id: 'tech-15', name: 'AWS', category: 'Cloud'},
        {id: 'tech-16', name: 'Vue.js', category: 'Frontend'},
        {id: 'tech-17', name: 'Go', category: 'Language'},
        {id: 'tech-18', name: 'Rust', category: 'Language'},
        {id: 'tech-19', name: 'MongoDB', category: 'Database'},
        {id: 'tech-20', name: 'Figma', category: 'Design'}
      ] AS t
      MERGE (tech:Technology {id: t.id})
      SET tech.name = t.name, tech.category = t.category
    `));

    console.log('Seeding Developers...');
    await session.executeWrite(tx => tx.run(`
      UNWIND [
        {id: 'dev-1', name: 'Alice Smith', role: 'Frontend Engineer', location: 'San Francisco, CA', bio: 'Passionate about UI/UX.'},
        {id: 'dev-2', name: 'Bob Jones', role: 'Backend Engineer', location: 'London, UK', bio: 'Scaling distributed systems.'},
        {id: 'dev-3', name: 'Charlie Brown', role: 'Full Stack Developer', location: 'Berlin, DE', bio: 'Loves graph databases.'},
        {id: 'dev-4', name: 'Diana Prince', role: 'Data Scientist', location: 'New York, NY', bio: 'Python and machine learning.'},
        {id: 'dev-5', name: 'Evan Wright', role: 'DevOps Engineer', location: 'Austin, TX', bio: 'Automate all the things.'},
        {id: 'dev-6', name: 'Fiona Gallagher', role: 'Frontend Engineer', location: 'Chicago, IL', bio: 'React enthusiast.'},
        {id: 'dev-7', name: 'George Harrison', role: 'Backend Engineer', location: 'Seattle, WA', bio: 'Go and microservices.'},
        {id: 'dev-8', name: 'Hannah Abbott', role: 'Full Stack Developer', location: 'Toronto, CA', bio: 'Building SaaS products.'},
        {id: 'dev-9', name: 'Ian Malcolm', role: 'Architect', location: 'Denver, CO', bio: 'Systems design.'},
        {id: 'dev-10', name: 'Julia Roberts', role: 'UI Designer', location: 'Los Angeles, CA', bio: 'Pixels and vectors.'},
        {id: 'dev-11', name: 'Kevin Hart', role: 'Frontend Engineer', location: 'Miami, FL', bio: 'Vue.js expert.'},
        {id: 'dev-12', name: 'Laura Dern', role: 'Backend Engineer', location: 'Boston, MA', bio: 'Python backend development.'},
        {id: 'dev-13', name: 'Mike Myers', role: 'Full Stack Developer', location: 'Austin, TX', bio: 'TypeScript all the way.'},
        {id: 'dev-14', name: 'Nina Dobrev', role: 'Data Engineer', location: 'London, UK', bio: 'Data pipelines.'},
        {id: 'dev-15', name: 'Oscar Isaac', role: 'DevOps Engineer', location: 'Berlin, DE', bio: 'Kubernetes wizard.'},
        {id: 'dev-16', name: 'Penelope Cruz', role: 'Frontend Engineer', location: 'Madrid, ES', bio: 'CSS animations.'},
        {id: 'dev-17', name: 'Quentin Tarantino', role: 'Backend Engineer', location: 'Paris, FR', bio: 'Rust developer.'},
        {id: 'dev-18', name: 'Rachel McAdams', role: 'Full Stack Developer', location: 'Toronto, CA', bio: 'React and Node.js.'},
        {id: 'dev-19', name: 'Steve Carell', role: 'Product Manager', location: 'Scranton, PA', bio: 'Managing agile teams.'},
        {id: 'dev-20', name: 'Tina Fey', role: 'Engineering Manager', location: 'New York, NY', bio: 'Building great teams.'}
      ] AS d
      MERGE (dev:Developer {id: d.id})
      SET dev.name = d.name, dev.role = d.role, dev.location = d.location, dev.bio = d.bio,
          dev.avatar = 'https://ui-avatars.com/api/?name=' + replace(d.name, ' ', '+') + '&background=random'
    `));

    console.log('Seeding Projects...');
    await session.executeWrite(tx => tx.run(`
      UNWIND [
        {id: 'proj-1', name: 'GraphDB Dashboard', description: 'Analytics dashboard for graph data.', status: 'Active', year: 2024},
        {id: 'proj-2', name: 'E-commerce API', description: 'Headless backend for retail.', status: 'Completed', year: 2023},
        {id: 'proj-3', name: 'Social Network App', description: 'Mobile-first social platform.', status: 'Active', year: 2024},
        {id: 'proj-4', name: 'Recommendation Engine', description: 'ML-based product recommendations.', status: 'Active', year: 2023},
        {id: 'proj-5', name: 'Cloud Infra Migration', description: 'Moving from on-prem to AWS.', status: 'Completed', year: 2022},
        {id: 'proj-6', name: 'Design System', description: 'Component library for all company apps.', status: 'Active', year: 2024},
        {id: 'proj-7', name: 'Real-time Chat', description: 'WebSocket based messaging system.', status: 'Completed', year: 2023},
        {id: 'proj-8', name: 'Data Warehouse', description: 'Centralized analytics storage.', status: 'Active', year: 2024},
        {id: 'proj-9', name: 'Serverless Functions', description: 'Refactoring microservices to AWS Lambda.', status: 'Active', year: 2024},
        {id: 'proj-10', name: 'Legacy CRM Rewrite', description: 'Modernizing internal tools.', status: 'Completed', year: 2021},
        {id: 'proj-11', name: 'Mobile Banking App', description: 'Secure financial application.', status: 'Active', year: 2024},
        {id: 'proj-12', name: 'AI Image Generator', description: 'Integrating stable diffusion models.', status: 'Active', year: 2024}
      ] AS p
      MERGE (proj:Project {id: p.id})
      SET proj.name = p.name, proj.description = p.description, proj.status = p.status, proj.year = p.year
    `));

    console.log('Creating Relationships: KNOWS...');
    await session.executeWrite(tx => tx.run(`
      UNWIND [
        {devId: 'dev-1', techIds: ['tech-1', 'tech-2', 'tech-3', 'tech-4', 'tech-12', 'tech-20']},
        {devId: 'dev-2', techIds: ['tech-1', 'tech-5', 'tech-8', 'tech-10', 'tech-13']},
        {devId: 'dev-3', techIds: ['tech-1', 'tech-2', 'tech-3', 'tech-5', 'tech-9', 'tech-11']},
        {devId: 'dev-4', techIds: ['tech-6', 'tech-8', 'tech-19']},
        {devId: 'dev-5', techIds: ['tech-13', 'tech-14', 'tech-15', 'tech-6', 'tech-17']},
        {devId: 'dev-6', techIds: ['tech-1', 'tech-3', 'tech-12', 'tech-20']},
        {devId: 'dev-7', techIds: ['tech-17', 'tech-8', 'tech-10', 'tech-13']},
        {devId: 'dev-8', techIds: ['tech-1', 'tech-2', 'tech-4', 'tech-5', 'tech-8', 'tech-12']},
        {devId: 'dev-9', techIds: ['tech-15', 'tech-14', 'tech-8', 'tech-9', 'tech-11']},
        {devId: 'dev-10', techIds: ['tech-20', 'tech-12', 'tech-3']},
        {devId: 'dev-11', techIds: ['tech-1', 'tech-16', 'tech-12']},
        {devId: 'dev-12', techIds: ['tech-6', 'tech-7', 'tech-8', 'tech-10']},
        {devId: 'dev-13', techIds: ['tech-2', 'tech-4', 'tech-5', 'tech-11', 'tech-12']},
        {devId: 'dev-14', techIds: ['tech-6', 'tech-8', 'tech-15']},
        {devId: 'dev-15', techIds: ['tech-13', 'tech-14', 'tech-15']},
        {devId: 'dev-16', techIds: ['tech-1', 'tech-3', 'tech-12']},
        {devId: 'dev-17', techIds: ['tech-18', 'tech-8', 'tech-10']},
        {devId: 'dev-18', techIds: ['tech-1', 'tech-3', 'tech-5', 'tech-8']},
        {devId: 'dev-19', techIds: ['tech-20']},
        {devId: 'dev-20', techIds: ['tech-1', 'tech-6', 'tech-15']}
      ] AS rel
      MATCH (d:Developer {id: rel.devId})
      UNWIND rel.techIds AS techId
      MATCH (t:Technology {id: techId})
      MERGE (d)-[:KNOWS]->(t)
    `));

    console.log('Creating Relationships: WORKED_ON...');
    await session.executeWrite(tx => tx.run(`
      UNWIND [
        {devId: 'dev-1', projIds: ['proj-1', 'proj-6']},
        {devId: 'dev-2', projIds: ['proj-2', 'proj-7']},
        {devId: 'dev-3', projIds: ['proj-1', 'proj-3', 'proj-8']},
        {devId: 'dev-4', projIds: ['proj-4', 'proj-8', 'proj-12']},
        {devId: 'dev-5', projIds: ['proj-5', 'proj-9']},
        {devId: 'dev-6', projIds: ['proj-3', 'proj-6']},
        {devId: 'dev-7', projIds: ['proj-2', 'proj-9', 'proj-11']},
        {devId: 'dev-8', projIds: ['proj-1', 'proj-3', 'proj-10']},
        {devId: 'dev-9', projIds: ['proj-5', 'proj-8', 'proj-11']},
        {devId: 'dev-10', projIds: ['proj-6']},
        {devId: 'dev-11', projIds: ['proj-7']},
        {devId: 'dev-12', projIds: ['proj-4', 'proj-10']},
        {devId: 'dev-13', projIds: ['proj-3', 'proj-12']},
        {devId: 'dev-14', projIds: ['proj-8']},
        {devId: 'dev-15', projIds: ['proj-5', 'proj-9']},
        {devId: 'dev-16', projIds: ['proj-6']},
        {devId: 'dev-17', projIds: ['proj-7', 'proj-11']},
        {devId: 'dev-18', projIds: ['proj-1', 'proj-10']},
        {devId: 'dev-19', projIds: ['proj-3', 'proj-6', 'proj-11']},
        {devId: 'dev-20', projIds: ['proj-1', 'proj-5', 'proj-8']}
      ] AS rel
      MATCH (d:Developer {id: rel.devId})
      UNWIND rel.projIds AS projId
      MATCH (p:Project {id: projId})
      MERGE (d)-[:WORKED_ON]->(p)
    `));

    console.log('Creating Relationships: COLLABORATED_WITH...');
    await session.executeWrite(tx => tx.run(`
      MATCH (d1:Developer)-[:WORKED_ON]->(p:Project)<-[:WORKED_ON]-(d2:Developer)
      WHERE d1.id < d2.id
      MERGE (d1)-[:COLLABORATED_WITH]-(d2)
    `));

    console.log('Creating Relationships: USES (Projects use Technologies)...');
    await session.executeWrite(tx => tx.run(`
      UNWIND [
        {projId: 'proj-1', techIds: ['tech-2', 'tech-4', 'tech-9', 'tech-11', 'tech-12']},
        {projId: 'proj-2', techIds: ['tech-5', 'tech-8', 'tech-10', 'tech-11', 'tech-13']},
        {projId: 'proj-3', techIds: ['tech-2', 'tech-3', 'tech-5', 'tech-8', 'tech-11']},
        {projId: 'proj-4', techIds: ['tech-6', 'tech-8', 'tech-19', 'tech-13']},
        {projId: 'proj-5', techIds: ['tech-13', 'tech-14', 'tech-15']},
        {projId: 'proj-6', techIds: ['tech-2', 'tech-3', 'tech-12', 'tech-20']},
        {projId: 'proj-7', techIds: ['tech-1', 'tech-16', 'tech-5', 'tech-10', 'tech-17']},
        {projId: 'proj-8', techIds: ['tech-6', 'tech-8', 'tech-19', 'tech-15', 'tech-14']},
        {projId: 'proj-9', techIds: ['tech-17', 'tech-5', 'tech-15']},
        {projId: 'proj-10', techIds: ['tech-1', 'tech-5', 'tech-8', 'tech-7', 'tech-6']},
        {projId: 'proj-11', techIds: ['tech-2', 'tech-4', 'tech-17', 'tech-8', 'tech-15']},
        {projId: 'proj-12', techIds: ['tech-2', 'tech-4', 'tech-6', 'tech-15']}
      ] AS rel
      MATCH (p:Project {id: rel.projId})
      UNWIND rel.techIds AS techId
      MATCH (t:Technology {id: techId})
      MERGE (p)-[:USES]->(t)
    `));

    console.log('Creating Relationships: RELATED_TO (Technologies related to each other)...');
    await session.executeWrite(tx => tx.run(`
      UNWIND [
        {techId1: 'tech-1', techId2: 'tech-2'},
        {techId1: 'tech-1', techId2: 'tech-3'},
        {techId1: 'tech-1', techId2: 'tech-5'},
        {techId1: 'tech-1', techId2: 'tech-16'},
        {techId1: 'tech-2', techId2: 'tech-3'},
        {techId1: 'tech-2', techId2: 'tech-4'},
        {techId1: 'tech-3', techId2: 'tech-4'},
        {techId1: 'tech-6', techId2: 'tech-7'},
        {techId1: 'tech-8', techId2: 'tech-19'},
        {techId1: 'tech-13', techId2: 'tech-14'},
        {techId1: 'tech-14', techId2: 'tech-15'},
        {techId1: 'tech-12', techId2: 'tech-20'},
        {techId1: 'tech-5', techId2: 'tech-11'}
      ] AS rel
      MATCH (t1:Technology {id: rel.techId1})
      MATCH (t2:Technology {id: rel.techId2})
      MERGE (t1)-[:RELATED_TO]-(t2)
    `));

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
