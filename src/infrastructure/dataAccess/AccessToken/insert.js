

module.exports = function create(db, data, options) {
  const {accessToken: tokenTable} = db.tables;
  const sql = `INSERT INTO ${tokenTable} (token, user_id) VALUES ($[token], $[userId]) RETURNING token`;

  return db.one(sql, data)
    .then(ret => db.one(`SELECT * FROM ${tokenTable} WHERE token=$1`, [ret.token]) );
}