const express = require("express");
const router = express.Router();
const db = require("../db");
const categoriesQueries = require("../queries/categories");
const usersQueries = require("../queries/users");

router.post("/", async (req, res) => {
  try {
    const { email } = req.headers;
    const { category_id, title, date, value } = req.body;

    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({ error: "E-mail is invalid." });
    }

    if (!category_id) {
      return res.status(400).json({ error: "Category id is mandatory." });
    }

    if (!title || title.length < 3) {
      return res.status(400).json({
        error: "Title is mandatory and should have more than 3 characters.",
      });
    }

    if (!date || date.length != 10) {
      return res.status(400).json({
        error: "Date is mandatory and should be in the format YYYY-MM-DD.",
      });
    }

    if (!value) {
      return res.status(400).json({ error: "Value id is mandatory." });
    }

    const userQuery = await db.query(usersQueries.findByEmail(email));
    if (!userQuery.rows[0]) {
      return res.status(404).json({ error: "User does not exists." });
    }

    const categoryQuery = await db.query(
      categoriesQueries.findById(category_id)
    );
    if (!categoryQuery.rows[0]) {
      return res.status(404).json({ error: "Category not found." });
    }

    const text = `
      INSERT INTO
        finances(user_id, category_id, date, title, value)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [userQuery.rows[0].id, category_id, date, title, value];
    const createResponse = await db.query(text, values);

    if (!createResponse.rows[0]) {
      return res.status(400).json({ error: "Finance row not created." });
    }

    return res.status(200).json(createResponse.rows[0]);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.headers;

    if (!id) {
      return res.status(400).json({ error: "ID is mandatory." });
    }

    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({ error: "E-mail is invalid." });
    }

    const userQuery = await db.query(usersQueries.findByEmail(email));
    if (!userQuery.rows[0]) {
      return res.status(404).json({ error: "User does not exists." });
    }

    const selectFinanceText = "SELECT * FROM finances WHERE id = $1";
    const findFinanceValue = [Number(id)];
    const financeItem = await db.query(selectFinanceText, findFinanceValue);

    if (!financeItem.rows[0]) {
      return res.status(400).json({ error: "Finance row not found." });
    }

    if (financeItem.rows[0].user_id != userQuery.rows[0].id) {
      return res
        .status(401)
        .json({ error: "Finance row does not belong to user." });
    }

    const text = "DELETE FROM finances WHERE id = $1 RETURNING *";
    const values = [Number(id)];
    const deleteResponse = await db.query(text, values);

    if (!deleteResponse.rows[0]) {
      return res.status(400).json({ error: "Finance row not deleted." });
    }

    return res.status(200).json(deleteResponse.rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    const { email } = req.headers;

    if (!date || date.length != 10) {
      return res.status(400).json({
        error: "Date is mandatory and should be in the format YYYY-MM-DD.",
      });
    }

    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({ error: "E-mail is invalid." });
    }

    const userQuery = await db.query(usersQueries.findByEmail(email));
    if (!userQuery.rows[0]) {
      return res.status(404).json({ error: "User does not exists." });
    }

    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth();
    const initDate = new Date(year, month, 1).toISOString();
    const finDate = new Date(year, month + 1, 0).toISOString();

    const text = `
      SELECT
        f.id,
        f.title,
        f.category_id,
        c.name AS category_name,
        f.date,
        f.value,
        f.user_id
      FROM finances AS f
      JOIN categories AS c ON
        c.id = f.category_id
      WHERE f.user_id = $1
            AND f.date BETWEEN $2 AND $3
      ORDER BY f.date
    `;
    const values = [userQuery.rows[0].id, initDate, finDate];
    console.log({ text, values });
    const financesQueries = await db.query(text, values);

    return res.status(200).json(financesQueries.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
