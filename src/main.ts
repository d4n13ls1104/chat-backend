import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from './entities/session.entity';
import * as session from 'express-session';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const appDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [
      'dist/entities/**/*.entity{.js,.ts}',
      './entities/**/*.entity{.js,.ts}',
    ],
  });

  appDataSource.initialize();

  const sessionRepo = appDataSource.getRepository(SessionEntity);

  app.enableCors({ origin: process.env.CORS_ORIGIN, credentials: true });
  app.setGlobalPrefix('api');

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'dev_secret',
      resave: false,
      saveUninitialized: false,
      name: 'qid',
      rolling: true,
      cookie: {
        maxAge: 60 * 1000 * 15,
        httpOnly: true,
        sameSite: true,
        // secure: true,
      },
      store: new TypeormStore({ cleanupLimit: 8 }).connect(sessionRepo),
    }),
  );

  await app.listen(3001);
};

bootstrap();
