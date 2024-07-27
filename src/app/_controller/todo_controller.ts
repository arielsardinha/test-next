import { useForm } from "react-hook-form";
import { NewTodo, TodoModel, TodosModel } from "@/app/_model/todo_model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { TodoRepository } from "@/_repository/todo_repository";
export interface UseTodoControllerParamns {
    initialTodo: TodoModel,
    initialTodos: TodosModel,
    repository: TodoRepository
}
export function useTodoController({
    initialTodo,
    repository,
    initialTodos,
}: UseTodoControllerParamns) {
    const [todos, setTodos] = useState<TodosModel>(initialTodos);
    const { register, handleSubmit } = useForm<NewTodo>({
        defaultValues: initialTodo,
        resolver: zodResolver(TodoModel.createSchema),
    });

    useEffect(() => {
        TodoModel.getAll(repository).then(setTodos);
    }, [])


    function submit(newTodo: NewTodo) { }

    return {
        register,
        todos,
        submit,
        handleSubmit
    }
}