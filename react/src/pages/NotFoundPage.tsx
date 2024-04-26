import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <>
        <div className="text-center p-10 w-full">
            <h1 className="text-3xl">Page Not Found</h1>
            <Button as={Link} onClick={() => {
                window.location.href = "/";
            }}>Go back to home</Button>
        </div>
        </>
    )
}