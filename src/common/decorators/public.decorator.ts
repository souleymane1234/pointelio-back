import { SetMetadata } from "@nestjs/common";
import { IS_PUBLIC_KEY } from "../constants/auth.constants";

/** Routes ouvertes sans authentification. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
