import express from "express";
import { api as fresherApi } from "./freshers";
import { api as advancedApi } from "./advanced";
import { api as loginApi } from "./login";
import { api as customerApi } from "./customer";

// At endpoint /api

export const apis = express();

apis.use("/f", fresherApi);
apis.use("/t", advancedApi);
apis.use("/c", customerApi);
apis.use("/signin", loginApi);
