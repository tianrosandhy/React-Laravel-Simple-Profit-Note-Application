import {useState, useEffect} from "react";
import {Label} from "@/types/model";
import {Box, Input, Button, Flex, useDisclosure} from "@chakra-ui/react";
import {Link, useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";
import LabelAction from "@/actions/label";
import useToastHelper from "@/utils/toast";
import { useAuthHelper } from "@/utils/auth";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

export default function FormLabelPage() {
    const toast = useToastHelper();
    const { id } = useParams();
    const [label, setLabel] = useState<Partial<Label>>({});
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#000000");
    const {storedToken} = useAuthHelper();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (typeof id != "undefined") {
            LabelAction.getSingle(storedToken, parseInt(id)).then((response) => {
                if (response?.type == "success") {
                    const labelResp:Label = response.data;
                    setLabel(labelResp);
                    setTitle(labelResp.title || "")
                    setColor(labelResp.color || "#000000");
                } else {
                    toast.errorToast("Oops, failed to fetch label data");
                    navigate("/label");
                }
            });
        }
    }, [id]);

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (typeof label.title == "undefined") {
            toast.errorToast("Please fill the label title first");
            return;
        }

        if (typeof label.id == "undefined") {
            LabelAction.post(storedToken, label).then((response) => {
                toast.backendToast(response);
                if (response?.type == "success") {
                    navigate("/label");
                }
            });
        } else {
            LabelAction.patch(storedToken, label).then((response) => {
                toast.backendToast(response);
                if (response?.type == "success") {
                    navigate("/label");
                }
            });
        }
    }

    const deleteLabel = () => {
        LabelAction.delete(storedToken, label.id || 0).then((response) => {
            toast.backendToast(response);
            if (response?.type == "success") {
                navigate("/label");
            }
        });
    }

    return (
        <Flex className="p-4" justifyContent="center">
            <Box className="max-w-md w-full">
                <form className="p-4" onSubmit={submitForm}>
                    <Flex justifyContent={"space-between"} w="full" mb={3}>
                        <h1 className="text-2xl mb-3">{typeof id != "undefined" ? "Edit Label Data" : "Create New Label Data"}</h1>
                        {label.id && (
                            <div>
                                <Button colorScheme="red" onClick={onOpen}>Delete this label</Button>
                                <DeleteConfirmationModal isOpen={isOpen} onClose={onClose} onConfirm={deleteLabel} />
                            </div>
                        )}
                    </Flex>


                    <Box p={4} boxShadow={'2xl'}>
                        <div className="form-group">
                            <label>Label Title</label>
                            <Input type="text" placeholder="Label Title" maxLength={50} value={title} onChange={(e) => {
                                setLabel({...label, title: e.target.value});
                                setTitle(e.target.value);
                            }} />
                        </div>

                        <div className="form-group">
                            <label>Label Color</label>
                            <Input type="color" placeholder="Label Color" maxLength={10} value={color} onChange={(e) => {
                                setLabel({...label, color: e.target.value});
                                setColor(e.target.value);
                            }} />
                        </div>
                    </Box>

                    <div className="my-3">
                        <Button colorScheme="blue" type="submit" className="mx-2">Save Label Data</Button>
                        <Button as={Link} to="/label" className="mx-2">Cancel</Button>
                    </div>

                    
                </form>
            </Box>
        </Flex>
    )
}