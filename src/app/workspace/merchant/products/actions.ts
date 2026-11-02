"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRoles } from "@/lib/auth/guards";
import { MERCHANT_ROLES } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
function field(data: FormData, key: string) { const value=data.get(key); return typeof value==="string"?value.trim():""; }
export async function createMerchantProduct(data: FormData) {
 const user=await requireRoles(MERCHANT_ROLES);
 const name=field(data,"name"), description=field(data,"description"), categoryId=field(data,"category_id")||null;
 const rawPrice=field(data,"price_iqd"), rawStock=field(data,"stock_quantity"), sku=field(data,"sku")||null, unit=field(data,"unit")||"piece";
 const price=Number(rawPrice), stock=rawStock===""?null:Number(rawStock);
 if(name.length<2||name.length>180||description.length>2000||!/^\d+$/.test(rawPrice)||!Number.isSafeInteger(price)||price<0||(stock!==null&&(!/^\d+$/.test(rawStock)||!Number.isSafeInteger(stock)||stock<0))||unit.length<1||unit.length>32||(sku&&sku.length>120)) redirect("/workspace/merchant/products?error=invalid");
 const supabase=await createClient();
 const {data:store,error:storeError}=await supabase.from("stores").select("id,status").eq("owner_id",user.id).eq("is_platform_store",false).maybeSingle();
 if(storeError||!store||store.status!=="active") redirect("/workspace/merchant/products?error=store_unavailable");
 const {error}=await supabase.from("products").insert({store_id:store.id,category_id:categoryId,name,description:description||null,sku,price_iqd:price,stock_quantity:stock,unit,status:"draft",is_available:true});
 if(error){console.error("Merchant product insert failed:",error.code);redirect(error.code==="23505"?"/workspace/merchant/products?error=sku_taken":"/workspace/merchant/products?error=save_failed");}
 revalidatePath("/workspace/merchant/products"); redirect("/workspace/merchant/products?saved=1");
}
export async function setMerchantProductStatus(data: FormData) {
 const user=await requireRoles(MERCHANT_ROLES), productId=field(data,"product_id"), nextStatus=field(data,"next_status");
 if(!/^[0-9a-f-]{36}$/i.test(productId)||!["draft","published","archived"].includes(nextStatus)) redirect("/workspace/merchant/products?error=invalid");
 const supabase=await createClient();
 const {data:store}=await supabase.from("stores").select("id,status").eq("owner_id",user.id).eq("is_platform_store",false).maybeSingle();
 if(!store||store.status!=="active") redirect("/workspace/merchant/products?error=store_unavailable");
 const {error}=await supabase.from("products").update({status:nextStatus}).eq("id",productId).eq("store_id",store.id).select("id").maybeSingle();
 if(error){console.error("Merchant product status update failed:",error.code);redirect("/workspace/merchant/products?error=save_failed");}
 revalidatePath("/workspace/merchant/products");redirect("/workspace/merchant/products?saved=1");
}