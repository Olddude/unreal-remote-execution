import type { ServerApplication, ServerConfiguration, ServerContext } from '@unv/unreal-remote-execution';
import { RemoteExecution } from './remote';
import express from 'express';

/**
 * Creates an express js server application
 * @param config - server application config
 * @param context - server application context
 * @returns server application
 */
export function createServerApplication(
    config: ServerConfiguration,
    context: ServerContext,
): ServerApplication {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    return app;
}

/**
 * Creates a server listen callback
 * @param config - server application config
 * @param context - server application context
 * @returns server listen callback
 */
export function createServerListenCallback(
    config: ServerConfiguration,
    context: ServerContext,
) {
    return () => {
        console.log(config);
        console.log(context);
    };
}

export function createServerListenerCallback() {
    return async () => {
        let codeToExecute: string;

        if (process.argv.length > 2) {
            codeToExecute = process.argv.slice(2).join(" ");
        } else {
            codeToExecute = "print('Hello from Unreal Remote Execution!')";
        }

        // Add debug listener
        process.on('uncaughtException', (err) => {
            console.error('Uncaught exception:', err);
        });

        // Try with direct IP address of the target machine
        const targetIP = "192.168.178.121";
        console.log(`Configuring for target Unreal Engine at ${targetIP}`);
        
        const remoteExecution = new RemoteExecution({
            // Using the remote Unreal Engine on the network
            commandEndpoint: [targetIP, 6776],  // Target machine's IP and port for commands
            multicastTTL: 1,                    // TTL of 1 allows packets to reach the local subnet
            multicastBindAddress: "0.0.0.0",    // Bind to all network interfaces
            multicastGroupEndpoint: ["239.0.0.1", 6767], // Standard multicast group
        });

        // Add a debug listener for found nodes
        remoteExecution.events.addEventListener('nodeFound', (node) => {
            console.log('Node found:', {
            nodeId: node.nodeId,
            machine: node.data.machine,
            project: node.data.project_name,
            engine: node.data.engine_version
            });
        });

        console.log("Starting remote execution service...");
        await remoteExecution.start();
        
        console.log("Looking for Unreal Engine nodes...");
        try {
            const node = await remoteExecution.getFirstRemoteNode(1000, 30000); // Increase timeout to 30 seconds
            console.log("Node found! Opening command connection...");
            await remoteExecution.openCommandConnection(node);
            console.log("Connected! Running command:", codeToExecute);
            const result = await remoteExecution.runCommand(codeToExecute);
            console.log("Command result:", result);
        } catch (error: any) {
            console.error("Error:", error.message);
        } finally {
            console.log("Stopping remote execution...");
            remoteExecution.stop();
        }
    };
}

/**
 * Creates server application context
 * @param config - server configuration
 * @returns server application context
 */
export function createServerContext(
    config: ServerConfiguration,
): ServerContext {
    return {
        chunks: [],
    }
}