import * as Backend from "@/utils/backend"

const OTPValidateAction = async (whatsappNumber:string, otp: string) => {
    const body = {
        whatsapp_number: whatsappNumber,
        otp: otp,
    };
    const res = Backend.post({endpoint:"/auth/validate-otp", body});
    return res;
}

export default OTPValidateAction;