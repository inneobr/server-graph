import { FoundException } from "../exeptions/Exception";
import { getConnection } from "../config/source";
import oracledb from "oracledb";
import bcrypt from "bcryptjs";

export interface Usuario {
  ID: number;
  FULLNAME: string;
  USERNAME: string;
  EMAIL?: string;
  PHONE?: string; 
  CIDADE?: number;
}

export interface CreateUsuario {
  FULLNAME: string;
  USERNAME: string;
  PASSWORD: string;
  EMAIL?: string;
  PHONE?: string; 
  CIDADE?: number;
}

export class UsuarioServices {
    usuario = async ({ id }: { id: number }): Promise<Usuario> => {
        const conn = await getConnection();
        try {
            const result = await conn.execute(
                `SELECT * FROM USUARIO WHERE ID = :id`,
                { id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            const usuario = result.rows?.[0] as Usuario | undefined;
            if (!usuario) throw new Error(`Usuario with ID ${id} not found`);
            return usuario;
        } finally {
            await conn.close();
        }
    }

    usuarios = async (): Promise<Usuario[]> => {
        const conn = await getConnection();
        try {
            const result = await conn.execute(
                `SELECT * FROM USUARIO ORDER BY ID ASC`,
                [],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            return (result.rows ?? []).filter((row): row is Usuario => row != null);
        } finally {
            await conn.close();
        }
    }

    createUsuario = async ({ usuario }: { usuario: CreateUsuario }): Promise<Usuario> => {
        const { FULLNAME, USERNAME, PASSWORD, EMAIL, PHONE, CIDADE } = usuario;
        const conn = await getConnection();
        const CRIPTPASS = bcrypt.hashSync(PASSWORD, 10);

        try {
            const existing = await conn.execute(
                `SELECT ID FROM USUARIO WHERE USERNAME = :USERNAME OR EMAIL = :EMAIL OR PHONE = :PHONE`,
                { USERNAME, EMAIL, PHONE },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            if (existing.rows && existing.rows.length > 0) {
                throw new FoundException(`Usuário já cadastrado`);
            }

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
            if (!outBinds?.ID?.[0]) throw new Error("Failed to retrieve new ID after insert");
            return { ID: outBinds.ID[0], FULLNAME, USERNAME, EMAIL, PHONE, CIDADE };
        } finally {
            await conn.close();
        }
    }

    updateUsuario = async ({ id, usuario }: { id: number; usuario: CreateUsuario }): Promise<Usuario> => {
        const conn = await getConnection();
        try {
            const updates: string[] = [];
            const bindParams: Record<string, any> = { id };

            for (const [key, value] of Object.entries(usuario)) {
                if (value !== undefined) {
                    if (key === "PASSWORD") {
                        bindParams[key] = bcrypt.hashSync(value as string, 10);
                    } else {
                        bindParams[key] = value;
                    }
                    updates.push(`${key} = :${key}`);
                }
            }

            if (updates.length === 0) throw new Error("Nenhum campo para atualizar");

            await conn.execute(`UPDATE USUARIO SET ${updates.join(", ")} WHERE ID = :id`, bindParams, { autoCommit: true });

            const result = await conn.execute(
                `SELECT * FROM USUARIO WHERE ID = :id`,
                { id },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            const updatedUsuario = result.rows?.[0] as Usuario | undefined;
            if (!updatedUsuario) throw new Error("Usuario not found after update");
            return updatedUsuario;
        } finally {
            await conn.close();
        }
    }  
    
    searchUsuario = async ({ filter }: { filter: string }): Promise<Usuario[]> => {
        const conn = await getConnection();
        try {
          const result = await conn.execute(
            `SELECT *
               FROM USUARIO
              WHERE UPPER(FULLNAME) LIKE UPPER(:filter)
                 OR UPPER(USERNAME) LIKE UPPER(:filter)
                 OR UPPER(EMAIL) LIKE UPPER(:filter)
                 OR UPPER(PHONE) LIKE UPPER(:filter)
              ORDER BY ID ASC`,
            { filter: `%${filter}%` },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
      
          return (result.rows ?? []).filter((row): row is Usuario => row != null);
        } finally {
          await conn.close();
        }
      };  

    deleteUsuario =  async ({ id }: { id: number }): Promise<boolean> => {
        const conn = await getConnection();

        try {
            const result = await conn.execute(
                `DELETE FROM USUARIO WHERE ID = :id`,
                { id },
                { autoCommit: true }
            );
            return result.rowsAffected !== undefined && result.rowsAffected > 0;

        } finally {
            await conn.close();
        }
    }
}