import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUsersService from './CreateUser.service';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsers: CreateUsersService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUsers = new CreateUsersService(fakeUsersRepository, fakeHashProvider);
  });

  it('Should be able to create new user', async () => {
    const user = await createUsers.execute({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    expect(user.email).toBe('john_doe@gmail.com');
  });

  it('Should not be able to create new user with same email', async () => {
    await createUsers.execute({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    await expect(
      createUsers.execute({
        name: 'John Doe',
        email: 'john_doe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
