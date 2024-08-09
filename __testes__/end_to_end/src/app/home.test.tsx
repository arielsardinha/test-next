import { Todo, TodoRepository, TodoRepositoryImpl } from '@/_repository/todo_repository';
import { TodoModel } from '@/app/_model/todo_model';
import { Home } from '@/app/page';
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react';
import * as dataSource from '@/datasource/treinaweb_datasource';
import MockAdapter from 'axios-mock-adapter'


describe("Deve testar o controller", () => {

    let mockAdapter: MockAdapter;
    let todoRepository: TodoRepositoryImpl;

    beforeAll(() => {
        mockAdapter = new MockAdapter(dataSource.axiosInstance);
        todoRepository = new TodoRepositoryImpl(dataSource);
    });

    afterEach(() => {
        mockAdapter.reset();
    });

    afterAll(() => {
        mockAdapter.restore();
    });

    test('Deve buscar a lista de todo com sucesso', async () => {
        const todosMock: Todo[] = [
            { id: 1, title: 'Todo 1', dueDate: '2024-08-01', doneDate: null, status: 'PENDING', createdAt: '2024-08-01', updatedAt: '2024-08-01' }
        ];

        const getAllSpy = jest.spyOn(dataSource.axiosInstance, 'get');
        mockAdapter.onGet('/todos').reply(200, todosMock);
        await act(async () => {
            render(<Home initialTodo={TodoModel.getInitialValue()} repository={todoRepository} />);
        });
        await waitFor(() => {
            expect(screen.getByText('Todo 1:')).toBeInTheDocument();
            expect(screen.getByText('PENDING')).toBeInTheDocument();
        });

        expect(getAllSpy.mock.calls.length).toEqual(1);
    });

    test("Deve apresentar a mensagem de erro quando o formulário estiver inválido", async () => {
        const getAllSpy = jest.spyOn(dataSource.axiosInstance, 'get');
        await act(async () => {
            render(<Home initialTodo={TodoModel.getInitialValue()} repository={todoRepository} />);
        });
        expect(getAllSpy.mock.calls.length).toEqual(0);
        await act(async () => {
            fireEvent.click(screen.getByText("Salvar"))
        })

        await waitFor(() => {
            expect(screen.getByText('titulo é obrigatório'))
        })
    })

    test.only("Deve criar uma nova tarefa", async () => {
        const todosMock: Todo[] = [
            { id: 1, title: 'Todo 1', dueDate: '2024-08-01', doneDate: null, status: 'PENDING', createdAt: '2024-08-01', updatedAt: '2024-08-01' }
        ];
        const newTodosMock: Todo =
            { id: 1, title: 'Novo Todo', dueDate: '2024-08-01', doneDate: null, status: 'PENDING', createdAt: '2024-08-01', updatedAt: '2024-08-01' }

        mockAdapter.onGet('/todos').reply(200, todosMock);
        mockAdapter.onPost('/todos').reply(200, newTodosMock);
        await act(async () => {
            render(<Home initialTodo={TodoModel.getInitialValue()} repository={todoRepository} />);
        });

        await act(async () => {
            fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Novo Todo' } });
            fireEvent.click(screen.getByText('Salvar'));
        });

        await waitFor(() => {
            expect(screen.getByText('Novo Todo:')).toBeInTheDocument();
            expect(screen.queryAllByText("PENDING")).toHaveLength(2)
            expect(screen.getByText('Novo Todo:').parentElement).toHaveTextContent('PENDING');
        });
    })
});
