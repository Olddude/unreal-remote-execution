import { createServer } from 'node:http';

import { createServerConfiguration } from './src/config';
import {
    createServerApplication,
    createServerContext,
    createServerListenCallback,
} from './src/app';

/**
 * Application entrypoint
 */
function main() {
    const config = createServerConfiguration();
    const context = createServerContext(config);
    const app = createServerApplication(config, context);
    const server = createServer(app);
    const serverListenCallback = createServerListenCallback(config, context);
    server.listen(config.port, serverListenCallback);
}

main();
