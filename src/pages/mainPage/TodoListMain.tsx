import TodoUpdate from '../../component/updatePage/TodoUpdate';
import { getTodoList, deleteTodoItem, patchTodoItem } from '../../API/axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export const TodoListMain = () => {
  const [data, setData] = useState<TodoItem[]>();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [toggle, setToggle] = useState<{ [key: number]: boolean }>({});
  const navigate = useNavigate();

  const moveToRegist = () => {
    navigate('/regist');
  };

  const doneTodos = async () => {
    const response = await getTodoList();
    const doneItems = response.data.items.filter((item: TodoItem) => item.done);
    setData(doneItems.reverse());
  };

  const orderTodos = async () => {
    await setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc')); // 정렬 방식을 변경하고 완료될 때까지 기다립니다.
  
    setData((prevData) => {
      if (!prevData) return prevData;
  
      const newData = [...prevData];
      newData.sort((a, b) => {
        if (order === 'asc') {
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        } else {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
      });
  
      return newData;
    });
  };
  

  const deleteAllTodo = async () => {
    data?.forEach((item) => deleteTodoItem(item._id));
    getData();
  };

  const getData = async () => {
    const response = await getTodoList();
    let items = response.data.items.reverse(); // 데이터를 가져옵니다.
  
    // 현재 정렬 순서에 따라 데이터를 다시 정렬합니다.
    items.sort((a, b) => {
      if (order === 'asc') {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
  
    setData(items); // 정렬된 데이터를 설정합니다.
  };

  useEffect(() => {
    getData();
    
  }, []);
  

  const showTodoDetail = async (id: number) => {
    setToggle((prev) => {
      const newToggle = { ...prev };
      newToggle[id] = !newToggle[id];
      return newToggle;
    });
  };

  const checkTodoDone = async (item: TodoItem) => {
    const { _id, done } = item;
    const body = {
      ...item,
      done: !done,
    };
    await patchTodoItem(_id, body);
    getData();
  };

  return (
    <>
    
      <TodoList>
        {data?.map((item) => (
          <li key={item._id}>
            <div>
              <CheckBox type='checkbox' onChange={() => checkTodoDone(item)} checked={item.done} />
              <TodoTitle onClick={() => showTodoDetail(item._id)}>{item.title}<div>{item.updatedAt.slice(2, 16)}</div></TodoTitle>
            </div>

            <TodoUpdate idNum={item._id} toggle={toggle[item._id]} getData={getData} />
          </li>
        ))}
        {!data?.length && <TodoGuide>할일을 추가해주세요.</TodoGuide>}
      </TodoList>
      <ButtonContainer>
      <Button onClick={doneTodos}>완료</Button>
      <Button onClick={getData}>전체</Button>
        <Button onClick={moveToRegist}>등록</Button>
        <Button onClick={orderTodos}>{order === 'asc' ? '내림차순' : '오름차순'}</Button>

        <Button className='redButton' onClick={deleteAllTodo}>
          전체삭제
        </Button>
      </ButtonContainer>
    </>
  );
};

const TodoList = styled.ul`
  width: 300px;
  list-style: none;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 35px;
  margin: 0 auto 20px;

  li div {
    display: flex;
  }

  & > input {
    display: inline-block;
    margin-right: 10px;
    width: 20px;
  }
`;

const CheckBox = styled.input`
  margin: 3px 10px 3px 4px;
`;

const TodoTitle = styled.h2`
  display: inline-block;
  background-color: #d9d9d9;
  width: 260px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 40px;
  font-size: 16px;
  border-radius: 75px;
  color: black;
  text-align: left;
  justify-content: start;
  margin: 0;
  padding-left: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
 
`;

const TodoGuide = styled.span`
  text-align: center;
`;

// BUTTON
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
`;

const Button = styled.button`
  border: none;
  border-radius: 20px;
  background-color: #d9d9d9;
  color: #black;
  padding: 6px 12px;
  flex-shrink: 0;
  cursor: pointer;

  &.redButton {
    margin-left: 10px;
  }

  &:hover {
    background: #79e127;
    color: white;
  }

  &.redButton:hover {
    background-color: #ef5242;
    color: white;
  }
`;
