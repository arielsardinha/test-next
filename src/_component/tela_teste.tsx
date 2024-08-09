"use client"
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Todo[]>('https://alunos.treinaweb.com.br/tw-todos/api/v1/todos');
                setTodos(response.data);
            } catch (error) {
                if (error instanceof AxiosError) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTodos();
    }, []);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Lista de Tarefas</h1>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <strong>{todo.title}</strong> - {todo.completed ? 'Concluído' : 'Pendente'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export { TodoList };
