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


const getIssueByIDFromDB = async (issueID:any) => {
  const result = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [issueID]
  );
  const reporterDetails = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    `,
    [result.rows[0].reporter_id]
  );

  const data = {
    id: result.rows[0].id,
    title: result.rows[0].title,
    description: result.rows[0].description,
    type: result.rows[0].type,
    status: result.rows[0].status,
    reporter: reporterDetails.rows[0],
    created_at: result.rows[0].created_at,
    updated_at: result.rows[0].updated_at,
  };

  return data;
}

const updateIssueByIDFromDB = async (issueID: any, payload: any) => {

}


export const issueServices = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getIssueByIDFromDB,
  updateIssueByIDFromDB
};
