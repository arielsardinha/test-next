import { TodoRepository, TodoRepositoryImpl } from '@/_repository/todo_repository';
import { TodoModel } from '@/app/_model/todo_model';
import { Home } from '@/app/page';
import { render, act, screen, waitFor } from '@testing-library/react';
import { DataSource } from '@/datasource/treinaweb_datasource';

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
        await act(async () => {
            render(<Home initialTodo={TodoModel.getInitialValue()} repository={repository} />);
        });

        await waitFor(() => {
            expect(screen.getByText('Test Todo')).toBeInTheDocument();
            expect(screen.getByText('pending')).toBeInTheDocument();
        });

        // Verifica se o método getAll do mockDataSource foi chamado
        expect(mockDataSource.getAll).toHaveBeenCalled();
    });
});
