import * as Backend from "@/utils/backend"

const OTPResendAction = async (whatsappNumber:string) => {
    const body = {
        whatsapp_number: whatsappNumber,
    };
    const res = Backend.post({endpoint: "/auth/resend-otp", body});
    return res;
}

export default OTPResendAction;