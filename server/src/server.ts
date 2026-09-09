import { app } from './app.js';
import { config, prisma } from './config/index.js';

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database via Prisma.');

    const server = app.listen(config.port, () => {
      console.log(`🎬 CinePulse API Server running on port ${config.port} (${config.nodeEnv})`);
      console.log(`🌐 Base URL: http://localhost:${config.port}`);
      console.log(`🍿 Health Check: http://localhost:${config.port}/api/health`);
    });

    const shutdown = async () => {
      console.log('\n🛑 Gracefully shutting down CinePulse server...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('💤 Disconnected from database.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
