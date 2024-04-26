import * as Backend from "@/utils/backend"
import {Transaction} from "@/types/model";

const TransactionAction = {
    get: async (token:string, param?:Record<string,string>) => {
        if (typeof param == "undefined") {
            param = {};
        }
        if (typeof param?.page == "undefined") {
            param.page = "1";
        }
        if (typeof param?.per_page == "undefined") {
            param.per_page = "20";
        }

        const queryString = new URLSearchParams(param).toString();
        const res = Backend.get({endpoint:"/transactions?" + queryString, useBearer: true, bearerToken: token});
        return res;
    },

    getReport: async (token: string, param?:Record<string,string>) => {
        if (typeof param == "undefined") {
            param = {};
        }

        const queryString = new URLSearchParams(param).toString();
        const res = Backend.get({endpoint:"/transactions/report?" + queryString, useBearer: true, bearerToken: token});
        return res;
    },

    post: async (token:string, data: Partial<Transaction>) => {
        var amount = 0;
        var type = "";
        if (data.expense && data.expense > 0) {
            amount = data.expense;
            type = "expense";
        } else if (data.income && data.income > 0) {
            amount = data.income;
            type = "income";
        }

        const res = Backend.post({endpoint:"/transactions/new", useBearer: true, bearerToken: token, body: {
            wallet_id: data.wallet_id,
            label_id: data.label_id || null,
            amount: amount,
            type: type,
            transaction_date: data.transaction_date || null,
            notes: data.notes || null,
        }});
        return res;
    },

}

export default TransactionAction;