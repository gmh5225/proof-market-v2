import {Controller, Get, Route} from "tsoa";

@Route("/system")
export class SystemController extends Controller {

    @Get("/info")
    public systemInfo(): Promise<SystemInfo> {
        return Promise.resolve({
            depositAddress: "0x1ed7daacb963a579D83f3c1569BDA7D199a02A4E",
            network: "SEPOLIA",
        })
    }
}

export interface SystemInfo {
    depositAddress: string,
    network: string,
}
