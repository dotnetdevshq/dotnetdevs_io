import { spawn } from 'node:child_process';
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '-p', '3001', '--hostname', '127.0.0.1'], { stdio: 'inherit', env: { ...process.env, SOCIAL_PREVIEW: '1', NEXT_TELEMETRY_DISABLED: '1' } });
child.on('exit', code => process.exit(code ?? 1));
