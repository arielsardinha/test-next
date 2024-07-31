"use client"
import { useTodoController, UseTodoControllerParamns } from "@/app/_controller/todo_controller";
import { TodoModel } from "@/app/_model/todo_model";
import { TodoRepositoryImpl } from "@/_repository/todo_repository";
import * as dataSource from "@/datasource/treinaweb_datasource";
import Style from "./home.module.css"

interface HomeProps extends UseTodoControllerParamns { }
export function Home(props: HomeProps) {
  const { handleSubmit, submit, register, todos, isPending, checkTodo } = useTodoController(props);
  return (
    <main className={Style.Container}>
      <form className={Style.Form} onSubmit={handleSubmit(submit)}>
        <input {...register('title')} />
        <input type="submit" value={"Salvar"} disabled={isPending} />
        {isPending && "salvando..."}
      </form>

      <div className={Style.ContentTodos}>
        {todos.map((todo) => (
          <div key={todo.id} className={Style.TodoItem}>
            <div>
              <p>{todo.title}:</p>
              <p>{todo.status}</p>
            </div>
            {!todo.isDone && <input type="button" value="concluir tarefa" onClick={() => checkTodo(todo)} />}

          </div>
        ))}
      </div>
    </main>
  );
}

export default function Page() {
  return <Home
    initialTodo={TodoModel.getInitialValue()}
    repository={new TodoRepositoryImpl(dataSource)}
  />
}