import { postgres } from "@prisma/orm-postgres/runtime";

const prisma = postgres({
    url: process.env.DATABASE_URL
});

export default prisma;