import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUsersService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const userExist = await userRepository.findOne({ where: { email } });

    if (userExist) throw new Error('Email address already used!');

    const cryptoPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: cryptoPassword,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUsersService;
