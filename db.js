/** Database setup for BizTime. */
const {Client} = require('pg');

const DB_URI = (process.env.NODE_ENV === 'test')
    ? "postgresql:///biztime_test"
    : "postgresql://vp:postgres123@localhost/biztime";
//    postgresql://username:password@localhost/databasename
let db = new Client({
    connectionString: DB_URI
});
      
    db.connect();
      
    module.exports = db;

