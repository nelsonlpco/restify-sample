import { EventEmitter } from 'events';
import { Next, Response, Server } from 'restify';

export abstract class Router extends EventEmitter {
  abstract setRoutes(server: Server): void;

  envelop(document: any): any {
    return document;
  }

  envelopAll(document: any, options: any = {}): any {
    return document;
  }

  render(response: Response, next: Next) {
    return (document: any) => {
      if (document) {
        response.json(this.envelop(document));
        response.json(document);
      } else {
        response.send(404);
      }

      return next();
    };
  }

  renderAll(response: Response, next: Next, options: any = {}) {
    return (documents: any) => {
      if (documents) {
        documents.forEach((document: any, index: any, array: any[]) => {
          this.emit('beforeRender', document);
          array[index] = this.envelop(document);
        });

        response.json(this.envelopAll(documents, options));
      } else {
        response.json(this.envelopAll([]));
      }

      return next();
    };
  }
}
