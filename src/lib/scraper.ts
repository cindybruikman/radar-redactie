// src/lib/scraper.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeWebsite(url: string) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0', // sommige sites blokkeren bots zonder dit
      },
    });

    const $ = cheerio.load(html);

    const headlines = $('h1').map((_, el) => $(el).text().trim()).get();
    const paragraphs = $('p').map((_, el) => $(el).text().trim()).get();

    return {
      success: true,
      headlines,
      paragraphs,
    };
  } catch (error) {
    console.error('Scraping mislukt:', error);
    return { success: false, error };
  }
}
