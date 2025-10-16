import { Lead } from "./lead";

export interface ApiResponse {
  status: "success" | "error";
  response: {
    lead: Lead;
    userExist: boolean;
    userActive: boolean;
  };
}
