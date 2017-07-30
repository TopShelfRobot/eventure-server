const bcrypt = require('bcrypt');



const setPassword = (plaintextPassword, user) => {
  const salt = bcrypt.genSaltSync(10);
  return Object.assign({}, user, {password_hash: bcrypt.hashSync(plaintextPassword, salt)});
}

const passwordMatches = (plaintextPassword, user) => {
  return bcrypt.compareSync(plaintextPassword, user.password_hash)
}

const register = (userData) => {
  userData = userData || {};

  return Promise.try(() => {
    if (!userData.username || !userData.password) {
      throw new Error('Registration requires a username and a password');
    }

    return userRepository.findByUsername(username)
  })
    .then(user => {
      if (user) throw new Error(`User ${username} already exists`);

      const savedUserData = setPassword(userData.password, userData);
      return userRepository.save(savedUserData)
    })
}


module.exports = userRepository => ({
  setPassword,
  passwordMatches,
  register,
  /**
   * Find a user by username
   * @param  {[type]} username [description]
   * @return {[type]}          [description]
   */
  findByUsername: username => userRepository.findByUsername(username),
  /**
   * Register a new User
   * @type {[type]}
   */
  createUser: userData => {
    userData = userData || {};

    if (!userData.password || !userData.username) {
      throw new Error(`Missing username or password`);
    }

    userData = setPassword(userData.password, userData);
    return userRepository.create(userData);
  },
})