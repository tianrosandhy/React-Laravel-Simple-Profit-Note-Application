import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    HStack,
    PinInput,
    PinInputField,
    Button,
    Link,
} from '@chakra-ui/react';
import {useState} from 'react';
import { useDisclosure } from '@chakra-ui/react';
import FormLogin from './FormLogin';
import FormRegister from './FormRegister';
import OTPResendAction from '@/actions/otp-resend';
import OTPValidateAction from '@/actions/otp-validate';
import {doLogin} from '@/utils/auth';
import {useDispatch} from 'react-redux';
import {login} from '@/features/authtoken';
import useToastHelper from '@/utils/toast';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal:React.FC<AuthModalProps> = ({isOpen, onClose}) => {
    const [phone, setPhone] = useState('');
    const {isOpen:isSignUpToggleOpen, onOpen:onSignUpToggleOpen, onClose:onSignUpToggleClose} = useDisclosure()
    const {isOpen:isModalOTPOpen, onOpen:onModalOTPOpen, onClose:onModalOTPClose} = useDisclosure()
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const toast = useToastHelper();

    const sendOTP = async (otpOverride?:string) => {
      const otpPassed = otpOverride || otp;
      const resp = await OTPValidateAction(phone, otpPassed);

      if (resp?.type == "success" && typeof resp.data.token != "undefined") {
        const loginData = await doLogin(resp.data.token);
        if (loginData) {
          onModalOTPClose();
          onClose();
          toast.successToast("Logged in successfully");
          dispatch(login(loginData));
        } else {
          setOtp("");
          toast.errorToast("Failed to authenticate to server");
        }
      } else {
        setOtp("");
        toast.errorToast("Oops, invalid OTP. Please try again.");
      }
    }

    const resendOTP = async () => {
      const resp = await OTPResendAction(phone);
      toast.backendToast(resp);

      if (resp?.type == "success") {
        setOtp("");
      }
    }
        
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isSignUpToggleOpen ? "Please sign up" : "Please sign in"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {isSignUpToggleOpen ? (
                <>
                  <FormRegister onModalOTPOpen={onModalOTPOpen} phone={phone} setPhone={setPhone} />
                  <p className="my-4 text-sm">
                    Already have an account? <br />
                    <Link className="underline text-blue-800" color="blue-800" onClick={onSignUpToggleClose}>Login instead</Link>
                  </p>
                </>
            ) : (
              <>
                <FormLogin onModalOTPOpen={onModalOTPOpen} phone={phone} setPhone={setPhone} />
                <p className="my-4 text-sm">
                    Dont have an account? <br />
                    <Link className="underline text-blue-800" color="blue-800" onClick={onSignUpToggleOpen}>Register instead</Link>
                </p>
              </>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal closeOnOverlayClick={false} closeOnEsc={false} isOpen={isModalOTPOpen} onClose={onModalOTPClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>OTP Verification</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p className="text-sm">Please enter the OTP sent to your whatsapp number:</p>
              <HStack>
                <PinInput size="lg" autoFocus value={otp} mask otp onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e === '' || re.test(e)) {
                      setOtp(e);
                    }
                    if (e.length === 6) {
                      sendOTP(e);
                    }
                  }}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>

              <p className="my-4 text-sm">Didn't receive the OTP? <Link className="underline text-blue-800" color="blue-800" onClick={resendOTP}>Resend OTP</Link></p>

              <div>
                <Button colorScheme='blue' variant="ghost" onClick={onModalOTPClose}>Cancel</Button>
                <Button colorScheme="blue">Verify OTP</Button>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>        
      </>
    )
}

export default AuthModal;