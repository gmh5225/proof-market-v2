import {NodeTracerProvider} from '@opentelemetry/sdk-trace-node'
import {registerInstrumentations} from '@opentelemetry/instrumentation'
import {KoaInstrumentation} from '@opentelemetry/instrumentation-koa'
import {Resource} from '@opentelemetry/resources'
import {SemanticResourceAttributes} from '@opentelemetry/semantic-conventions'
import {HttpInstrumentation} from '@opentelemetry/instrumentation-http'
import * as api from '@opentelemetry/api'
import {diag, DiagConsoleLogger, DiagLogLevel} from '@opentelemetry/api'
import {jaegerHost} from './config/props'
import {JaegerExporter} from '@opentelemetry/exporter-jaeger'
import {tracer} from 'dd-trace'
import {useDatadog, useOpenTelemetry} from './config/props'
import logger from './logger'

/**
 * Initializes application tracing
 * Supported tracing options:
 * 1. DataDog (default) - Set `useDatadog` to 'true' to enable
 * 2. OpenTelemetry - Set `useOpenTelemetry` to 'true' to enable
 * If neither is set, no tracing will be started
 *
 * @param serviceName The name of the service for which tracing is being set up
 */
export const setupTracing = (serviceName: string) => {
	if (useDatadog === 'true') {
		// TODO: For deployment, consider adding env variables for `url`, or `hostname` and `port`
		tracer.init({
			logInjection: true,
			service: serviceName,
			startupLogs: true,
			runtimeMetrics: true,
		})
		logger.info('Use datadog tracer')
	}

	if (useOpenTelemetry === 'true') {
		// TODO: The JaegerAgent is being deprecated (see: https://github.com/jaegertracing/jaeger/issues/4739).
		// Refer to the Jaeger documentation on architecture (https://www.jaegertracing.io/docs/1.55/architecture/#agent)
		// to understand the necessary adjustments for this deprecation.
		diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO)
		const provider = new NodeTracerProvider({
			resource: new Resource({
				[SemanticResourceAttributes.SERVICE_NAME]: serviceName,
			}),
		})
		new JaegerExporter({
			endpoint: jaegerHost,
		})
		registerInstrumentations({
			instrumentations: [
				new KoaInstrumentation(),
				new HttpInstrumentation(),
			],
			tracerProvider: provider,
		})
		provider.register()
		api.trace.getTracer(serviceName)
		logger.info('Use opentelemetry tracer')
	}

	if (useDatadog !== 'true' && useOpenTelemetry !== 'true') {
		logger.info('No tracer is used.')
	}
}
