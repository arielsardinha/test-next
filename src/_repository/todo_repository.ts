import { DataSource } from '@/datasource/treinaweb_datasource';
import * as repositoryServerActions from '@/_repository/actions';
export interface Todo {
    readonly id: number;
    readonly title: string;
    readonly dueDate: string;
    readonly doneDate: string | null;
    readonly status: string;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface CreateTodoData extends Pick<Todo, 'title' | 'dueDate'> { }

export interface UpdateTodoData extends Pick<Todo, 'title' | 'dueDate' | 'id'> { }

export interface TodoRepository {
    findAll: () => Promise<Todo[]>
    find: (todoId: number) => Promise<Todo>
    create: (createTodoData: CreateTodoData) => Promise<Todo>
    update: (todo: UpdateTodoData) => Promise<Todo>
    delete: (todo: Todo) => Promise<void>
    finish: (todo: Todo) => Promise<void>
}


export class TodoRepositoryImpl implements TodoRepository {
    constructor(readonly dataSource: DataSource) { }

    async findAll(): Promise<Todo[]> {
        return repositoryServerActions.findAll({ getAll: this.dataSource.getAll });
    }

    async find(todoId: number): Promise<Todo> {
        return repositoryServerActions.find(todoId, { get: this.dataSource.get })
    }

    async create(createTodoData: CreateTodoData): Promise<Todo> {
        return repositoryServerActions.create(createTodoData, { post: this.dataSource.post });
    }

    async update(todo: UpdateTodoData): Promise<Todo> {
        return repositoryServerActions.update(todo, { put: this.dataSource.put });
    }

    async delete(todo: Todo): Promise<void> {
        repositoryServerActions.deleteTodo(todo, { delete_: this.dataSource.delete_ });
    }

    async finish(todo: Todo): Promise<void> {
        repositoryServerActions.finish(todo, { post: this.dataSource.post });
    }
}