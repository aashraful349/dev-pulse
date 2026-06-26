import type { Request } from "express";
import { pool } from "../../db";
import { userRole, type IIssue } from "../../types";

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

const updateIssueByIDFromDB = async (req:Request,issueID: any, payload: any) => {
  const { title, description, type} = payload;
  const issueData=await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [issueID]
  )
  const userData=await pool.query(
    `
    SELECT * FROM users
    WHERE id = $1
    `,
    [issueData.rows[0].reporter_id]
  )

  const role=req.user?.role;
  const email=req.user?.email;
  if(email===userData.rows[0].email && role==="maintainer"){
    const result = await pool.query(
      `
      UPDATE issues
      SET title = COALESCE($1,title), description = COALESCE($2,description), type = COALESCE($3,type), updated_at = NOW()
      WHERE id = $4
      RETURNING id, title, description, type, reporter_id, created_at, updated_at
      `,
      [title, description, type, issueID]
    );
    return result.rows[0];
  }
  else if(email===userData.rows[0].email &&  issueData.rows[0].status==="open"){
    const result = await pool.query(
      `
      UPDATE issues
      SET title = COALESCE($1,title), description = COALESCE($2,description), type = COALESCE($3,type), updated_at = NOW()
      WHERE id = $4
      RETURNING id, title, description, type, reporter_id, created_at, updated_at
      `,
      [title, description, type, issueID]
    );
    return result.rows[0];
  }
  else{
    throw new Error("You are not authorized to update this issue");
  }
  
}

const deleteIssueFromDB = async (issueID: any) => {
  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1 RETURNING *
    `,
    [issueID]
  );
  if(result.rows.length===0){
    throw new Error("Issue not found or already deleted");
  }
  else{
    return 1
  }
};

export const issueServices = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getIssueByIDFromDB,
  updateIssueByIDFromDB,
  deleteIssueFromDB
};
