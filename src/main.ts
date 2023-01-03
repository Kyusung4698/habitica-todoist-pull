import { Habitica, HabiticaHttpClient, Todoist, TodoistHttpClient } from './api';
import { createLogger, createUniqueSet } from './common';

const ACTIONS_PER_EXECUTION = 5;

const logger = createLogger('main');

const main = async () => {
    (await import('dotenv')).config();

    const todoist = new TodoistHttpClient(
        process.env.TODOIST_API_TOKEN
    );

    const [
        projects,
        tasks
    ] = await Promise.all([
        todoist.getProjects(),
        todoist.getTasks()
    ]);

    if (!projects || !tasks) {
        return false;
    }

    const habitica = new HabiticaHttpClient(
        process.env.HABITICA_USER_ID,
        process.env.HABITICA_API_KEY
    );

    const todos = await habitica.getUserTasks('todos');
    if (!todos) {
        return false;
    }

    const todoSet = createUniqueSet(todos, x => x.alias);

    const createdTodos: Habitica.Tasks.Task[] = [];
    const updatedTodos: Habitica.Tasks.Task[] = [];
    const completedTodos: Habitica.Tasks.Task[] = [];
    const removedTodos: Habitica.Tasks.Task[] = [];

    const createAlias = (id: string) => `htp-${id}`;
    const mapTask = (
        task: Todoist.Task
    ): Habitica.Tasks.Task => {
        return {
            type: 'todo',
            alias: createAlias(task.id),
            text: task.content,
            notes: task.description,
            completed: task.is_completed
        };
    }

    for (const task of tasks) {
        const todo = todoSet[createAlias(task.id)];
        if (!todo) {
            // only create none completed tasks with set due date
            if (!task.is_completed && task.due?.date) {
                createdTodos.push({
                    ...mapTask(task),
                    date: new Date(task.due.date)
                });
            }
            continue;
        }

        if (task.due?.date) {
            const date = new Date(task.due.date);
            if (todo.text !== task.content ||
                todo.notes !== task.description ||
                new Date(todo.date as unknown as string).toDateString() !== date.toDateString()
            ) {
                updatedTodos.push({ ...mapTask(task), date });
            }
        }
    }

    const taskSet = createUniqueSet(tasks, x => createAlias(x.id));
    for (const todo of todos) {
        const task = taskSet[todo.alias];
        if (!task) {
            if (!todo.completed) {
                completedTodos.push(todo);
            } else {
                removedTodos.push(todo);
            }
            continue;
        }

        // remove tasks without date
        if (!task.due?.date) {
            removedTodos.push(todo);
            continue;
        }
    }

    logger.debug(`Outstanding creation actions: ${createdTodos.length}`);
    try {
        const createTasks$ = createdTodos
            .slice(0, ACTIONS_PER_EXECUTION)
            .map(todo => habitica.createUserTask(todo));
        await Promise.all(createTasks$);
        logger.info(`Created ${createTasks$.length} tasks.`);
    } catch (error) {
        logger.warn('Unable to execute creation actions.', error);
    }

    logger.debug(`Outstanding update actions: ${updatedTodos.length}`);
    try {
        const updateTasks$ = updatedTodos
            .slice(0, ACTIONS_PER_EXECUTION)
            .map(todo => habitica.updateTask(todo.alias, todo.date
                ? {
                    text: todo.text,
                    notes: todo.notes,
                    date: todo.date
                }
                : {}
            ));
        await Promise.all(updateTasks$);
        logger.info(`Updated ${updateTasks$.length} tasks.`);
    } catch (error) {
        logger.warn('Unable to execute update actions.', error);
    }

    logger.debug(`Outstanding completion actions: ${completedTodos.length}`);
    try {
        const scoreTasks$ = completedTodos
            .slice(0, ACTIONS_PER_EXECUTION)
            .map(todo => habitica.scoreTask(todo.alias, 'up'));
        await Promise.all(scoreTasks$);
        logger.info(`Scored ${scoreTasks$.length} tasks.`);
    } catch (error) {
        logger.warn('Unable to execute completion actions.', error);
    }

    logger.debug(`Outstanding remove actions: ${removedTodos.length}`);
    try {
        const removeTasks$ = removedTodos
            .slice(0, ACTIONS_PER_EXECUTION)
            .map(todo => habitica.removeTask(todo.alias));
        await Promise.all(removeTasks$);
        logger.info(`Removed ${removeTasks$.length} tasks.`);
    } catch (error) {
        logger.warn('Unable to execute remove actions.', error);
    }

    return true;
};

main()
    .then(success => success
        ? logger.info('Finished.')
        : logger.warn('Failed.')
    )
    .catch(logger.error);
