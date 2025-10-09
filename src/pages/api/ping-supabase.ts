import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_ANON_KEY!;
    if (!url || !key) throw new Error("Missing env vars");

    const endpoint = `${url}/rest/v1/health_heartbeat?select=id&limit=1`;
    const r = await fetch(endpoint, { headers: { apikey: key } });
    if (!r.ok) throw new Error(`Supabase responded ${r.status}`);

    res.status(200).json({ ok: true, status: r.status });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
