const createDatastore = require('./datastore')

module.exports = ({dbService}) => {
  const datastore = createDatastore({
    tableName: 'access_token',
    db: dbService,
    queryable: ['personId', 'token'],
    softDelete: false,
    primaryKey: 'token',
  })

  return datastore
}
