import bcrypt from 'bcrypt';
import userSchema from '../models/userModels';

export const createUserOne = async () => {
  const user = await userSchema.findOne({ email: 'lotus@gmail.com' });
  const hashPassword = bcrypt.hashSync('lotus@123', 10);

  if (user === null) {
    await userSchema.create({
      firstName: 'Lotus',
      lastName: 'Dev',
      email: 'lotus@gmail.com',
      password: hashPassword,
    });
  } else {
    console.log('error');
  }
  console.log('Mongo Connection Established');
};
