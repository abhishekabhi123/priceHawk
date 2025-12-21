import { scrapeProduct } from "@/lib/fireCrawl";
import { sendPriceDropAlert } from "@/lib/sendEmailAlert";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Price endpoint is working" });
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const supaBase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_SERVICE_ROLE_KEY
    );
    const { data: products, error: productError } = await supaBase
      .from("products")
      .select("*");
    if (productError) throw productError;
    console.log(`Found ${products.length} items`);

    const results = {
      total: products.length,
      updated: 0,
      failed: 0,
      priceChanges: 0,
      alertsSent: 0,
    };

    for (const product of products) {
      try {
        const productData = await scrapeProduct(product.url);

        if (!productData.currentPrice) {
          results.failed++;
        }

        const newPrice = parseFloat(productData.currentPrice);
        const oldPrice = parseFloat(product.current_price);

        await supaBase
          .from("products")
          .update({
            current_price: newPrice,
            currency: productData.currency || product.currency,
            name: productData.name || product.name,
            image_url: productData.image_url || product.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        if (oldPrice !== newPrice) {
          await supaBase.from("price_history").insert({
            product_id: product.id,
            currency: productData.currency || product.currency,
            price: newPrice,
          });

          results.priceChanges++;

          if (newPrice < oldPrice) {
            const { data: user } = await supaBase.auth.admin.getUserById(
              product.user_id
            );
            if (user?.email) {
              // email sent
              const emailResponse = await sendPriceDropAlert(
                user.email,
                newPrice,
                oldPrice,
                product
              );
              if (emailResponse.success) {
                results.alertsSent++;
              }
            }
          }
        }
        results.updated++;
      } catch (error) {
        console.log("error", error);
        results.failed++;
      }
    }
    return NextResponse.json({
      success: true,
      message: "Price check completed",
      results,
    });
  } catch (error) {
    console.log("Cron error", error);
    return NextResponse.json({ status: 500, error: error.message });
  }
}
