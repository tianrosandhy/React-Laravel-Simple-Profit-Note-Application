import * as Backend from "@/utils/backend"

const LoginAction = async (whatsappNumber:string) => {
    const body = {
        whatsapp_number: whatsappNumber,
    };
    const res = Backend.post({endpoint:"/auth/login", body});
    return res;
}

export default LoginAction;