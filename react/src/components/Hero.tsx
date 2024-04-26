import {
    Stack,
    Flex,
    Button,
    Text,
    VStack,
    useBreakpointValue,
} from '@chakra-ui/react';
import AuthModal from "@/components/Header/AuthModal"
import { useDisclosure } from "@chakra-ui/react"

  
export default function Hero() {
    const { isOpen:isAuthModalOpen, onOpen:onAuthModalOpen, onClose:onAuthModalClose } = useDisclosure()

    return (
      <>
      <Flex
        w={'full'}
        h={'100vh'}
        backgroundImage={
          'url(https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
        }
        backgroundSize={'cover'}
        backgroundPosition={'center center'}>
        <VStack
          w={'full'}
          justify={'center'}
          px={useBreakpointValue({ base: 4, md: 8 })}
          bgGradient={'linear(to-r, blackAlpha.600, transparent)'}>
          <Stack maxW={'2xl'} align={'flex-start'} spacing={6}>
            <Text
              color={'white'}
              fontWeight={700}
              lineHeight={1.2}
              fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}>
              Record your profit easily <br />
            </Text>
            <Text color="white" fontSize={{base: "xl"}}>
              Get the best view of your business with us. Sign in with your whatsapp number to start using this application.
            </Text>
            <Stack direction={'row'}>
              <Button
                bg={'blue.400'}
                rounded={'full'}
                color={'white'}
                onClick={onAuthModalOpen}
                _hover={{ bg: 'blue.500' }}>
                Sign In Now
              </Button>
              <Button
                bg={'whiteAlpha.300'}
                onClick={() => {
                  window.location.href = "https://wa.me/6289622224614";
                }}
                rounded={'full'}
                color={'white'}
                _hover={{ bg: 'whiteAlpha.500' }}>
                Contact Us
              </Button>
            </Stack>
          </Stack>
        </VStack>
      </Flex>
      <AuthModal isOpen={isAuthModalOpen} onClose={onAuthModalClose} />
      </>
    );
}