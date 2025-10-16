import axios from "axios";

export const api = axios.create({
  baseURL: "https://nasago.bubbleapps.io/version-test/api/1.1/wf",
});
