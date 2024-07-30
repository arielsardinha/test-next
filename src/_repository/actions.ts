"use server"
import { DeleteDataSource, GetAllDataSource, GetDataSource, PostDataSource, PutDataSource } from "@/datasource/treinaweb_datasource";
import { Todo, CreateTodoData, UpdateTodoData } from "./todo_repository";

export async function findAll({ getAll }: GetAllDataSource): Promise<Todo[]> {
    const response = await getAll<Todo>({
        url: '/todos'
    });
    return response.body;
}

export async function find(todoId: number, { get }: GetDataSource): Promise<Todo> {
    const response = await get<Todo>({
        url: `/todos/${todoId}`
    });
    return response.body;
}

export async function create(createTodoData: CreateTodoData, { post }: PostDataSource): Promise<Todo> {
    const response = await post<Todo, CreateTodoData>({
        url: '/todos',
        data: createTodoData
    });
    return response.body;
}

export async function update(todo: UpdateTodoData, { put }: PutDataSource): Promise<Todo> {
    const response = await put<Todo, UpdateTodoData>({
        url: `/todos/${todo.id}`,
        data: todo
    });
    return response.body;
}

export async function deleteTodo(todo: Todo, { delete_ }: DeleteDataSource): Promise<void> {
    await delete_<Todo>({
        url: `/todos/${todo.id}`
    });

}

export async function finish(todo: Todo, { post }: PostDataSource): Promise<void> {
    await post({
        url: `/todos/${todo.id}/finish`,
        data: null
    });

}
