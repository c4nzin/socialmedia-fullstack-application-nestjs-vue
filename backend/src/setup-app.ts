import { Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Config, ENV } from './config/config';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { ValidationPipe } from './core/pipes/validation.pipe';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { Logger } from 'nestjs-pino';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import passport from 'passport';
import helmet from 'helmet';
import compression from 'compression';
import expressMongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';

export async function setupApp(app: NestExpressApplication) {
  const config = app.get<Config>(ENV);

  app.use(
    cors({
      origin: 'http://localhost:3001',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  app.use(helmet());
  app.use(compression());
  app.use(
    expressMongoSanitize({
      replaceWith: '_',
      allowDots: true,
      dryRun: true,
    }),
  );

  app.use(
    session({
      cookie: {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000, //24hours
        secure: false,
      },
      secret: config.SESSION_SECRET,
      name: 'sessionId',
      resave: false,
      saveUninitialized: false,
      store: connectMongo.create({ mongoUrl: config.DB_URI, ttl: 7 * 24 * 60 * 60 }),
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));

  if (config.isDev) {
    const logger = app.get<Logger>(Logger);
    app.useGlobalInterceptors(new LoggingInterceptor(logger));
  }

  app.setGlobalPrefix(config.GLOBAL_PREFIX);

  app.use(passport.initialize());
  app.use(passport.session());
}
