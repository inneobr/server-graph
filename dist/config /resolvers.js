"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
// resolvers.ts
const source_1 = require("./source");
const oracledb_1 = __importDefault(require("oracledb"));
exports.resolvers = {
    Query: {
        usuario: async (_parent, args) => {
            const conn = await (0, source_1.getConnection)();
            try {
                const result = await conn.execute(`SELECT * FROM USUARIO WHERE ID = :id`, { id: args.id }, { outFormat: oracledb_1.default.OUT_FORMAT_OBJECT });
                return result.rows && result.rows.length > 0 ? result.rows[0] : null;
            }
            finally {
                await conn.close();
            }
        },
        usuarios: async () => {
            const conn = await (0, source_1.getConnection)();
            try {
                const result = await conn.execute(`SELECT * FROM USUARIO ORDER BY ID ASC`, {}, { outFormat: oracledb_1.default.OUT_FORMAT_OBJECT });
                return result.rows || [];
            }
            finally {
                await conn.close();
            }
        },
    },
    Mutation: {
        createUsuario: async (_parent, args) => {
            const { FULLNAME, USERNAME, PASSWORD, EMAIL, PHONE, CIDADE } = args.input;
            const conn = await (0, source_1.getConnection)();
            try {
                const result = await conn.execute(`INSERT INTO USUARIO (ID, FULLNAME, USERNAME, PASSWORD, EMAIL, PHONE, CIDADE)
                    VALUES (SEQ_USUARIO.NEXTVAL, :FULLNAME, :USERNAME, :PASSWORD, :EMAIL, :PHONE, :CIDADE)
                    RETURNING ID INTO :ID`, {
                    FULLNAME,
                    USERNAME,
                    PASSWORD,
                    EMAIL,
                    PHONE,
                    CIDADE,
                    ID: { dir: oracledb_1.default.BIND_OUT, type: oracledb_1.default.NUMBER },
                }, { autoCommit: true });
                // Type assertion: dizemos ao TypeScript que outBinds é do tipo esperado
                const outBinds = result.outBinds;
                return {
                    ID: outBinds.ID[0],
                    FULLNAME,
                    USERNAME,
                    EMAIL,
                    PHONE,
                    CIDADE,
                };
            }
            catch (error) {
                console.error("Error creating user:", error);
                throw new Error("Failed to create user");
            }
            finally {
                await conn.close();
            }
        },
        updateUsuario: async (_parent, args) => {
            const { id, input } = args;
            const conn = await (0, source_1.getConnection)();
            try {
                const updates = [];
                const bindParams = { id };
                // Monta dinamicamente os campos que serão atualizados
                for (const [key, value] of Object.entries(input)) {
                    if (value !== undefined) {
                        updates.push(`${key} = :${key}`);
                        bindParams[key] = value;
                    }
                }
                if (updates.length === 0) {
                    throw new Error("Nenhum campo para atualizar");
                }
                const sql = `UPDATE USUARIO SET ${updates.join(", ")} WHERE ID = :id`;
                await conn.execute(sql, bindParams, { autoCommit: true });
                // Retorna o usuário atualizado
                const result = await conn.execute(`SELECT * FROM USUARIO WHERE ID = :id`, { id }, { outFormat: oracledb_1.default.OUT_FORMAT_OBJECT });
                return result.rows && result.rows[0] ? result.rows[0] : null;
            }
            catch (error) {
                console.error("Error updating user:", error);
                throw new Error("Failed to update user");
            }
            finally {
                await conn.close();
            }
        }
    },
};
