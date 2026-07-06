import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

function sb() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_paintings",
  title: "List paintings",
  description: "List paintings from the Sali Arts gallery. Filter by availability (sold or available) or category.",
  inputSchema: {
    status: z.enum(["all", "available", "sold"]).default("all").describe("Filter paintings by sale status."),
    category: z.string().optional().describe("Optional category filter."),
    limit: z.number().int().min(1).max(100).default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, category, limit }) => {
    let q = sb().from("paintings").select("id,title,price,category,medium,dimensions,year,sold,image_url,description").eq("active", true).limit(limit);
    if (status === "available") q = q.eq("sold", false);
    if (status === "sold") q = q.eq("sold", true);
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { paintings: data ?? [] },
    };
  },
});