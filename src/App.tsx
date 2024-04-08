/**
 * Исправлен тип переменной состояния item, теперь это User, а не Record<number, User>
 * Добавлен кастомный хук useThrottle, использует lodash/throttle
 * Добавлены типы Address и Geo
 */
import React, {
	MouseEventHandler, useState, useMemo
} from "react";
import throttle from 'lodash/throttle';

const URL = "https://jsonplaceholder.typicode.com/users";

type Geo = {
	lat: string,
	lng: string
}

type Address = {
	street: string,
	suite: string,
	city: string,
	zipcode: string,
	geo: Geo
}

type Company = {
	bs: string;
	catchPhrase: string;
	name: string;
};

type User = {
	id: number;
	email: string;
	name: string;
	phone: string;
	username: string;
	website: string;
	company: Company;
	address: Address
};

interface IButtonProps {
	onClick: MouseEventHandler<HTMLButtonElement>;
}

interface IUserInfoProps {
	user?: User;
}

function useThrottle(cb: () => void, ms: number) {
	return useMemo(() => throttle(cb, ms), [cb, ms]);
}

function Button({ onClick }: IButtonProps): JSX.Element {
	return (
		<button type="button" onClick={onClick}>
			get random user
		</button>
	);
}

function UserInfo({ user }: IUserInfoProps): JSX.Element {
	return (
		<table>
			<thead>
				<tr>
					<th>Username</th>
					<th>Phone number</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>{user?.name}</td>
					<td>{user?.phone}</td>
				</tr>
			</tbody>
		</table>
	);
}

function App(): JSX.Element {
	const [item, setItem] = useState<User>();
	const [error, setError] = useState<string>('');

	const receiveRandomUser = useThrottle(async () => {
		try {
			const id = Math.floor(Math.random() * (10 - 1)) + 1;
			const response = await fetch(`${URL}/${id}`);
			const _user = (await response.json()) as User;
			setItem(_user)
		} catch (error: unknown) {
			setError((error as Error).message)
		}

	}, 500);

	const handleButtonClick = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.stopPropagation();
		receiveRandomUser();
	};

	return (
		<div>
			<header>Get a random user</header>
			<Button onClick={handleButtonClick} />
			{
				!error ? (
					<UserInfo user={item} />
				) : (
					<div>{error}</div>
				)
			}
		</div>
	);
}

export default App;
