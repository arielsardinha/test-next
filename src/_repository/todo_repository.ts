import axios, { AxiosInstance } from 'axios';
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
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'https://alunos.treinaweb.com.br/tw-todos/api/v1',
        });
    }

    async findAll(): Promise<Todo[]> {
        const response = await this.axiosInstance.get<Todo[]>('/todos');
        return response.data;
    }

    async find(todoId: number): Promise<Todo> {
        const response = await this.axiosInstance.get<Todo>(`/todos/${todoId}`);
        return response.data;
    }

    async create(createTodoData: CreateTodoData): Promise<Todo> {
        const response = await this.axiosInstance.post<Todo>('/todos', createTodoData);
        return response.data;
    }

    async update(todo: UpdateTodoData): Promise<Todo> {
        const response = await this.axiosInstance.put<Todo>(`/todos/${todo.id}`, todo);
        return response.data;
    }

    async delete(todo: Todo): Promise<void> {
        await this.axiosInstance.delete(`/todos/${todo.id}`);
    }

    async finish(todo: Todo): Promise<void> {
        await this.axiosInstance.post<Todo>(`/todos/${todo.id}/finish`);
    }
}