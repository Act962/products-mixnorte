import { createClient } from "@sanity/client";

export const client = createClient({
  // projectId: "psodomd7",
  projectId: "psodomd7",
  dataset: "production",
  apiVersion: "2025-10-16",
  useCdn: false,
  token:
    "sk3CRGfq8RKdR3GwW0NDJpjZVeJwpc06OUgLoc10wibxwUjIKFdMzpySRnBZyOWVlNgowYX3TjqzdIXf5haZdx6VoctXgmWuhIfUiQU0nuop0nh9gqOkrUPIS1H75bOmQYXTlIZVP6Fg4t7kTy3J6ezuRPfiv4wy1PMnaPACnmURCQT8vxGk",
});

export interface SanityProduct {
  _type: "product";
  name: string;
  slug: {
    _type: "slug";
    current: string;
  };
  description?: string;
  price: number;
  unit?: string;
  createdAt: string;
}
