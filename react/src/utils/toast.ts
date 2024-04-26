import {BackendResponse} from '@/utils/backend';
import {useToast} from '@chakra-ui/react';


const BackendToast = (toast:any, response:BackendResponse|null) => {
    toast.closeAll()
    toast({
        title: response?.type == "success" ? "Success" : "Error",
        description: response?.message || (response?.type == "success" ? "Success" : "Oops, something went wrong"),
        status: response?.type || "error",
        duration: 5000,
        isClosable: true,
    });
}

const ToastPromise = async (toast:any, promise:Promise<BackendResponse|null|undefined>) => {
    toast.closeAll()
    toast.promise(promise, {
        success: {title: "Success", duration: 5000},
        error: {title: "Oops, Action failed", duration: 5000},
        loading: {title: "Please wait..."},
    })
}

const ErrorToast = (toast:any, message?:string) => {
    toast.closeAll()
    toast({
        title: "Error",
        description: message || "Oops, something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
    });
}

const SuccessToast = (toast:any, message?:string) => {
    toast.closeAll()
    toast({
        title: "Success",
        description: message || "Action succeeded",
        status: "success",
        duration: 5000,
        isClosable: true,
    });
}

const useToastHelper = () => {
    const toast = useToast();
    
    const backendToast = (response:BackendResponse|null) => {
        return BackendToast(toast, response);    
    }
    const toastPromise = (promise:Promise<BackendResponse|null|undefined>) => {
        return ToastPromise(toast, promise);
    }
    const errorToast = (message?:string) => {
        return ErrorToast(toast, message);
    }
    const successToast = (message?:string) => {
        return SuccessToast(toast, message);
    }

    return {backendToast, toastPromise, errorToast, successToast};
}

export default useToastHelper;