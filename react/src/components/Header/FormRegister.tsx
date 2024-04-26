import {
    Input,
    InputGroup,
    InputLeftAddon,
    Button,
} from "@chakra-ui/react";
import {useState} from 'react';
import RegisterAction from "@/actions/register";
import useToastHelper from "@/utils/toast";

type FormRegisterProps = {
    onModalOTPOpen: () => void;
    phone: string;
    setPhone: (phone: string) => void;
}

const FormRegister:React.FC<FormRegisterProps> = ({onModalOTPOpen, phone, setPhone}) => {
    const [name, setName] = useState('');
    const toast = useToastHelper();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resp = await RegisterAction(phone, name);
        toast.backendToast(resp);
        
        // do register action 
        // then 
        if (resp?.type == "success") {
            onModalOTPOpen();
        }
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label>Your Whatsapp Number <span className="text-red-600">*</span></label>
                <InputGroup>
                    <InputLeftAddon>+62</InputLeftAddon>
                    <Input required type='tel' placeholder='your whatsapp number' autoFocus maxLength={18} value={phone} onChange={
                        (e) => {
                            const re = /^[0-9\b]+$/;
                            if (e.target.value === '' || re.test(e.target.value)) {
                                setPhone(e.target.value);
                            }
                        }
                    } />
                </InputGroup>
            </div>

            <div className="form-group mb-3">
                <label>Your Name <span className="text-red-600">*</span></label>
                <Input required type='text' placeholder='Your name' maxLength={50} value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="mt-3">
                <Button type="submit" colorScheme="blue">Sign Up Now</Button>
            </div>
        </form>
    )
}

export default FormRegister;