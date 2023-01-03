export namespace Todoist {
    export interface Project {
        id: string;
        parent_id?: string;
        name: string;
    }

    export interface Task {
        id: string;
        project_id: string;
        content: string;
        description: string;
        /**
        * @deprecated This will always be false. REST API does not return completed tasks.
        */
        is_completed: boolean;
        due?: TaskDue;
        url: string;
    }

    export interface TaskDue {
        date: string;
        string: string;
        lang: string;
    }
}