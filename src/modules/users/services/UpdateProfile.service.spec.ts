import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfile from './UpdateProfile.service';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfile;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfile(fakeUsersRepository, fakeHashProvider);
  });

  it('Should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'john_tre@gmail.com',
    });

    expect(updatedUser.email).toBe('john_tre@gmail.com');
  });

  it('Should not be able to update user profile', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: 'blablabla',
        name: 'John Tre',
        email: 'john_tre@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to switch for an existing email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'john_tre@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'john_doe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'john_tre@gmail.com',
      old_password: '123456',
      password: 'abc123',
    });

    expect(updatedUser.password).toBe('abc123');
  });

  it('Should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'john_tre@gmail.com',
        old_password: '12345',
        password: 'abc123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'john_tre@gmail.com',
        password: 'abc123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
