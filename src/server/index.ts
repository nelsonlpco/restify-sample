import mongoose from 'mongoose';
import { createServer, plugins, Server } from 'restify';
import { ErrorsValidation } from './ErrorsValidation';
import { mergePatchBodyParser } from './merge-patch-parser';
import { Router } from './Router';

export class ApplicationServer {
  server: Server;

  constructor() {
    this.server = createServer({
      name: 'meat-api',
      version: '1.0.0',
    });
  }

  private async connectToMongo() {
    try {
      await mongoose.connect('mongodb://localhost:27017', {
        user: 'root',
        pass: 'ADMIN134',
        dbName: 'meat-api',
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      console.log('error to connect on mongodb', error);
    }

    console.log('connected to mongodb');
  }

  private async initServer(routes: Router[]) {
    this.server.use(plugins.bodyParser());
    this.server.use(plugins.queryParser());
    this.server.use(mergePatchBodyParser);

    routes.forEach((route) => route.setRoutes(this.server));

    this.server.on('restifyError', ErrorsValidation);

    return await new Promise((resolve) => {
      this.server.listen(3000, resolve);
    });
  }

  async bootstrap(routes: Router[] = []): Promise<void> {
    try {
      await this.initServer(routes);
      console.log(`server running on ${this.server.url}`);

      await this.connectToMongo();
    } catch (error) {
      console.log(error);
    }
  }
}
