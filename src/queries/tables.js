const createTables = {
  createDatabase: () => {
    return {
      name: "create-database",
      text: "CREATE DATABASE finances",
    };
  },
  createUsers: () => {
    return {
      name: "create-users",
      text: `
        CREATE TABLE users (
          id    SERIAL PRIMARY KEY,
          name  TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE
        )
      `,
    };
  },
  createCategories: () => {
    return {
      name: "create-categories",
      text: `
        CREATE TABLE categories (
          id   SERIAL PRIMARY KEY,
          name TEXT NOT NULL
        )
      `,
    };
  },
  createFinances: () => {
    return {
      name: "create-finances",
      text: `
        CREATE TABLE finances (
          id          SERIAL PRIMARY KEY,
          user_id     INT,
          category_id INT,
          date        DATE,
          title       TEXT,
          value       NUMERIC,
          CONSTRAINT fk_categories_finances
            FOREIGN KEY (category_id)
              REFERENCES categories(id)
            ON DELETE SET NULL,
          CONSTRAINT fk_users_finances
            FOREIGN KEY (user_id)
              REFERENCES users(id)
            ON DELETE CASCADE
        )
      `,
    };
  },
};

module.exports = createTables;
