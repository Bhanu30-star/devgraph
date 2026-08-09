import neo4j, { Driver } from 'neo4j-driver';

// Singleton instance
let driver: Driver;

export function getDriver(): Driver {
  if (!driver) {
    const uri = process.env.COGNODB_URI;
    const username = process.env.COGNODB_USERNAME;
    const password = process.env.COGNODB_PASSWORD;

    if (!uri || !username || !password) {
      throw new Error('Neo4j credentials are not set in the environment variables');
    }

    driver = neo4j.driver(
      uri,
      neo4j.auth.basic(username, password)
    );
  }

  return driver;
}

export async function closeDriver() {
  if (driver) {
    await driver.close();
  }
}
