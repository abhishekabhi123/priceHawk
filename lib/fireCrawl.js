const { default: Firecrawl } = require("@mendable/firecrawl-js");

const fireCrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

export async function scrapeProduct(url) {
  try {
    const result = await fireCrawl.scrape(url, {
      formats: [
        {
          type: "json",
          schema: {
            type: "object",
            properties: {
              productName: { type: "string" },
              currentPrice: { type: "number" },
              currencyCode: { type: "string" },
              productImageUrl: { type: "string" },
            },
            required: ["productName", "currentPrice"],
          },
          prompt:
            "Extract the product name as 'productName', current price as a number as 'currentPrice', currency code (USD, EUR, etc) as 'currencyCode', and product image URL as 'productImageUrl' if available",
        },
      ],
    });

    const extractedData = result.json;
    console.log(extractedData, "Data");

    if (!extractedData || !extractedData.productName)
      throw new Error("No data found from the URL");
    return extractedData;
  } catch (e) {
    // console.error("Firecrawl scrape error:", e);
    throw new Error("Failed to scrap", e.message);
  }
}
