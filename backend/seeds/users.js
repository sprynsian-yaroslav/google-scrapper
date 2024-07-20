require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const usersSchema = new Schema({
  email: String,
  password: String
});

const Users = mongoose.model('Users', usersSchema);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const users = [
  {
    email: process.env.USER_EMAIL,
    password: process.env.USER_PASS
  },
];

module.exports = async function seedUsers() {
  try {
    await Users.deleteMany({});

    for (const seedUser of users) {
      const hashedPassword = await bcrypt.hash(seedUser.password, 10);
      const newUser = new Users({
        email: seedUser.email,
        password: hashedPassword
      });
      await newUser.save();
    }

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
}
