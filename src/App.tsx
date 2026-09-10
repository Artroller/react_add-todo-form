import { useState } from 'react';

import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';

export const UserInfo = ({ user }) => {
  return (
    <a className="UserInfo" href={`mailto:${user.email}`}>
      {user.name}
    </a>
  );
};

export const TodoInfo = ({ todo }) => {
  return (
    <article
      data-id={todo.id}
      className={`TodoInfo ${todo.completed ? 'TodoInfo--completed' : ''}`}
    >
      <h2 className="TodoInfo__title">{todo.title}</h2>

      <UserInfo user={todo.user} />
    </article>
  );
};

export const TodoList = ({ todos }) => {
  return (
    <section className="TodoList">
      {todos.map(todo => (
        <TodoInfo todo={todo} key={todo.id} />
      ))}
    </section>
  );
};

export const App = () => {
  const preparedTodos = todosFromServer.map(todo => ({
    ...todo,
    user: usersFromServer.find(user => user.id === todo.userId),
  }));

  const [todos, setTodos] = useState(preparedTodos);
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [userError, setUserError] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();

    const isTitleEmpty = title.trim() === '';
    const isUserNotSelected = userId === '';

    setTitleError(isTitleEmpty);
    setUserError(isUserNotSelected);

    if (isTitleEmpty || isUserNotSelected) {
      return;
    }

    const selectedUser = usersFromServer.find(
      user => user.id === Number(userId),
    );

    const largestTodoId = todos.reduce(
      (largestId, todo) => Math.max(largestId, todo.id),
      0,
    );

    const newTodo = {
      id: largestTodoId + 1,
      title: title.trim(),
      userId: selectedUser.id,
      completed: false,
      user: {
        id: selectedUser.id,
        name: selectedUser.name,
        username: selectedUser.username,
        email: selectedUser.email,
      },
    };

    setTodos(currentTodos => [...currentTodos, newTodo]);

    setTitle('');
    setUserId('');
    setTitleError(false);
    setUserError(false);
  };

  const handleTitleChange = event => {
    setTitle(event.target.value);
    setTitleError(false);
  };

  const handleUserChange = event => {
    setUserId(event.target.value);
    setUserError(false);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Title</label>

          <input
            id="title"
            type="text"
            data-cy="titleInput"
            placeholder="Enter a title"
            value={title}
            onChange={handleTitleChange}
          />

          {titleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <label htmlFor="user">User</label>

          <select
            id="user"
            data-cy="userSelect"
            value={userId}
            onChange={handleUserChange}
          >
            <option value="" disabled>
              Choose a user
            </option>

            {usersFromServer.map(user => (
              <option value={user.id} key={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {userError && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
