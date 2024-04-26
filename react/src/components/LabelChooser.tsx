import {Box, Flex} from '@chakra-ui/react';
import {useState, useEffect} from 'react';
import {Label} from '@/types/model';
import LabelAction from '@/actions/label';
import { useAuthHelper } from '@/utils/auth';
import { BackendPaginationDataResponse } from '@/types/rest';
import {Icon} from "@iconify/react";

interface LabelChooserProp {
    label: Partial<Label>,
    setLabel: React.Dispatch<React.SetStateAction<Partial<Label>>>,
}

export default function LabelChooser({...prop}:LabelChooserProp) {
    const [labels, setLabels] = useState<Label[]>([])
    const {storedToken} = useAuthHelper()

    useEffect(() => {
        // Fetch labels from API
        LabelAction.get(storedToken).then(resp => {
            if (resp?.data) {
                const paginationData:BackendPaginationDataResponse = resp.data;
                setLabels(paginationData.data as Label[])
            }
        });
    }, [storedToken])

    return (
        <div>
            {labels.map((loopLabel:Label) => (
                <Box mb={1} color={loopLabel.color ? '#FFFFFF': '#000000'} bg={
                    loopLabel.id == prop.label.id ? (loopLabel.color || '#F7F7F7') : '#DDDDDD'
                } key={loopLabel.id} onClick={() => {
                    if (loopLabel.id == prop.label.id) {
                        prop.setLabel({})
                    } else {
                        prop.setLabel(loopLabel)
                    }
                }} className={`cursor-pointer p-1 mx-1 rounded`}>
                    <Flex justifyContent="start">
                        <Icon icon="clarity:tag-solid" />
                        <span className="mx-2 font-bold text-xs">{loopLabel.title}</span>
                    </Flex>
                </Box>
            ))}
        </div>
    );
}