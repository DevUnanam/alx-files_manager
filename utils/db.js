import { MongoClient } from 'mongodb';
import envLoader from './env_loader';

class DBClient {
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${database}`;

    // Initialize the client and connect to MongoDB
    this.client = new MongoClient(dbURL, { useUnifiedTopology: true });
    this.connected = false;
    this.client.connect()
      .then(() => {
        this.connected = true;
        console.log('Connected to MongoDB');
      })
      .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
      });
  }

  isAlive() {
    return this.connected && this.client.topology.isConnected();
  }

  async nbUsers() {
    try {
      return await this.client.db().collection('users').countDocuments();
    } catch (err) {
      console.error('Error fetching number of users:', err);
      return 0;
    }
  }

  async nbFiles() {
    try {
      return await this.client.db().collection('files').countDocuments();
    } catch (err) {
      console.error('Error fetching number of files:', err);
      return 0;
    }
  }

  async usersCollection() {
    return this.client.db().collection('users');
  }

  async filesCollection() {
    return this.client.db().collection('files');
  }
}

export const dbClient = new DBClient();
export default dbClient;

