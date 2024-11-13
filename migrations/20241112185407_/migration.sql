/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Task";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Estoque" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "disponivel" BOOLEAN NOT NULL DEFAULT false,
    "quantidade" INTEGER NOT NULL,
    "preco" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Estoque_nome_key" ON "Estoque"("nome");
