// /src/pages/api/ping-supabase.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    if (!url || !key) throw new Error("Missing SUPABASE env vars");

    // 전용 하트비트 테이블을 1건 조회 (실데이터 반환 없이 헤더만)
    const endpoint = `${url}/rest/v1/health_heartbeat?select=id&limit=1`;
    const r = await fetch(endpoint, { headers: { apikey: key } });

    if (!r.ok) throw new Error(`Supabase responded ${r.status}`);
    res.status(200).json({ ok: true, status: r.status });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
