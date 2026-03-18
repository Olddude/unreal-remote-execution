import { ServerConfiguration } from '@unv/unreal-remote-execution';

export function createServerConfiguration(): ServerConfiguration {
    return {
        port: Number.parseInt(process.env.PORT || '8080', 10),
        host: process.env.HOST || '0.0.0.0',
    };
}
