import express from "express";
import cors from "cors";
import disclosureRoutes from "./routes/disclosure.routes.js";
import dataPointRoutes from "./routes/dataPoint.routes.js";
import merkleRoutes from "./routes/merkle.routes.js";



const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/disclosures", disclosureRoutes);
app.use("/data-points", dataPointRoutes);

app.use("/merkle", merkleRoutes);

app.listen(4000, () => {
  console.log("Server running on port 4000");
});