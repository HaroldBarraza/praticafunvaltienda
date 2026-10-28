import { api } from "../libs/axios";

export interface PerfilFormData {
    name: string
}
export interface UserProfile{
    id:number
    email:string
    name:string
    role: string
    avatarurl: string | null
}

export const perfilService = {
    obtener: () => api.get<UserProfile>("/auth/me").then((r) => r.data),

    actualizar: (datos:PerfilFormData, foto?: File)=> {
        const formData = new FormData();
        formData.append("name",datos.name);
        if(foto){
            formData.append("foto", foto);
        }
        return api.put<UserProfile>("/auth/perfil", formData).then((r) =>r.data)
    }
}