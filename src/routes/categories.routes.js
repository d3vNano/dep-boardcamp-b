import { Router } from "express";
import {
    insertCategories,
    listCategories,
} from "../controllers/categories.controller.js";

const categoriesRouter = Router();

categoriesRouter.post("/categories", insertCategories);
categoriesRouter.get("/categories", listCategories);

export default categoriesRouter;
