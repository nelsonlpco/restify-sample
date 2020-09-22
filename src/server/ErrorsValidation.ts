import { Request, Response } from 'restify';

export const ErrorsValidation = (req: Request, resp: Response, error: any, callback: any) => {
  console.log(error.message, error.code);
  if (error.name === 'ValidationError') {
    let messages: any[] = [];

    for (const name in error.errors) {
      messages.push(error.errors[name].message);
    }

    error.errors = messages;
  }

  error.statusCode = 400;
  callback();
};
