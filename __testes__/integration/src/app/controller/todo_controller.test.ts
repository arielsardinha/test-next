import { TodoRepository, TodoRepositoryImpl } from '@/_repository/todo_repository';
import { useTodoController } from '@/app/_controller/todo_controller';
import { TodoModel } from '@/app/_model/todo_model';
import { DataSource } from '@/datasource/treinaweb_datasource';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('axios');

describe("Deve testar o controller", () => {
    let mockDataSource: jest.Mocked<DataSource>;
    let repository: TodoRepository;

    beforeEach(() => {
        mockDataSource = {
            getAll: jest.fn().mockResolvedValue({
                body: [
                    {
                        id: 1,
                        title: 'Test Todo',
                        dueDate: '2024-07-27T00:00:00.000Z',
                        doneDate: null,
                        status: 'pending',
                        createdAt: '2024-07-26T00:00:00.000Z',
                        updatedAt: '2024-07-26T00:00:00.000Z',
                    },
                ],
                status: 200,
            }),
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete_: jest.fn(),
        };

        repository = new TodoRepositoryImpl(mockDataSource);
    });

    test('Deve buscar a lista de todo com sucesso', async () => {
        const { result } = renderHook(() => useTodoController(
            {
                initialTodo: TodoModel.getInitialValue(),

                repository: repository,
            }
        ));

        await waitFor(() => {
            expect(result.current.todos.length).toBe(1);
        });

        // Verifica se o método getAll do mockDataSource foi chamado
        expect(mockDataSource.getAll).toHaveBeenCalled();
    });
});
