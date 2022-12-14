import { Router } from "express";
import {
    insertCustomer,
    listCustomer,
    listCustomers,
    updateCustomer,
} from "../controllers/customers.controller.js";

const customersRouter = Router();

customersRouter.post("customers", insertCustomer);
customersRouter.get("customers", listCustomer);
customersRouter.get("customers", listCustomers);
customersRouter.put("customers", updateCustomer);

export default customersRouter;
