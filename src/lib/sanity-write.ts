import { createClient } from "@sanity/client";

// Server-only client with write permissions
// IMPORTANT: Only import this in server-side code (API routes)
export const sanityWriteClient = createClient({
  projectId: "bvrczugu",
  dataset: "relicnritual",
  useCdn: false, // Must be false for writes
  apiVersion: "2024-01-01",
  token: import.meta.env.SANITY_WRITE_TOKEN,
});
