import { param } from "express-validator";
import { checkValidationResult } from "../../shared/middlewares/checkValidationResult";

export const validasiAmbilDetailJenjang = [
	param("jenjang_id").isUUID(4).withMessage("ID Jenjang harus berupa UUID (String)."),
	checkValidationResult,
];
