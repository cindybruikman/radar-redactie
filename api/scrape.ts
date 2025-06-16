// api/scrape.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { scrapeWebsite } from '../src/lib/scraper';
import { supabase } from '../src/lib/supabaseClient';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Alleen POST toegestaan' });
  }

  const { url, source_id } = req.body;

  if (!url || !source_id) {
    return res.status(400).json({ error: 'url en source_id zijn verplicht' });
  }

  const result = await scrapeWebsite(url);

  if (!result.success) {
    return res.status(500).json({ error: 'Scraping mislukt', detail: result.error });
  }

  const { data, error } = await supabase.from('signals').insert([
    {
      source_id,
      title: result.headlines?.[0] ?? 'Geen titel',
      content: result.paragraphs?.join(' ').slice(0, 500) ?? '',
      url,
    },
  ]);

  if (error) {
    return res.status(500).json({ error: 'Fout bij opslaan', detail: error });
  }

  return res.status(200).json({ success: true, inserted: data });
}
