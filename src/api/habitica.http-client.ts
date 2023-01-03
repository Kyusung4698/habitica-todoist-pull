import type { RequestInit } from 'node-fetch';
import fetch from 'node-fetch';
import { createLogger } from '../common';
import type { Habitica } from './habitica.schema';

const CLIENT_ID = '9c52d6e9-ac02-42ca-8896-4323d17cb2f6-HabiticaTodoistPull';

export class HabiticaHttpClient {
    private readonly logger = createLogger('habitica');

    constructor(
        private readonly userId: string,
        private readonly apiKey: string
    ) { }

    public async getUserTasks(
        type: Habitica.Tasks.Types
    ): Promise<Habitica.Tasks.Task[] | undefined | null> {
        try {
            const response = await fetch(
                this.buildUrl(`/tasks/user?type=${encodeURIComponent(type)}`),
                this.createConfig()
            )
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const body = await response.json() as Habitica.Response<Habitica.Tasks.Task[]>;
            return body.success ? body.data : null;
        } catch (error) {
            this.logger.warn('Unable to fetch user task.', error);
            return null;
        }
    }

    public async createUserTask(
        request: Habitica.Tasks.CreateRequest
    ): Promise<boolean> {
        try {
            const response = await fetch(
                this.buildUrl('/tasks/user'),
                this.createConfig({
                    method: 'POST',
                    body: JSON.stringify(request),
                    headers: {
                        'content-type': 'application/json'
                    }
                })
            );
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const body = await response.json() as Habitica.Tasks.CreateResponse;
            return body.success;
        } catch (error) {
            this.logger.warn('Unable to create user task.', error);
            return false;
        }
    }

    public async updateTask(
        taskId: Habitica.Tasks.Id,
        request: Habitica.Tasks.UpdateRequest
    ): Promise<boolean> {
        try {
            const response = await fetch(
                this.buildUrl(`/tasks/${taskId}`),
                this.createConfig({
                    method: 'PUT',
                    body: JSON.stringify(request),
                    headers: {
                        'content-type': 'application/json'
                    }
                })
            );
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return true;
        } catch (error) {
            this.logger.warn('Unable to update task.', error);
            return false;
        }
    }

    public async removeTask(
        taskId: Habitica.Tasks.Id
    ): Promise<boolean> {
        try {
            const response = await fetch(
                this.buildUrl(`/tasks/${taskId}`),
                this.createConfig({ method: 'DELETE' })
            );
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return true;
        } catch (error) {
            this.logger.warn('Unable to remove task.', error);
            return false;
        }
    }

    public async scoreTask(
        taskId: Habitica.Tasks.Id,
        direction: Habitica.Tasks.Direction
    ): Promise<boolean> {
        try {
            const response = await fetch(
                this.buildUrl(`/tasks/${taskId}/score/${direction}`),
                this.createConfig({ method: 'POST' })
            );
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return true;
        } catch (error) {
            this.logger.warn('Unable to score task.', error);
            return false;
        }
    }

    private buildUrl(
        path: string
    ): string {
        return `https://habitica.com/api/v3${path}`
    }

    private createConfig(
        init?: RequestInit
    ): RequestInit {
        return {
            ...init,
            headers: {
                ...(init?.headers || {}),
                'x-api-user': this.userId,
                'x-api-key': this.apiKey,
                'x-client': CLIENT_ID
            }
        }
    }
}