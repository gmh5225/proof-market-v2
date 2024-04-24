import {AssignerResult} from "./assigner";
import path from "node:path";
import fs from "fs";
import logger from "../../logger";
import {exec} from "node:child_process";
import {proofGeneratorPath} from "../../config/props";

export async function verify(assignResult: AssignerResult, proof: string): Promise<VerifyResult> {
    const proofPath = path.join(assignResult.dir, `proofFile-${assignResult.uuid}`)
    fs.writeFile(proofPath, proof, (err) => {
        if (err) {
            return logger.error('Error writing to temporary file:', err)
        }
        logger.info(`Temporary file created at: ${proofPath}`)
    })
    let result = true
    let err = null
    exec(`${proofGeneratorPath} --proof=${proofPath} --assignment-table=${assignResult.assignmentPath} --circuit=${assignResult.circuitPath}`,
        (error, stdout, stderr) => {
            logger.info(`Run ${proofGeneratorPath} --proof=${proofPath} --assignment-table=${assignResult.assignmentPath} --circuit=${assignResult.circuitPath}`)
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
    }
}

export interface VerifyResult {
    result: boolean
    error: string | null
}
