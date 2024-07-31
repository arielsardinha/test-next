import { useForm } from "react-hook-form";
import { NewTodo, TodoModel } from "@/app/_model/todo_model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { TodoRepository } from "@/_repository/todo_repository";
export interface UseTodoControllerParamns {
    initialTodo: TodoModel,
    repository: TodoRepository
}
export function useTodoController({
    initialTodo,
    repository,
}: UseTodoControllerParamns) {
    const [todos, setTodos] = useState<TodoModel[]>([]);
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit } = useForm<NewTodo>({
        defaultValues: initialTodo,
        resolver: zodResolver(TodoModel.createSchema),
    });

    useEffect(() => {
        TodoModel.getAll(repository).then(setTodos);
    }, [repository])


    function submit(newTodo: NewTodo) {
        startTransition(async () => {
            const todo = await TodoModel.save(repository, newTodo)
            setTodos((prev) => [...prev.map(TodoModel.fromModel), todo])
        });
    }


    async function checkTodo(todoModel: TodoModel) {
        startTransition(async () => {
            const newtodo = await TodoModel.checkDoneTodo(repository, todoModel)
            setTodos(todos.map((todo) => {
                if (newtodo.id === todo.id) {
                    return newtodo;
                }
                return todo
            }))
        });
    }

    return {
        register,
        todos,
        submit,
        handleSubmit,
        isPending,
        checkTodo
    }
}