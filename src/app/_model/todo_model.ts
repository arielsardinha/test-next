import { Todo, TodoRepository } from "@/_repository/todo_repository"
import { z, ZodSchema } from "zod"

enum TodoStatusEnum {
    DONE = "DONE",
    EXPIRED = "EXPIRED",
    PENDING = "PENDING",
}

export interface NewTodo extends Pick<TodoModel, 'title'> { }

export class TodoModel {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly dueDate: string,
        public readonly doneDate: string | null,
        public readonly status: TodoStatusEnum,
        public readonly createdAt: string,
        public readonly updatedAt: string,

    ) { }

    get isDone() {
        return this.status === TodoStatusEnum.DONE
    }

    static get createSchema() {
        return z.object({
            title: z.string().min(1, { message: 'titulo é obrigatório' })
        }) satisfies ZodSchema<NewTodo>
    }

    private static handleStatus(status: string): TodoStatusEnum {
        switch (status) {
            case "DONE":
                return TodoStatusEnum.DONE
            case "PENDING":
                return TodoStatusEnum.PENDING
            default:
                return TodoStatusEnum.EXPIRED
        }
    }

    static getInitialValue(): TodoModel {
        return new TodoModel(0, '', '', '', TodoStatusEnum.EXPIRED, '', '')
    }

    static async getAll(repository: TodoRepository): Promise<TodoModel[]> {
        const todos = await repository.findAll();
        return todos.map(todo =>
            TodoModel.fromJson(todo)
        );

    }

    static async checkDoneTodo(repository: TodoRepository, todo: TodoModel): Promise<TodoModel> {
        await repository.finish(TodoModel.toJson(todo))
        return new TodoModel(
            todo.id,
            todo.title,
            todo.dueDate,
            todo.doneDate,
            TodoStatusEnum.DONE,
            todo.createdAt,
            todo.updatedAt,
        )
    }

    static async save(repository: TodoRepository, newTodo: NewTodo): Promise<TodoModel> {
        const newTodoResponse = await repository.create({ title: newTodo.title, dueDate: new Date().toISOString() })

        return TodoModel.fromJson(newTodoResponse)
    }

    static fromJson(todoJson: Todo): TodoModel {
        return new TodoModel(
            todoJson.id,
            todoJson.title,
            todoJson.dueDate,
            todoJson.doneDate,
            TodoModel.handleStatus(todoJson.status),
            todoJson.createdAt,
            todoJson.updatedAt,
        )
    }

    static toJson(todoJson: TodoModel): Todo {
        return {
            title: todoJson.title,
            id: todoJson.id,
            status: todoJson.status,
            updatedAt: todoJson.updatedAt,
            createdAt: todoJson.createdAt,
            doneDate: todoJson.doneDate,
            dueDate: todoJson.dueDate,
        }
    }

    static fromModel(todoModel: TodoModel): TodoModel {
        return new TodoModel(
            todoModel.id,
            todoModel.title,
            todoModel.dueDate,
            todoModel.doneDate,
            todoModel.status,
            todoModel.createdAt,
            todoModel.updatedAt,
        )
    }
}

