import { generateToken } from "../utils/auth";
import { getConnection } from "./source";
import bcrypt from "bcryptjs";
import oracledb from "oracledb";

interface CreateUsuario {
    FULLNAME: string;
    USERNAME: string;
    PASSWORD: string;
    EMAIL?: string;
    PHONE?: string;
    CIDADE?: number;
}

interface UpdateUsuario {
    FULLNAME?: string;
    USERNAME?: string;
    PASSWORD?: string;
    EMAIL?: string;
    PHONE?: string;
    CIDADE?: number;
}

export const resolvers = {
    Query: {
        usuario: async (_: unknown, args: { id: number }, context: { user?: { id: number } }) => {
            if (!context.user)  throw new Error("Autenticação necessária");

            const conn = await getConnection();
            try {
                const result = await conn.execute(
                    `SELECT * FROM USUARIO WHERE ID = :id`,
                    { id: args.id },
                    { outFormat: oracledb.OUT_FORMAT_OBJECT }
                );

                return result.rows?.[0] || null;
            } finally {
                await conn.close();
            }
        },

        usuarios: async (_: unknown, __: unknown, context: { user?: { id: number } }) => {
            if (!context.user)  throw new Error("Autenticação necessária");
            const conn = await getConnection();
            try {
                const result = await conn.execute(
                    `SELECT * FROM USUARIO ORDER BY ID ASC`,
                    {},
                    { outFormat: oracledb.OUT_FORMAT_OBJECT }
                );
                return result.rows || [];
            } finally {
                await conn.close();
            }
        },
    },

    Mutation: {
        createUsuario: async (_: unknown, args: { input: CreateUsuario }, context: { user?: { id: number } }) => {
            if (!context.user)  throw new Error("Autenticação necessária");
            const { FULLNAME, USERNAME, PASSWORD, EMAIL, PHONE, CIDADE } = args.input;
            const conn = await getConnection();
            const CRIPTPASS = bcrypt.hashSync(PASSWORD, 10);

            try {
                const result = await conn.execute(
                    `INSERT INTO USUARIO (ID, FULLNAME, USERNAME, PASSWORD, EMAIL, PHONE, CIDADE)
           VALUES (SEQ_USUARIO.NEXTVAL, :FULLNAME, :USERNAME, :PASSWORD, :EMAIL, :PHONE, :CIDADE)
           RETURNING ID INTO :ID`,
                    {
                        FULLNAME,
                        USERNAME,
                        PASSWORD: CRIPTPASS,
                        EMAIL,
                        PHONE,
                        CIDADE,
                        ID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                    },
                    { autoCommit: true }
                );

                const outBinds = result.outBinds as { ID: number[] };

                return {
                    ID: outBinds.ID[0],
                    FULLNAME,
                    USERNAME,
                    EMAIL,
                    PHONE,
                    CIDADE,
                };
            } catch (error) {
                console.error("Error creating user:", error);
                throw new Error("Failed to create user");
            } finally {
                await conn.close();
            }
        },

        updateUsuario: async (_: unknown, args: { id: number; input: UpdateUsuario }, context: { user?: { id: number } }) => {
            if (!context.user)  throw new Error("Autenticação necessária");
            const { id, input } = args;
            const conn = await getConnection();

            try {
                const updates: string[] = [];
                const bindParams: Record<string, any> = { id };

                for (const [key, value] of Object.entries(input)) {
                    if (value !== undefined) {
                        if (key === "PASSWORD") {
                            const CRIPTPASS = bcrypt.hashSync(value as string, 10);
                            updates.push(`${key} = :${key}`);
                            bindParams[key] = CRIPTPASS;
                        } else {
                            updates.push(`${key} = :${key}`);
                            bindParams[key] = value;
                        }
                    }
                }

                if (updates.length === 0) {
                    throw new Error("Nenhum campo para atualizar");
                }

                const sql = `UPDATE USUARIO SET ${updates.join(", ")} WHERE ID = :id`;
                await conn.execute(sql, bindParams, { autoCommit: true });

                const result = await conn.execute(
                    `SELECT * FROM USUARIO WHERE ID = :id`,
                    { id },
                    { outFormat: oracledb.OUT_FORMAT_OBJECT }
                );

                return result.rows?.[0] || null;
            } catch (error) {
                console.error("Error updating user:", error);
                throw new Error("Failed to update user");
            } finally {
                await conn.close();
            }
        },

        login: async (_: unknown, { username, password }: { username: string; password: string }) => {
            const conn = await getConnection();
            try {
                const result = await conn.execute(
                    `SELECT id, username, password FROM usuario WHERE username = :username`,
                    [username],
                    { outFormat: oracledb.OUT_FORMAT_OBJECT }
                );

                if (!result.rows || result.rows.length === 0) {
                    throw new Error("Usuário não encontrado");
                }

                const data = result.rows[0] as any;

                // Aqui, compare a senha fornecida com o hash armazenado
                const valid = await bcrypt.compare(password, data.PASSWORD);
                if (!valid) throw new Error("Senha incorreta");

                const token = generateToken(data.ID);

                return {
                    token,
                    usuario: {
                        ID: data.ID,
                        USERNAME: data.USERNAME,
                    },
                };
            } catch (error) {
                console.error("Erro no login:", error);
                throw new Error("Falha ao autenticar usuário");
            } finally {
                await conn.close();
            }
        }
    },
};
