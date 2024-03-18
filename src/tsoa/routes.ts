/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../route/UserController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SystemController } from './../route/SystemController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StatementController } from './../route/StatementController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RequestController } from './../route/RequestController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ProposalController } from './../route/ProposalController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ProofController } from './../route/ProofController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ProducerController } from './../route/ProducerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BookController } from './../route/BookController';
import type { Middleware } from 'koa';
import type * as KoaRouter from '@koa/router';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "MetamaskAuthMessage": {
        "dataType": "refObject",
        "properties": {
            "msg": {"dataType":"string","required":true},
            "expiration": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthUser": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "jwt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MetamaskAuthRequest": {
        "dataType": "refObject",
        "properties": {
            "msg": {"dataType":"string","required":true},
            "signRaw": {"dataType":"string","required":true},
            "addressRaw": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserDetails": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "address": {"dataType":"string","required":true},
            "balance": {"dataType":"double","required":true},
            "producer": {"dataType":"boolean","required":true},
            "createdAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SystemInfo": {
        "dataType": "refObject",
        "properties": {
            "depositAddress": {"dataType":"string","required":true},
            "network": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatementItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
            "input_description": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "definition": {"dataType":"any","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateStatementRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
            "input_description": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "isPrivate": {"dataType":"boolean","required":true},
            "definition": {"dataType":"any","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RequestStatus": {
        "dataType": "refEnum",
        "enums": [0,1,2],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RequestItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "status": {"ref":"RequestStatus","required":true},
            "statementId": {"dataType":"double","required":true},
            "cost": {"dataType":"double","required":true},
            "proofId": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "input": {"dataType":"any","required":true},
            "aggregatedModeId": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRequestRequest": {
        "dataType": "refObject",
        "properties": {
            "statementId": {"dataType":"double","required":true},
            "input": {"dataType":"any","required":true},
            "cost": {"dataType":"double","required":true},
            "aggregatedModeId": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"undefined"}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProposalStatus": {
        "dataType": "refEnum",
        "enums": [0,1,2,3],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProposalItem": {
        "dataType": "refObject",
        "properties": {
            "statementId": {"dataType":"double","required":true},
            "id": {"dataType":"double","required":true},
            "cost": {"dataType":"double","required":true},
            "status": {"ref":"ProposalStatus","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateProposalRequest": {
        "dataType": "refObject",
        "properties": {
            "statementId": {"dataType":"double","required":true},
            "cost": {"dataType":"double","required":true},
            "waitingDurationSeconds": {"dataType":"double","required":true},
            "maxGenerationDurationSeconds": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProofItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "proof": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubmitProofRequest": {
        "dataType": "refObject",
        "properties": {
            "proof": {"dataType":"any","required":true},
            "request_key": {"dataType":"double","required":true},
            "proposal_key": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterProducerResponse": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
            "ethAddress": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterProducerRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
            "ethAddress": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatementBookItem": {
        "dataType": "refObject",
        "properties": {
            "cost": {"dataType":"double","required":true},
            "createdAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatementBook": {
        "dataType": "refObject",
        "properties": {
            "proposals": {"dataType":"array","array":{"dataType":"refObject","ref":"StatementBookItem"},"required":true},
            "requests": {"dataType":"array","array":{"dataType":"refObject","ref":"StatementBookItem"},"required":true},
            "lastMatchCost": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "instantMatchCost": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "processingMatchCount": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookAssignedItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "proposalId": {"dataType":"double","required":true},
            "requestId": {"dataType":"double","required":true},
            "statementId": {"dataType":"double","required":true},
            "input": {"dataType":"string","required":true},
            "definition": {"dataType":"string","required":true},
            "matchedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(router: KoaRouter) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        router.get('/user/metamask/message',
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.metamaskAuthMessage)),

            async function UserController_metamaskAuthMessage(context: any, next: any) {
            const args = {
                    address: {"in":"query","name":"address","required":true,"dataType":"string"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new UserController();

            const promise = controller.metamaskAuthMessage.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/user/metamask',
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.metamaskAuth)),

            async function UserController_metamaskAuth(context: any, next: any) {
            const args = {
                    request: {"in":"body","name":"request","required":true,"ref":"MetamaskAuthRequest"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new UserController();

            const promise = controller.metamaskAuth.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/user/info',
            ...(fetchMiddlewares<Middleware>(UserController)),
            ...(fetchMiddlewares<Middleware>(UserController.prototype.me)),

            async function UserController_me(context: any, next: any) {
            const args = {
                    jwt: {"in":"header","name":"Authorization","required":true,"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new UserController();

            const promise = controller.me.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/system/info',
            ...(fetchMiddlewares<Middleware>(SystemController)),
            ...(fetchMiddlewares<Middleware>(SystemController.prototype.systemInfo)),

            async function SystemController_systemInfo(context: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new SystemController();

            const promise = controller.systemInfo.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/statement/:id',
            ...(fetchMiddlewares<Middleware>(StatementController)),
            ...(fetchMiddlewares<Middleware>(StatementController.prototype.getById)),

            async function StatementController_getById(context: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"string"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new StatementController();

            const promise = controller.getById.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/statement',
            ...(fetchMiddlewares<Middleware>(StatementController)),
            ...(fetchMiddlewares<Middleware>(StatementController.prototype.getByFilter)),

            async function StatementController_getByFilter(context: any, next: any) {
            const args = {
                    limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    owned: {"default":false,"in":"query","name":"owned","dataType":"boolean"},
                    jwt: {"in":"header","name":"authorization","required":true,"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new StatementController();

            const promise = controller.getByFilter.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/statement',
            ...(fetchMiddlewares<Middleware>(StatementController)),
            ...(fetchMiddlewares<Middleware>(StatementController.prototype.createStatement)),

            async function StatementController_createStatement(context: any, next: any) {
            const args = {
                    jwt: {"in":"header","name":"authorization","required":true,"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
                    request: {"in":"body","name":"request","required":true,"ref":"CreateStatementRequest"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new StatementController();

            const promise = controller.createStatement.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/request/:id',
            ...(fetchMiddlewares<Middleware>(RequestController)),
            ...(fetchMiddlewares<Middleware>(RequestController.prototype.getById)),

            async function RequestController_getById(context: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RequestController();

            const promise = controller.getById.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/request',
            ...(fetchMiddlewares<Middleware>(RequestController)),
            ...(fetchMiddlewares<Middleware>(RequestController.prototype.getByFilter)),

            async function RequestController_getByFilter(context: any, next: any) {
            const args = {
                    costFrom: {"in":"query","name":"costFrom","required":true,"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"undefined"}]},
                    createdAtFrom: {"in":"query","name":"createdAtFrom","required":true,"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"undefined"}]},
                    owned: {"default":false,"in":"query","name":"owned","dataType":"boolean"},
                    statementId: {"in":"query","name":"statementId","required":true,"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"undefined"}]},
                    status: {"in":"query","name":"status","required":true,"dataType":"union","subSchemas":[{"ref":"RequestStatus"},{"dataType":"undefined"}]},
                    limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    jwt: {"in":"header","name":"authorization","required":true,"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RequestController();

            const promise = controller.getByFilter.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/request',
            ...(fetchMiddlewares<Middleware>(RequestController)),
            ...(fetchMiddlewares<Middleware>(RequestController.prototype.createRequest)),

            async function RequestController_createRequest(context: any, next: any) {
            const args = {
                    request: {"in":"body","name":"request","required":true,"ref":"CreateRequestRequest"},
                    jwt: {"in":"header","name":"authorization","required":true,"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RequestController();

            const promise = controller.createRequest.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.delete('/request/:id',
            ...(fetchMiddlewares<Middleware>(RequestController)),
            ...(fetchMiddlewares<Middleware>(RequestController.prototype.deleteRequest)),

            async function RequestController_deleteRequest(context: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    jwt: {"in":"header","name":"authorization","required":true,"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new RequestController();

            const promise = controller.deleteRequest.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/proposal/:id',
            ...(fetchMiddlewares<Middleware>(ProposalController)),
            ...(fetchMiddlewares<Middleware>(ProposalController.prototype.getById)),

            async function ProposalController_getById(context: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    jwt: {"in":"header","name":"authorization","required":true,"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new ProposalController();

            const promise = controller.getById.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/proposal',
            ...(fetchMiddlewares<Middleware>(ProposalController)),
            ...(fetchMiddlewares<Middleware>(ProposalController.prototype.getByFilter)),

            async function ProposalController_getByFilter(context: any, next: any) {
            const args = {
                    limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                    offset: {"default":0,"in":"query","name":"offset","dataType":"double"},
                    owned: {"default":false,"in":"query","name":"owned","dataType":"boolean"},
                    statementId: {"in":"query","name":"statementId","required":true,"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"undefined"}]},
                    status: {"in":"query","name":"status","required":true,"dataType":"union","subSchemas":[{"ref":"ProposalStatus"},{"dataType":"undefined"}]},
                    jwt: {"in":"header","name":"authorization","required":true,"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new ProposalController();

            const promise = controller.getByFilter.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/proposal',
            ...(fetchMiddlewares<Middleware>(ProposalController)),
            ...(fetchMiddlewares<Middleware>(ProposalController.prototype.createProposal)),

            async function ProposalController_createProposal(context: any, next: any) {
            const args = {
                    request: {"in":"body","name":"request","required":true,"ref":"CreateProposalRequest"},
                    jwt: {"in":"header","name":"authorization","required":true,"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new ProposalController();

            const promise = controller.createProposal.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.delete('/proposal/:id',
            ...(fetchMiddlewares<Middleware>(ProposalController)),
            ...(fetchMiddlewares<Middleware>(ProposalController.prototype.deleteProposal)),

            async function ProposalController_deleteProposal(context: any, next: any) {
            const args = {
                    id: {"in":"path","name":"id","required":true,"dataType":"double"},
                    jwt: {"in":"header","name":"authorization","required":true,"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new ProposalController();

            const promise = controller.deleteProposal.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/proof/:id',
            ...(fetchMiddlewares<Middleware>(ProofController)),
            ...(fetchMiddlewares<Middleware>(ProofController.prototype.getById)),

            async function ProofController_getById(context: any, next: any) {
            const args = {
                    id: {"in":"query","name":"id","required":true,"dataType":"double"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new ProofController();

            const promise = controller.getById.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/proof',
            ...(fetchMiddlewares<Middleware>(ProofController)),
            ...(fetchMiddlewares<Middleware>(ProofController.prototype.submitProof)),

            async function ProofController_submitProof(context: any, next: any) {
            const args = {
                    request: {"in":"body","name":"request","required":true,"ref":"SubmitProofRequest"},
                    jwt: {"in":"header","name":"authorization","required":true,"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new ProofController();

            const promise = controller.submitProof.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/producer/register',
            ...(fetchMiddlewares<Middleware>(ProducerController)),
            ...(fetchMiddlewares<Middleware>(ProducerController.prototype.register)),

            async function ProducerController_register(context: any, next: any) {
            const args = {
                    request: {"in":"body","name":"request","required":true,"ref":"RegisterProducerRequest"},
                    jwt: {"in":"header","name":"authorization","required":true,"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new ProducerController();

            const promise = controller.register.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.post('/producer/deregister',
            ...(fetchMiddlewares<Middleware>(ProducerController)),
            ...(fetchMiddlewares<Middleware>(ProducerController.prototype.deregister)),

            async function ProducerController_deregister(context: any, next: any) {
            const args = {
                    jwt: {"in":"header","name":"authorization","required":true,"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"undefined"}]},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new ProducerController();

            const promise = controller.deregister.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/book/:statementId',
            ...(fetchMiddlewares<Middleware>(BookController)),
            ...(fetchMiddlewares<Middleware>(BookController.prototype.statementBook)),

            async function BookController_statementBook(context: any, next: any) {
            const args = {
                    statementId: {"in":"path","name":"statementId","required":true,"dataType":"double"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new BookController();

            const promise = controller.statementBook.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        router.get('/book/assigned',
            ...(fetchMiddlewares<Middleware>(BookController)),
            ...(fetchMiddlewares<Middleware>(BookController.prototype.assigned)),

            async function BookController_assigned(context: any, next: any) {
            const args = {
                    jwt: {"in":"header","name":"authorization","required":true,"dataType":"string"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context, next);
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new BookController();

            const promise = controller.assigned.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function isController(object: any): object is Controller {
      return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function promiseHandler(controllerObj: any, promise: Promise<any>, context: any, successStatus: any, next?: () => Promise<any>) {
      return Promise.resolve(promise)
        .then((data: any) => {
            let statusCode = successStatus;
            let headers;

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus() || statusCode;
            }
            return returnHandler(context, next, statusCode, data, headers);
        })
        .catch((error: any) => {
            context.status = error.status || 500;
            context.throw(context.status, error.message, error);
        });
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(context: any, next?: () => any, statusCode?: number, data?: any, headers: any={}) {
        if (!context.headerSent && !context.response.__tsoaResponded) {
            if (data !== null && data !== undefined) {
                context.body = data;
                context.status = 200;
            } else {
                context.status = 204;
            }

            if (statusCode) {
                context.status = statusCode;
            }

            context.set(headers);
            context.response.__tsoaResponded = true;
            return next ? next() : context;
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, context: any, next: () => any): any[] {
        const errorFields: FieldErrors = {};
        const values = Object.keys(args).map(key => {
            const name = args[key].name;
            switch (args[key].in) {
            case 'request':
                return context.request;
            case 'query':
                return validationService.ValidateParam(args[key], context.request.query[name], name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'queries':
                return validationService.ValidateParam(args[key], context.request.query, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'path':
                return validationService.ValidateParam(args[key], context.params[name], name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'header':
                return validationService.ValidateParam(args[key], context.request.headers[name], name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'body':
                return validationService.ValidateParam(args[key], context.request.body, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'body-prop':
                return validationService.ValidateParam(args[key], context.request.body[name], name, errorFields, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'formData':
                if (args[key].dataType === 'file') {
                  return validationService.ValidateParam(args[key], context.request.file, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                  return validationService.ValidateParam(args[key], context.request.files, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                } else {
                  return validationService.ValidateParam(args[key], context.request.body[name], name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                }
            case 'res':
                return responder(context, next);
            }
        });
        if (Object.keys(errorFields).length > 0) {
            throw new ValidateError(errorFields, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(context: any, next: () => any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
           returnHandler(context, next, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
