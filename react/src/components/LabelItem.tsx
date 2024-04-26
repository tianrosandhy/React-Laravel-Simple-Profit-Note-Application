import {Button, Text} from '@chakra-ui/react';
import {Label} from "@/types/model";
import {Icon} from '@iconify/react';
import {Link} from "react-router-dom";

function LabelItem({...prop}:Label) {
    return (
        <>
        <Button as={Link} to={`/label/detail/${prop.id}`} colorScheme={prop.color} borderColor={prop.color} variant="outline" size='xs' m={1}>
            <Icon icon="clarity:tag-solid" color={prop.color} />
            <Text color={prop.color} className="mx-3">{prop.title}</Text>
        </Button>
        </>
    );
}

export default LabelItem;