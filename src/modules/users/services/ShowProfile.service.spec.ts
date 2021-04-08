import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ShowProfileService from './ShowProfile.service';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('Should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    });

    const profile = await showProfile.execute(user.id);

    expect(profile.name).toBe('John Doe');
  });

  it('Should not be able to show non-existing user profile', async () => {
    await expect(showProfile.execute('blablabla')).rejects.toBeInstanceOf(AppError);
  });
});
