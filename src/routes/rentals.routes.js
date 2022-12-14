import { Router } from "express";
import {
    insertRental,
    listRentals,
    finishRental,
    deleteRental,
} from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals");
rentalsRouter.get("/rentals");
rentalsRouter.post("/rentals");
rentalsRouter.delete("/rentals");

export default rentalsRouter;
