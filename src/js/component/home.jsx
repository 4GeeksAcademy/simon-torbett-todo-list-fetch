import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'


//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	const [inputValue, setInputValue] = useState("")
	const [todos, setTodos] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetch("https://playground.4geeks.com/apis/fake/todos/")
			.then(response => response.json())
			.then(data => {
				setTodos(data)
				setIsLoading(false)
			})
			.catch(error => {
				console.log('Error', error)
				setIsLoading(false)
			})
	}, [])
	const addtodo = () => {
		if (inputValue.trim() !== '') {
			const newTodo = { label: inputValue, done: false }
			setTodos([...todos, newTodo])

			updateBackendTodos([...todos, newTodo])
			setInputValue('')
		}
	}
	const deleteTodo = (index) => {
		const updateTodos = todos.filter((currentIndex) => index !== currentIndex)
		setTodos(updateTodos)
		updateBackendTodos(updateTodos)
	}
	const updateBackendTodos = (updateTodos) => {
		fetch("https://playground.4geeks.com/apis/fake/todos/", {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateTodos)
		})
			.then(response => response.json())
			.then (data => console.log(data))
			.catch(error => console.error('Error:', error))
	}
	const ClearAllTodos = () => {
		setTodos([])
		fetch("https://playground.4geeks.com/apis/fake/todos/", {
			method: 'DELETE'
		})
			.then(response => response.json())
			.then(data=>console.log(data))
			.catch(error => console.error('Error:', error))
	}
	return (
		<div className="text-center"> <h1 className="titulo">Todos</h1>

			<ul className="list-group list-group-flush">
				<li className="list-group-item" >
					<input
						type="text"
						onChange={(e) => setInputValue(e.target.value)}
						value={inputValue}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								addtodo();
							}
						}}
						placeholder='Que Necesitas Hacer' />
				</li>
				{isLoading ? (<li className='list-group-item'>cargando</li>):(
				todos.map((item, index) => (
					<li className="list-group-item" key={index}> {item.label} <FontAwesomeIcon icon={faTrashCan} onClick={() => deleteTodo(index) } /></li>
				))
				)}
			</ul>
			<div className='tareas'>{todos.length}</div>
			<button onClick={ClearAllTodos}>Limpiar </button>

		</div>
	);
};

export default Home;
