import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

const sql = postgres(connectionString!, {
  ssl: 'allow', // 更改为 allow 以提高兼容性
  connect_timeout: 10,
});

export default sql;
