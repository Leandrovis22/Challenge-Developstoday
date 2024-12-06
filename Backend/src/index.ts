import cors from "cors";
import express from "express";
import { countriesController } from "./controllers/countriesController";
import { countryInfoController } from "./controllers/countryInfoController";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3001" }));

app.get("/countries", countriesController);

app.get("/country-info/:countryCode", countryInfoController);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


