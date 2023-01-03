#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

yargs(hideBin(process.argv))
    .command(
        '$0 <todoist_api_token> <habitica_user_id> <habitica_api_key>',
        'pulls todoist tasks and pushes habitica todos (one-way)',
        () => { },
        argv => spawn('npm', ['run', 'execute'], {
            cwd: __dirname,
            shell: true,
            stdio: 'inherit',
            env: {
                ...process.env,
                TODOIST_API_TOKEN: argv.todoist_api_token,
                HABITICA_USER_ID: argv.habitica_user_id,
                HABITICA_API_KEY: argv.habitica_api_key,
            }
        })
    )
    .help()
    .parse();