"use client"
import { useTodoController, UseTodoControllerParamns } from "@/app/_controller/todo_controller";
import { TodoModel, TodosModel } from "@/app/_model/todo_model";
import { TodoRepositoryImpl } from "@/_repository/todo_repository";

interface HomeProps extends UseTodoControllerParamns { }
export function Home(props: HomeProps) {
  const { handleSubmit, submit, register, todos: { todos } } = useTodoController(props);
  return (
    <main >
      <form onSubmit={handleSubmit(submit)}>
        <input {...register('title')} />
      </form>

      <div className="todos">
        {todos.map(({ title, id, status }) => (
          <div key={id}>
            <p>{title}</p>
            <p>{status}</p>
          </div>
        ))}
      </div>
    </main>
  );
}



export default function Page() {
  return <Home
    initialTodo={TodoModel.getInitialValue()}
    initialTodos={new TodosModel([])}
    repository={new TodoRepositoryImpl()}
  />
}