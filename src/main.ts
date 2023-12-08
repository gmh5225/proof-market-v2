import {dbClient} from "./db/client";
import Koa from 'koa';
import {route} from "./route/route";
import bodyParser from "koa-bodyparser";
import {handleError} from "./handler/error/error";

async function migrateDb() {
    try {
        await dbClient.migrate.latest();
        console.log('Database migrations are up to date');
    } catch (err) {
        console.error('Error running migrations', err);
        process.exit(1);
    }
}

function buildApp() {
    const app = new Koa();
    app.use(route.routes())
        .use(route.allowedMethods())
        .use(bodyParser())
        .use(handleError)
    return app
}

async function startApp() {
    await migrateDb()
    const app = buildApp()

    app.listen(3000)
}

startApp()
    .then(() => {
        console.log("Started")
    })
