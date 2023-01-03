export namespace Habitica {
    export namespace Tasks {
        export type Id = string;

        export type Direction = 'up' | 'down';

        export enum Priority {
            Trivial = 0.1,
            Easy = 1,
            Medium = 1.5,
            Hard = 2,
        }

        export type Type = 'habit' | 'daily' | 'todo' | 'reward';
        export type Types = 'habits' | 'dailys' | 'todos' | 'rewards';

        export interface Task {
            alias: string;
            type: Type;
            text: string;
            notes: string;
            completed: boolean;
            date?: Date;
            priority?: Priority;
        }

        // https://habitica.com/apidoc/#api-Task-CreateUserTasks
        export interface CreateRequest {
            alias?: string;
            type: Type;
            text: string;
            notes?: string;
            date?: Date;
            priority?: Priority;
        }

        export type CreateResponse = Response<{
            _id: Id;
        }>

        export type UpdateRequest = Partial<CreateRequest>;
    }

    export interface Response<TData> {
        success: boolean;
        data?: TData;
    }
}