import { Box, Button, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import LabelItem from "@/components/LabelItem";
import LabelAction from "@/actions/label";
import { useEffect, useState } from "react";
import { useAuthHelper } from "@/utils/auth";
import { Label } from "@/types/model";
import {Link} from "react-router-dom";
import { BackendPaginationDataResponse } from "@/types/rest";

export default function LabelPage() {
    const {storedToken} = useAuthHelper();
    const [labels, setLabels] = useState<Label[]>([]);

    useEffect(() => {
        const fetchLabels = async () => {
            const labelResponse = await LabelAction.get(storedToken);
            if (labelResponse?.type == "success") {
                const paginationResp:BackendPaginationDataResponse = labelResponse.data
                const labelDatas: Label[] = paginationResp.data;
                setLabels(labelDatas);
            }
        };
        fetchLabels();
    }, [storedToken]);

    return (
        <Box w={'full'} bg={useColorModeValue('white', 'gray.900')} boxShadow={'2xl'} mb={5} rounded={'lg'} p={6}>
            <h3 className="text-2xl font-bold">My Labels</h3>

            <div className="my-5" >
                <Button as={Link} to="/label/new" colorScheme="blue" size='xs' m={1}>
                    <Text className="mx-3">+ Create New Label</Text>
                </Button>
                <div>
                    {labels.length > 0 && (
                        labels.map((label: Label) => (
                            <LabelItem key={label.id} {...label} />
                        ))
                    )}
                    {labels.length == 0 && (
                        <Stack>
                            <Text>No Labels Data. How about create new one?</Text>
                        </Stack>
                    )}
                </div>
            </div>
        </Box>        
    )
}