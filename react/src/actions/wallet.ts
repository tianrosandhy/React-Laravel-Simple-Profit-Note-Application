import * as Backend from "@/utils/backend"
import {Wallet} from "@/types/model";

const WalletAction = {
    get: async (token:string) => {
        const res = Backend.get({endpoint:"/wallets?per_page=9999", useBearer: true, bearerToken: token});
        return res;
    },

    getSingle: async (token:string, id: number) => {
        const res = Backend.get({endpoint:`/wallets/${id}`, useBearer: true, bearerToken: token});
        return res;
    },

    post: async (token:string, data: Partial<Wallet>) => {
        const res = Backend.post({endpoint:"/wallets", useBearer: true, bearerToken: token, body: {
            title: data.title,
        }});
        return res;
    },

    patch: async (token:string, data: Partial<Wallet>) => {
        const res = Backend.patch({endpoint:`/wallets/${data.id}`, useBearer: true, bearerToken: token, body: {
            title: data.title,
        }});
        return res;
    },

    delete: async (token:string, id: number) => {
        const res = Backend.del({endpoint:`/wallets/${id}`, useBearer: true, bearerToken: token});
        return res;
    }
}

export default WalletAction;