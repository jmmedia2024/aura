import postgres from 'postgres';
export default {
  async fetch(request, env, ctx) {
    const sql = postgres(env.auraDB.connectionString);
  },
}
