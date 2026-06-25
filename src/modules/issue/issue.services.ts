import { pool } from "../../db";
import type { IIssue } from "../../types";

const createIssueIntoDB = async (payload: IIssue, reporterID: number) => {
  const { title, description, type } = payload;
  const result = await pool.query(
    `
    INSERT INTO issues (title, description, type,reporter_id) VALUES ($1,$2,$3,$4) RETURNING *
    `,
    [title, description, type, reporterID],
  );
  // console.log(result.rows);
  return result.rows[0];
};

const getAllIssuesFromDB = async (reqQuery: any) => {
  if (reqQuery.sort) {
  const result = await pool.query(
    `
    SELECT *
    FROM issues
    ORDER BY created_at ${reqQuery.sort === "newest" ? "DESC" : "ASC"}
    `
  );

  const data = await Promise.all(
    result.rows.map(async (issue) => {
      const reporterDetails = await pool.query(
        `
        SELECT id, name, role
        FROM users
        WHERE id = $1
        `,
        [issue.reporter_id]
      );

      return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporterDetails.rows[0],
        created_at: issue.created_at,
        updated_at: issue.updated_at,
      };
    })
  );

  return data;
}else if (reqQuery.type) {
    const result = await pool.query(
      `
    SELECT * FROM issues
    WHERE type = $1
    `,
      [reqQuery.type],
    );

    const data = await Promise.all(
      result.rows.map(async (issue) => {
        const reporterDetails = await pool.query(
          `
        SELECT id, name, role
        FROM users
        WHERE id = $1
        `,
          [issue.reporter_id],
        );

        return {
          id: issue.id,
          title: issue.title,
          description: issue.description,
          type: issue.type,
          status: issue.status,
          reporter: reporterDetails.rows[0],
          created_at: issue.created_at,
          updated_at: issue.updated_at,
        };
      }),
    );

    return data;
  } else if (reqQuery.status) {
  const result = await pool.query(
    `
    SELECT * FROM issues
    WHERE status = $1
    `,
    [reqQuery.status]
  );

  const data = await Promise.all(
    result.rows.map(async (issue) => {
      const reporterDetails = await pool.query(
        `
        SELECT id, name, role
        FROM users
        WHERE id = $1
        `,
        [issue.reporter_id]
      );

      return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporterDetails.rows[0],
        created_at: issue.created_at,
        updated_at: issue.updated_at,
      };
    })
  );

  return data;
} else {
  const result = await pool.query(
    `
    SELECT * FROM issues
    ORDER BY created_at DESC
    `
  );

  const data = await Promise.all(
    result.rows.map(async (issue) => {
      const reporterDetails = await pool.query(
        `
        SELECT id, name, role
        FROM users
        WHERE id = $1
        `,
        [issue.reporter_id]
      );

      return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporterDetails.rows[0],
        created_at: issue.created_at,
        updated_at: issue.updated_at,
      };
    })
  );

  return data;
}
};

export const issueServices = {
  createIssueIntoDB,
  getAllIssuesFromDB,
};
