import { createClient } from "@sanity/client";

export const client = createClient({
  // projectId: "psodomd7",
  projectId: "psodomd7",
  dataset: "production",
  apiVersion: "2025-10-16",
  useCdn: false,
});

// deploymentId: gr9gdltyv94w0264s7xtlwfd
