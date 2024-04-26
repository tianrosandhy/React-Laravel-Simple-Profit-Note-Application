import * as Backend from "@/utils/backend"
import {Label} from "@/types/model"

const LabelAction = {
    get: async (token:string) => {
        const res = Backend.get({endpoint:"/labels?per_page=9999", useBearer: true, bearerToken: token});
        return res;
    },

    getSingle: async (token:string, id: number) => {
        const res = Backend.get({endpoint:`/labels/${id}`, useBearer: true, bearerToken: token});
        return res;
    },

    post: async (token:string, data: Partial<Label>) => {
        const res = Backend.post({endpoint:"/labels", useBearer: true, bearerToken: token, body: {
            title: data.title,
            color: data.color,
        }});
        return res;
    },

    patch: async (token:string, data: Partial<Label>) => {
        const res = Backend.patch({endpoint:`/labels/${data.id}`, useBearer: true, bearerToken: token, body: {
            title: data.title,
            color: data.color,
        }});
        return res;
    },

    delete: async (token:string, id: number) => {
        const res = Backend.del({endpoint:`/labels/${id}`, useBearer: true, bearerToken: token});
        return res;
    }    
}

export default LabelAction;