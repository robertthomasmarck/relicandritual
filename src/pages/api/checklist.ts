import type { APIRoute } from "astro";
import { sanityWriteClient } from "@lib/sanity-write";

// Simple auth token for single-user protection
const AUTH_TOKEN = import.meta.env.CHECKLIST_AUTH_TOKEN;

export const prerender = false; // Ensure this runs server-side

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const identifier = url.searchParams.get("id") || "year-of-bones";

  try {
    const query = `*[_type == "checklistState" && identifier == $identifier][0]`;
    const data = await sanityWriteClient.fetch(query, { identifier });

    return new Response(JSON.stringify(data || { items: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checklist fetch error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  // Simple auth check
  const authHeader = request.headers.get("Authorization");
  if (AUTH_TOKEN && authHeader !== `Bearer ${AUTH_TOKEN}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    const { identifier, checkboxId, checked, label } = body;

    if (!identifier || !checkboxId || typeof checked !== "boolean") {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
      });
    }

    // Find or create the checklist document
    const existingDoc = await sanityWriteClient.fetch(
      `*[_type == "checklistState" && identifier == $identifier][0]`,
      { identifier }
    );

    if (existingDoc) {
      // Check if item exists in array
      const existingItemIndex = existingDoc.items?.findIndex(
        (item: { id: string }) => item.id === checkboxId
      );

      if (existingItemIndex !== undefined && existingItemIndex >= 0) {
        // Update existing item - use array index syntax
        await sanityWriteClient
          .patch(existingDoc._id)
          .set({
            [`items[${existingItemIndex}].checked`]: checked,
          })
          .commit();
      } else {
        // Append new item
        await sanityWriteClient
          .patch(existingDoc._id)
          .setIfMissing({ items: [] })
          .append("items", [
            { _key: checkboxId, id: checkboxId, checked, label },
          ])
          .commit();
      }
    } else {
      // Create new document
      await sanityWriteClient.create({
        _type: "checklistState",
        identifier,
        items: [{ _key: checkboxId, id: checkboxId, checked, label }],
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checklist update error:", error);
    return new Response(JSON.stringify({ error: "Failed to update" }), {
      status: 500,
    });
  }
};
