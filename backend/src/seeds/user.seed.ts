
import { User } from '../users/users.entity';
import * as bcrypt from 'bcryptjs';
import { AppDataSource } from '../data-source'
import * as dotenv from 'dotenv';

export const createDefaultUser = async () => {
    const userRepository = AppDataSource.getRepository(User);

    const userExists = await userRepository.findOne({ where: { email: process.env.DEFAULT_USER } });
    console.log(userExists)
    if (userExists) {

        console.log('Дефолтний користувач вже існує');
        return;
    }

    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD || "654321", 10);
    const defaultUser = userRepository.create({
        email: process.env.DEFAULT_USER || "admin@gmail.com",
        password: hashedPassword,
    });

    await userRepository.save(defaultUser);
    console.log('Дефолтний користувач створений');
};