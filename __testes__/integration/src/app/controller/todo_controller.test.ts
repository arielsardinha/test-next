import { TodoRepository, TodoRepositoryImpl } from '@/_repository/todo_repository';
import { useTodoController } from '@/app/_controller/todo_controller';
import { TodoModel, TodosModel } from '@/app/_model/todo_model';
import { renderHook, waitFor } from '@testing-library/react'

jest.mock('axios')
describe("Deve testar o controller", () => {
    let repository: TodoRepository

    beforeEach(() => {
        repository = new TodoRepositoryImpl();
        repository.findAll = jest.fn().mockResolvedValue([
            {
                id: 1,
                title: 'Test Todo',
                dueDate: '2024-07-27T00:00:00.000Z',
                doneDate: null,
                status: 'pending',
                createdAt: '2024-07-26T00:00:00.000Z',
                updatedAt: '2024-07-26T00:00:00.000Z',
            },
        ])
    })

    test('Deve buscar a lista de todo com sucesso', async () => {
        const { result } = renderHook(() => useTodoController(
            {
                initialTodo: TodoModel.getInitialValue(),
                initialTodos: new TodosModel([]),
                repository: repository,
            }
        ))

        await waitFor(() => {
            expect(result.current.todos.todos.length).toBe(1);
        });
    })
});
