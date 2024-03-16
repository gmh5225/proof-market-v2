import {Controller, Get, Path, Route} from "tsoa";

@Route("/system")
export class SystemController extends Controller {

    @Get("/info")
    public systemInfo(): SystemInfo {
        return {
            depositAddress: "// TODO: hardcode",
            network: "SEPOLIA",
        }
    }
}

export interface SystemInfo {
    depositAddress: string,
    network: string,
}
