import pg from "pg"

export const db = new pg.Pool({
    user : "postgres",
    host: "esg-db.cf8aocwgqbfo.ap-south-1.rds.amazonaws.com",
    database: "esg_system",
    port: 5432,
    password: "esg-Batch12",
    ssl:{
        rejectUnauthorized: false
    }
});