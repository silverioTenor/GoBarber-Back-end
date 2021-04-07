import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUsersService from './CreateUser.service';
import AuthenticateUserService from './AuthenticateUser.service';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsers: CreateUsersService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUsers = new CreateUsersService(fakeUsersRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('Should be able to Authenticate user', async () => {
    const user = await createUsers.execute({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('Should not be able to Authenticate user with incorrect email', async () => {
    await createUsers.execute({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    expect(
      authenticateUser.execute({
        email: 'johndoe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to Authenticate user with incorrect password', async () => {
    await createUsers.execute({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    expect(
      authenticateUser.execute({
        email: 'john_doe@gmail.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
