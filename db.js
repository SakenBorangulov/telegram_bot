const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  "my_postgres_db_o2do", // Database name
  "my_postgres_db_o2do_user", // Username
  "oqQgkEGDWh9NSUU6GTDa0FQhFhEyrBSE", // Password
  {
    host: "dpg-d274ll7diees73bmmnig-a.oregon-postgres.render.com", // Full hostname
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);