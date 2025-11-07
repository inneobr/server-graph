
import { FoundException } from "../../../exeptions/Exception";
import { getConnection } from "../../../config/source";
import oracledb from "oracledb";
import bcrypt from "bcryptjs";
import { UsuarioServices } from "../../../services/usuarioServices";

interface Usuario {
  ID: number;
  FULLNAME: string;
  USERNAME: string;
  EMAIL?: string;
  PHONE?: string; 
  CIDADE?: number;
}

interface CreateUsuario {
  FULLNAME: string;
  USERNAME: string;
  PASSWORD: string;
  EMAIL?: string;
  PHONE?: string; 
  CIDADE?: number;
}

const service = new UsuarioServices();
export const usuarioResolvers = {
  Query: {
    usuario: async (_: unknown, { id }: { id: number }): Promise<Usuario> => {
      const data = await service.usuario({id});
      return data;
    },

    usuarios: async (): Promise<Usuario[]> => {
      const data = await service.usuarios();
      return data;
    },

    searchUsuario: async (_: unknown, { filter }: { filter: string }): Promise<Usuario[]> => {
      return await service.searchUsuario({ filter });
    },
  },

  Mutation: {
    createUsuario: async (_: unknown, { usuario }: { usuario: CreateUsuario }): Promise<Usuario> => {     
      const data = service.createUsuario({usuario});
      return data;
    },

    updateUsuario: async (_: unknown, { id, usuario }: { id: number; usuario: CreateUsuario }): Promise<Usuario> => {
      const data = service.updateUsuario({id, usuario})
      return data;
    },
    deleteUsuario: async (_: unknown, { id }: { id: number }): Promise<boolean> => {
      const data = service.deleteUsuario({id});
      return data;
    }
  },
};
