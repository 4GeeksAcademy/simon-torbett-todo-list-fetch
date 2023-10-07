import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Realizar la llamada fetch al montar el componente
    fetch("https://playground.4geeks.com/apis/fake/todos/simontorbett")
      .then(response => response.json())
      .then(data => {
        setTodos(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  }, []);

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = { label: inputValue, done: false };
      // Agregar el nuevo TODO en el frontend
      setTodos([...todos, newTodo]);

      // Actualizar el backend con la nueva lista de TODOs
      updateBackendTodos([...todos, newTodo]);
      
      setInputValue('');
    }
  };

  const deleteTodo = (index) => {
    // Eliminar el TODO en el frontend
    const updatedTodos = todos.filter((_, currentIndex) => index !== currentIndex);
    setTodos(updatedTodos);

    // Actualizar el backend con la nueva lista de TODOs
    updateBackendTodos(updatedTodos);
  };

  const updateBackendTodos = (updatedTodos) => {
    // Actualizar el backend con la nueva lista de TODOs
    fetch("https://playground.4geeks.com/apis/fake/todos/simontorbett", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodos),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  };

  const clearAllTodos = () => {
    // Limpiar todos los TODOs en el frontend
    setTodos([]);

    // Limpiar todos los TODOs en el backend
    fetch("https://playground.4geeks.com/apis/fake/todos/simontorbett", {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="text-center">
      <h1 className="titulo">Todos</h1>

      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
            placeholder='¿Qué necesitas hacer?' />
        </li>
        {isLoading ? (
          <li className="list-group-item">Cargando...</li>
        ) : (
          todos.map((item, index) => (
            <li className="list-group-item" key={index}>
              {item.label}
              <FontAwesomeIcon icon={faTrashCan} onClick={() => deleteTodo(index)} />
            </li>
          ))
        )}
      </ul>
      <div className='tareas'>{todos.length}</div>

      <button onClick={clearAllTodos}>Limpiar Todas las Tareas</button>
    </div>
  );
};

export default Home;
