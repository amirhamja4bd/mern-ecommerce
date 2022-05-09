const chalk = require('chalk');
const bcrypt = require('bcryptjs');

const setupDB = require('./db');
const { ROLE_ADMIN } = require('../constants');
const User = require('../models/user');

const seedDB = async () => {
  try {
    console.log(`${chalk.blue('✓')} ${chalk.blue('seed db started')}`);

    const user = new User({
      email: 'admin@mern.com',
      password: 'testtest',
      firstName: 'admin',
      lastName: 'admin',
      role: ROLE_ADMIN
    });

    const existingUser = await User.findOne({ email: user.email });
    console.log('existingUser', existingUser);
    if (existingUser) throw new Error('user collection is seeded!');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;

    await user.save();

    console.log(`${chalk.green('✓')} ${chalk.green('seed db finished')}`);
  } catch (error) {
    console.log(
      `${chalk.red('x')} ${chalk.red('error while seeding database')}`
    );
    console.log(error);
    return null;
  }
};

(async () => {
  await setupDB().then(async () => {
    await seedDB();
  });
})();