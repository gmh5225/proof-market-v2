import {dbClient} from "../../db/client";
import {StatementEntity} from "../../repository/statement";
import {NotFoundError} from "../../handler/error/error";
import {exec} from "node:child_process";
import {assignerPath} from "../../config/props";
import * as os from "node:os";
import path from "node:path";
import fs from "fs";
import {RequestEntity} from "../../repository/request";
import {randomUUID} from "node:crypto";
import logger from "../../logger";


export async function assign(
    requestId: number,
    statementId: number,
): Promise<AssignerResult> {
    const statement = await dbClient<StatementEntity>('statement')
        .where('id', statementId)
        .first()
        .select()
    if (!statement) {
        throw new NotFoundError(`Statement ${statementId} not found`)
    }
    const request = await dbClient<RequestEntity>('request')
        .where('id', requestId)
        .first()
        .select()
    if (!request) {
        throw new NotFoundError(`Request ${requestId} not found`)
    }
    const assignerResult = runAssigner(statement, request)
    if (!assignerResult.result) {
        throw new NotFoundError(`Illegal proof: ${assignerResult.error}`)
    }
    return assignerResult
}

function runAssigner(
    statement: StatementEntity,
    request: RequestEntity,
): AssignerResult {
    const llContent = JSON.parse(statement.definition)['proving_key'] as string
    const tempDir = os.tmpdir()
    const uuid = randomUUID()
    const provingKeyPath = path.join(tempDir, `provingKeyFile-${uuid}`)
    const inputPath = path.join(tempDir, `inputFile-${uuid}`)
    const assignmentPath = path.join(tempDir, `assignmentFile-${uuid}`)
    const circuitPath = path.join(tempDir, `circuitFile-${uuid}`)
    fs.writeFile(provingKeyPath, llContent, (err) => {
        if (err) {
            return logger.error('Error writing to temporary file:', err)
        }
        logger.info(`Temporary file created at: ${provingKeyPath}`)
    })
    fs.writeFile(inputPath, request.input, (err) => {
        if (err) {
            return logger.error('Error writing to temporary file:', err)
        }
        logger.info(`Temporary file created at: ${inputPath}`)
    })
    let result = true
    let err = null
    exec(`${assignerPath} -b ${provingKeyPath} -i ${inputPath} -t ${assignmentPath} -c ${circuitPath} -e pallas`,
        (error, stdout, stderr) => {
            logger.info(`Run ${assignerPath} -b ${provingKeyPath} -i ${inputPath} -t ${assignmentPath} -c ${circuitPath} -e pallas`)
            if (error) {
                err = error
                logger.error(`exec error : ${error}`)
                result = false
                return
            }
            logger.info(`stdout: ${stdout}`)
            logger.error(`stderr: ${stderr}`)
        })
    return {
        result: result,
        error: err,
        uuid: uuid,
        dir: tempDir,
        assignmentPath: assignmentPath,
        circuitPath: circuitPath,
    }
}

export interface AssignerResult {
    result: boolean
    error: string | null
    uuid: string
    dir: string
    assignmentPath: string
    circuitPath: string
}
