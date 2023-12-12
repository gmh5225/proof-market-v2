import {dbClient} from "../../db/client";
import {UserEntity} from "./user";
import {BadRequestError} from "../../handler/error/error";

export async function userBalance(userId: number): Promise<number> {
    const user = await dbClient<UserEntity>('user')
        .where('id', userId)
        .first();
    if (!user) {
        throw new BadRequestError('User not found')
    }
    return user.balance
}
