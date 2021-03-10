import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUsersService from './CreateUser.service';

describe('CreateUser', () => {
  it('Should be able to create new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUsers = new CreateUsersService(fakeUsersRepository, fakeHashProvider);

    const user = await createUsers.execute({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    expect(user.email).toBe('john_doe@gmail.com');
  });

  it('Should not be able to create new user with same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUsers = new CreateUsersService(fakeUsersRepository, fakeHashProvider);

    await createUsers.execute({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    expect(
      createUsers.execute({
        name: 'John Doe',
        email: 'john_doe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
