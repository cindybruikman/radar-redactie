// api/scrape.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Supabase client speciaal voor server functions (gebruik process.env)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Alleen POST toegestaan' });
  }

  const { url, source_id } = req.body;

  if (!url || !source_id) {
    return res.status(400).json({ error: 'url en source_id zijn verplicht' });
  }

  try {
    const response = await axios.get(url);
    const html = response.data as string;

    // Simpele scraping
    const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? 'Geen titel';
    const paragraphs = Array.from(html.matchAll(/<p[^>]*>(.*?)<\/p>/g)).map(m => m[1]);

    const { data, error } = await supabase.from('signals').insert([
      {
        source_id,
        title,
        content: paragraphs.join(' ').slice(0, 500),
        url,
      },
    ]);

    if (error) {
      return res.status(500).json({ success: false, error: 'Supabase fout', detail: error.message });
    }

    return res.status(200).json({ success: true, inserted: data });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Scraping mislukt', detail: err.message });
  }
}