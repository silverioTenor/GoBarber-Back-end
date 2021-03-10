import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUsersService from './CreateUser.service';
import AuthenticateUserService from './AuthenticateUser.service';

describe('AuthenticateUser', () => {
  it('Should be able to Authenticate user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUsers = new CreateUsersService(fakeUsersRepository, fakeHashProvider);
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUsers.execute({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
  });

  it('Should not be able to Authenticate user with incorrect email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUsers = new CreateUsersService(fakeUsersRepository, fakeHashProvider);
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

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
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUsers = new CreateUsersService(fakeUsersRepository, fakeHashProvider);
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

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
