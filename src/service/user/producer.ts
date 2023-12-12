import {dbClient} from "../../db/client";
import {UserEntity} from "./user";


export async function isProducer(userId: number): Promise<boolean> {
    const user = await dbClient<UserEntity>('user')
        .where('id', userId)
        .first();
    return user!.producer
}
