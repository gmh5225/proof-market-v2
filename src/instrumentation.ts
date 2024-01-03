import {NodeTracerProvider} from '@opentelemetry/sdk-trace-node';
import {registerInstrumentations} from "@opentelemetry/instrumentation";
import {KoaInstrumentation} from "@opentelemetry/instrumentation-koa";
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import * as api from '@opentelemetry/api';
import {diag, DiagConsoleLogger, DiagLogLevel} from "@opentelemetry/api";
import {jaegerHost} from "./config/props";
import {JaegerExporter} from "@opentelemetry/exporter-jaeger";

export const setupTracing = (serviceName: string) => {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName
        })
    });
    const exporter = new JaegerExporter({
        endpoint: jaegerHost,
    });
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    registerInstrumentations({
        instrumentations: [
            new KoaInstrumentation(),
            new HttpInstrumentation(),
        ],
        tracerProvider: provider,
    });
    provider.register();
    return api.trace.getTracer(serviceName);
}
