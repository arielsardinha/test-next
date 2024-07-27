import { TodoRepository } from "@/_repository/todo_repository"
import { z, ZodSchema } from "zod"

export interface NewTodo extends Pick<TodoModel, 'title'> { }

export class TodoModel {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly dueDate: string,
        public readonly doneDate: string | null,
        public readonly status: string,
        public readonly createdAt: string,
        public readonly updatedAt: string,

    ) { }

    static get createSchema() {
        return z.object({
            title: z.string()
        }) satisfies ZodSchema<NewTodo>
    }

    static getInitialValue(): TodoModel {
        return new TodoModel(0, '', '', '', '', '', '')
    }

    static async getAll(repository: TodoRepository): Promise<TodosModel> {
        const todos = await repository.findAll();
        const todoMapper = todos.map(todo =>
            new TodoModel(
                todo.id,
                todo.title,
                todo.dueDate,
                todo.doneDate,
                todo.status,
                todo.createdAt,
                todo.updatedAt,
            )
        );
        return new TodosModel(todoMapper);
    }
}

export class TodosModel {
    constructor(public readonly todos: TodoModel[]) { }
}
