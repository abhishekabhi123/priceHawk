"use server";

import { scrapeProduct } from "@/lib/fireCrawl";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}

export async function addProduct(formData) {
  const url = formData.get("url");
  if (!url) return { error: "URL is required" };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated" };

    const productData = await scrapeProduct(url);
    // console.log(productData, "prodData");

    if (!productData.productName || !productData.currentPrice) {
      return { error: "Could not fetch information about this product" };
    }

    const newPrice = parseFloat(productData.currentPrice);
    const currency = productData.currencyCode || "USD";

    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, current_price")
      .eq("user_id", user.id)
      .eq("url", url)
      .single();

    const isUpdate = !!existingProduct;

    const { data: product, error } = await supabase
      .from("products")
      .upsert(
        {
          user_id: user.id,
          url,
          current_price: newPrice,
          currency,
          name: productData.productName,
          image_url: productData.productImageUrl,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id, url",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }
    const shouldAddHistory =
      !isUpdate || existingProduct.current_price !== newPrice;

    if (shouldAddHistory) {
      await supabase.from("price_history").insert({
        product_id: product.id,
        price: newPrice,
        currency: currency,
      });
    }
    revalidatePath("/");
    return {
      success: true,
      product,
      message: isUpdate ? "Product updated" : "Product added",
    };
  } catch (error) {
    console.log(error);
    return { error: error.message || "Failed to add product" };
  }
}

export async function deleteProduct(product_id) {
  try {
    const supabase = createClient();
    const { data, error } = (await supabase)
      .from("products")
      .delete()
      .eq("product_id", product_id);
    if (error) throw error;
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getProducts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}

export async function getPriceHistory(product_id) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("price_history")
      .select("*")
      .eq("product_id", product_id)
      .order("checked_at", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.log(error, "error fetching history");
    return { error: error.message };
  }
}
