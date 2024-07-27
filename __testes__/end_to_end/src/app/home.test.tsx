import { TodoRepository, TodoRepositoryImpl } from '@/_repository/todo_repository';
import { TodoModel, TodosModel } from '@/app/_model/todo_model';
import { Home } from '@/app/page';
import { render, act, screen, waitFor } from '@testing-library/react';

jest.mock('axios');

describe("Deve testar o controller", () => {
    let repository: TodoRepository;

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
        ]);
    });

    test('Deve buscar a lista de todo com sucesso', async () => {
        await act(async () => {
            render(<Home initialTodo={TodoModel.getInitialValue()} initialTodos={new TodosModel([])} repository={repository} />);
        });

        await waitFor(() => {
            expect(screen.getByText('Test Todo')).toBeInTheDocument();
            expect(screen.getByText('pending')).toBeInTheDocument();
        });
    });
});
