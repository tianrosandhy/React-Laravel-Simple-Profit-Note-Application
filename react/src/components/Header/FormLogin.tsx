import {
    Input,
    InputGroup,
    InputLeftAddon,
    Button,
} from "@chakra-ui/react";

import useToastHelper from "@/utils/toast"
import LoginAction from "@/actions/login";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "@/features/loading";

type FormLoginProps = {
    onModalOTPOpen: () => void;
    phone: string,
    setPhone: (phone: string) => void;
}

const FormLogin:React.FC<FormLoginProps> = ({onModalOTPOpen, phone, setPhone}) => {
    const toast = useToastHelper();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(showLoading())
        const resp = await LoginAction(phone);
        dispatch(hideLoading())
        toast.backendToast(resp);
        
        // do login action 
        // then 
        if (resp?.type == "success") {
            onModalOTPOpen();
        }
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Your Whatsapp Number</label>
                <InputGroup>
                    <InputLeftAddon>+62</InputLeftAddon>
                    <Input type='tel' placeholder='your whatsapp number' autoFocus maxLength={18} value={phone} onChange={
                        (e) => {
                            const re = /^[0-9\b]+$/;
                            if (e.target.value === '' || re.test(e.target.value)) {
                                setPhone(e.target.value);
                            }
                        }
                    } />
                </InputGroup>
            </div>

            <div className="mt-3">
                <Button type="submit" colorScheme="blue">Sign In</Button>
            </div>

        </form>        
    )
}

export default FormLogin;