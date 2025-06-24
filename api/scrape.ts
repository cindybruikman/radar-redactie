// api/scrape.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import * as cheerio from 'cheerio'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' })
  }

  const { url, source_id } = req.body

  if (typeof url !== 'string' || typeof source_id !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing url/source_id' })
  }

  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const headlines = $('h1, h2, h3')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean)

    const paragraphs = $('p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean)

    return res.status(200).json({
      success: true,
      source_id,
      url,
      headlines,
      paragraphs,
    })
  } catch (error: any) {
    console.error('Scrape error:', error.message)
    return res.status(500).json({
      error: 'Failed to scrape content',
      detail: error.message,
    })
  }
}
