import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUsersService from './CreateUser.service';

describe('Create user', () => {
  it('Should be able to create new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUsers = new CreateUsersService(fakeUsersRepository);

    const user = await createUsers.execute({
      name: 'Jhon Doe',
      email: 'jhon_doe@gmail.com',
      password: '123456',
    });

    expect(user.email).toBe('jhon_doe@gmail.com');
  });

  it('Should not be able to create new user with same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUsers = new CreateUsersService(fakeUsersRepository);

    await createUsers.execute({
      name: 'Jhon Doe',
      email: 'jhon_doe@gmail.com',
      password: '123456',
    });

    expect(
      createUsers.execute({
        name: 'Jhon Doe',
        email: 'jhon_doe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
