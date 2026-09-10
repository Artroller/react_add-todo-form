import { UserInfo } from '../UserInfo/UserInfo';

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  user: User;
};

type Props = {
  todo: Todo;
};

export const TodoInfo = ({ todo }: Props) => {
  const completedClass = todo.completed ? ' TodoInfo--completed' : '';

  return (
    <div className={`TodoInfo${completedClass}`}>
      <h2 className="TodoInfo__title">{todo.title}</h2>

      <UserInfo user={todo.user} />
    </div>
  );
};
