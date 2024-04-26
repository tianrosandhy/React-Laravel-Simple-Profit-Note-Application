import * as Backend from "@/utils/backend"

const RegisterAction = async (whatsappNumber:string, fullName: string) => {
    const body = {
        whatsapp_number: whatsappNumber,
        full_name: fullName,
    };
    const res = Backend.post({endpoint: "/auth/register", body});
    return res;
}

export default RegisterAction;