import fetch, { RequestInit } from 'node-fetch';
import { createLogger } from '../common';
import type { Todoist } from './todoist.schema';

export class TodoistHttpClient {
    private readonly logger = createLogger('todoist');

    constructor(
        private readonly token: string
    ) { }

    public async getTasks(): Promise<Todoist.Task[] | null> {
        try {
            const response = await fetch(
                this.buildUrl(`/tasks`),
                this.createConfig()
            );
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const body = await response.json() as Todoist.Task[];
            return body;
        } catch (error) {
            this.logger.warn('Unable to fetch tasks.', error);
            return null;
        }
    }

    private buildUrl(
        path: string
    ): string {
        return `https://api.todoist.com/rest/v2${path}`
    }

    private createConfig(
        init?: RequestInit
    ): RequestInit {
        return {
            ...init,
            headers: {
                ...(init?.headers || {}),
                'Authorization': `Bearer ${this.token}`
            }
        }
    }
}
