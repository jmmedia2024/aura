import { Client } from 'pg'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Hyperdrive provides a unique generated connection string to connect to
    // your database via Hyperdrive that can be used with your existing tools
    const client = new Client({
      connectionString: env.HYPERDRIVE.connectionString
    })

    try {
      await client.connect()

      // Sample query
      const result = await client.query('SELECT * from pg_tables')

      return Response.json({ result: result.rows })
    } catch (e) {
      return Response.json({ error: e instanceof Error ? e.message : e }, { status: 500 })
    } finally {
      // Close the client after the response is returned
      ctx.waitUntil(client.end())
    }
  }
}
