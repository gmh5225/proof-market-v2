import Koa from "koa";

export async function handleError(ctx: Koa.ParameterizedContext<any>, next: Koa.Next) {
    try {
        await next()
    } catch (err) {
        if (err instanceof ApplicationError) {
            ctx.status = err.status;
            ctx.body = {
                error: err.message
            }
        } else {
            ctx.status = 500
            ctx.body = {
                error: "Internal Error"
            }
        }
    }
}

export class ApplicationError extends Error {
    status: number;

    constructor(name: string, status: number, message: string) {
        super(message);
        this.status = status;
        this.name = name;
    }
}

export class BadRequestError extends ApplicationError {
    constructor(message: string) {
        super("BadRequestError", 400, message);
    }
}

export class NotFoundError extends ApplicationError {

    constructor(message: string) {
        super("NotFoundError", 404, message);
    }
}
