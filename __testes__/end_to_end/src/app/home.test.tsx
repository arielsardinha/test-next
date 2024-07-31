import { TodoRepository, TodoRepositoryImpl } from '@/_repository/todo_repository';
import { TodoModel } from '@/app/_model/todo_model';
import { Home } from '@/app/page';
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react';
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
                        status: 'PENDING',
                        createdAt: '2024-07-26T00:00:00.000Z',
                        updatedAt: '2024-07-26T00:00:00.000Z',
                    },
                ],
                status: 200,
            }),
            get: jest.fn(),
            post: jest.fn().mockResolvedValue({
                body: {
                    id: 2,
                    title: 'Novo Todo',
                    dueDate: '2024-07-27T00:00:00.000Z',
                    doneDate: null,
                    status: 'PENDING',
                    createdAt: '2024-07-26T00:00:00.000Z',
                    updatedAt: '2024-07-26T00:00:00.000Z',
                },
                status: 200,
            }),
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
            expect(screen.getByText('Test Todo:')).toBeInTheDocument();
            expect(screen.getByText('PENDING')).toBeInTheDocument();
        });

        expect(mockDataSource.getAll).toHaveBeenCalled();
    });

    test("Deve apresentar a mensagem de erro quando o formulário estiver inválido", async () => {
        await act(async () => {
            render(<Home initialTodo={TodoModel.getInitialValue()} repository={repository} />);
        });

        await act(async () => {
            fireEvent.click(screen.getByText("Salvar"))
        })

        await waitFor(() => {
            expect(screen.getByText('titulo é obrigatório'))
        })
    })

    test("Deve criar uma nova tarefa", async () => {
        await act(async () => {
            render(<Home initialTodo={TodoModel.getInitialValue()} repository={repository} />);
        });

        await act(async () => {
            fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Novo Todo' } });
            fireEvent.click(screen.getByText('Salvar'));
        });

        await waitFor(() => {
            expect(screen.getByText('Novo Todo:')).toBeInTheDocument();
            const pendingTexts = screen.queryAllByText("PENDING")
            expect(pendingTexts).toHaveLength(2)
            const novoTodoElement = screen.getByText('Novo Todo:').parentElement;
            expect(novoTodoElement).toHaveTextContent('PENDING');
        });
    })
});
