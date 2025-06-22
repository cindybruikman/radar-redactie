// api/scrape.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Alleen POST toegestaan" });
  }


  const { url, source_id } = req.body;

  if (!url || !source_id) {
    return res.status(400).json({ error: "url en source_id zijn verplicht" });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const headlines = $("h1, h2, h3")
      .map((_, el) => $(el).text())
      .get();
    const paragraphs = $("p")
      .map((_, el) => $(el).text())
      .get();

    return res.status(200).json({
      success: true,
      source_id,
      url,
      headlines,
      paragraphs,
    });
  } catch (error: any) {
    console.error("Scrape error:", error);
    return res
      .status(500)
      .json({ error: "Scraping mislukt", detail: error.message });
  }
}
