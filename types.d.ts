declare module '@unv/unreal-remote-execution' {
    import type { Express } from 'express';

    type ServerApplication = Express;

    type ServerConfiguration = {
        port: number;
        host: string;
    };

    type ServerContext = {
        chunks: Buffer[];
    };
};
