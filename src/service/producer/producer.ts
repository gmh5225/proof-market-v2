import {RegisterProducerRequest} from "../../handler/producer/register";
import {findByUserId, insert, ProducerEntity, remove, update} from "../../repository/producer";
import {findById, update as userUpdate} from "../../repository/user";
import {BadRequestError} from "../../handler/error/error";

export async function registerOrUpdate(request: RegisterProducerRequest, userId: number): Promise<ProducerEntity> {
    const user = await findById(userId);
    if (!user) {
        throw new BadRequestError("User not found")
    }
    user.producer = true
    const producer = await findByUserId(userId);
    await userUpdate(user)
    if (producer) {
        producer.description = request.description
        producer.ethAddress = request.ethAddress
        producer.url = request.url
        producer.name = request.name
        return update(producer)
    } else {
        const newProducer: ProducerEntity = {
            ...request,
            userId: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            id: null,
        }
        return insert(newProducer)
    }
}

export async function removeProducer(userId: number): Promise<boolean> {
    const user = await findById(userId);
    if (!user) {
        throw new BadRequestError("User not found")
    }
    const producer = await findByUserId(userId);
    if (!producer) {
        return false
    }
    await remove(producer!.id!)
    return true
}

