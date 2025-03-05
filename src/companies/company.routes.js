import { Router } from "express";
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js'
import { getCompaniesByAZ, getCompaniesByZA, getCompaniesByYear , createCompany, updateCompany, generateExcel } from "./company.controller.js";
import { existeCompanyById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from '../middlewares/validar-jwt.js'
import { check } from "express-validator";

const router = Router();

router.get("/A-Z", getCompaniesByAZ);

router.get("/Z-A", getCompaniesByZA);

router.get("/Years", getCompaniesByYear);

router.post(
    "/",
    [
        validarCampos,
        deleteFileOnError
    ],
    createCompany
)

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCompanyById),
        validarCampos,
        deleteFileOnError
    ],
    updateCompany
)

router.get(
    "/excel",
    [
        validarCampos,
        deleteFileOnError
    ],
    generateExcel
)

export default router;