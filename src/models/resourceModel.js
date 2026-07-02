import pool from "../config/db.js";

export const createResource = async (
    name,
    description,
    type,
    responsibleUserId
) => {

    const [result] = await pool.query(
        `INSERT INTO resources
        (name, description, type, responsible_user_id)
        VALUES (?, ?, ?, ?)`,
        [name, description, type, responsibleUserId]
    );

    return result.insertId;

};

export const findResourceByName = async (name) => {

    const [rows] = await pool.query(
        "SELECT * FROM resources WHERE name = ?",
        [name]
    );

    return rows[0];

};

export const getAllResources = async () => {

    const [rows] = await pool.query(
        `SELECT
            r.id,
            r.name,
            r.description,
            r.type,
            r.status,
            u.full_name AS responsible_person
        FROM resources r
        LEFT JOIN users u
        ON r.responsible_user_id = u.id`
    );

    return rows;

};

export const getResourceById = async (id) => {

    const [rows] = await pool.query(
        `SELECT
            r.id,
            r.name,
            r.description,
            r.type,
            r.status,
            u.full_name AS responsible_person
        FROM resources r
        LEFT JOIN users u
        ON r.responsible_user_id = u.id
        WHERE r.id = ?`,
        [id]
    );

    return rows[0];

};

export const updateResource = async (
    id,
    name,
    description,
    type,
    status
) => {

    const [result] = await pool.query(
        `UPDATE resources
        SET
            name = ?,
            description = ?,
            type = ?,
            status = ?
        WHERE id = ?`,
        [name, description, type, status, id]
    );

    return result.affectedRows;

};

export const deleteResource = async (id) => {

    const [result] = await pool.query(
        "DELETE FROM resources WHERE id = ?",
        [id]
    );

    return result.affectedRows;

};