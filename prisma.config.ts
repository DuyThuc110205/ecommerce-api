import "dotenv/config";
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/contract.prisma",
    db: {
      connection: "postgresql://postgres:postgres@localhost:5432/ecommerce_db",
    },
  }),

  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});