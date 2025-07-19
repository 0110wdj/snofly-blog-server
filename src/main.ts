import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 配置CORS
  app.enableCors({
    origin: [
      'http://localhost:4321', // Astro开发服务器默认端口
      'http://localhost:3000', // 可能的其他前端端口
      'http://127.0.0.1:4321',
      'http://127.0.0.1:3000',
      // 生产环境域名
      // 'https://yourdomain.com',
      // 'http://yourdomain.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false
  });
  
  // 添加请求日志中间件
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`📨 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log(`   Origin: ${req.headers.origin}`);
    console.log(`   User-Agent: ${req.headers['user-agent']}`);
    if (req.method === 'POST') {
      console.log(`   Content-Type: ${req.headers['content-type']}`);
      console.log(`   Body:`, req.body);
    }
    next();
  });
  
  await app.listen(9527);
  console.log('🚀 后端服务已启动，端口: 9527');
  console.log('📝 CORS已配置，支持前端跨域请求');
  console.log('📊 请求日志已启用');
}
bootstrap();
