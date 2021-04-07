import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatar.service';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('Should be able to update user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'asadelta.png',
    });

    expect(user.avatar).toBe('asadelta.png');
  });

  it('Should not be able to update user avatar', async () => {
    expect(
      updateUserAvatar.execute({
        user_id: '',
        avatarFilename: 'asadelta',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to delete old user avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'asadelta.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'luffy.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('asadelta.png');
    expect(user.avatar).toBe('luffy.png');
  });
});
