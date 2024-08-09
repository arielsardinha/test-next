import { TodoList } from "@/_component/tela_teste"
import { Todo } from "@/_repository/todo_repository";
import { render, screen, act } from "@testing-library/react"
import axios from "axios";
import MockAdapter from "axios-mock-adapter";


describe("TodoList", () => {
    let mockAdapter: MockAdapter;
    beforeAll(() => {
        mockAdapter = new MockAdapter(axios);
    })

    afterEach(() => {
        mockAdapter.reset();
    });

    afterAll(() => {
        mockAdapter.restore();
    });
    test('deve buscar a lista de todo com sucesso', async () => {
        const todosMock: Todo[] = [
            { id: 1, title: 'Todo 1', dueDate: '2024-08-01', doneDate: null, status: 'PENDING', createdAt: '2024-08-01', updatedAt: '2024-08-01' }
        ];

        mockAdapter.onGet('https://alunos.treinaweb.com.br/tw-todos/api/v1/todos').reply(200, todosMock);
        const getAllSpy = jest.spyOn(axios, 'get');
        await act(async () => {
            render(<TodoList />);
        });
        expect(getAllSpy.mock.calls.length).toEqual(1);

        expect(screen.getByText('Todo 1')).toBeInTheDocument()
    })
})