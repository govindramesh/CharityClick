import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  Image,
  useColorModeValue,
  createIcon,
  Flex,
  IconButton,
  Collapse,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { extendTheme } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import { HStack, VStack } from "@chakra-ui/react";
import { SunIcon, RepeatClockIcon, StarIcon } from "@chakra-ui/icons";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaReddit,
  FaYoutube,
} from "react-icons/fa";

export async function getStaticProps() {
  return { props: { isBlue: true } };
}

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <Box bgColor={"gray.100"}>
        <HStack maxW={"100%"} minW={"1%"} flex={"1%"}>
          <Stack>
            <Container
              maxW={"6xl"}
              height={"100%"}
              my={0}
              py={0}
              bgColor={"Blue.100"}
              ml={"20px"}
            >
              <Heading
                color={"blue.800"}
                fontSize={"90px"}
                pt={"50px"}
                pl={"10px"}
                pb={"15px"}
              >
                CharityClick
              </Heading>
              <Text
                as={"span"}
                color={"blue.800"}
                fontSize={"30px"}
                pl={"10px"}
                pb={"20px"}
                fontweight={"bold"}
              >
                Turning Distractions into Donations
              </Text>
              <Text fontSize={"20"} color={"blue.800"} pt={"15px"} pl={"10px"}>
                To prevent wandering minds and increase productivity,
                CharityClick donates to charities of your choice when you spend
                time on sidetracking websites.
              </Text>
              <Stack direction={"column"} spacing={3} position={"relative"}>
                <Button
                  colorScheme={"Blue"}
                  bg={"blue.300"}
                  rounded={"full"}
                  as="span"
                  px={5}
                  _hover={{
                    bg: "blue.600",
                  }}
                  ml={"120px"}
                  mt={"100px"}
                  mb={"10px"}
                  h={"55px"}
                  w={"310px"}
                  fontSize={"20px"}
                  onClick={() => {
                    window.location.href = "/chrome_extension.zip";
                  }}
                >
                  Download Chrome Extension
                </Button>
                <HStack pb={"180px"} pl={"200px"}>
                  <FaReddit pr={"5px"} size={"25px"} />
                  <FaFacebook size={"25px"} pr={"5px"} />
                  <FaInstagram size={"25px"} pr={"5px"} />
                  <FaTwitter size={"25px"} pr={"5px"} />
                  <FaYoutube size={"25px"} pr={"5px"} />
                </HStack>
              </Stack>
            </Container>
          </Stack>

          <HStack align="right" pb={"160px"} pl={"30px"} pr={"20px"}>
            <StackEx />
          </HStack>
        </HStack>
      </Box>
    </>
  );
}

function Feature({ title, desc, icon, ...rest }) {
  return (
    <Box
      p={5}
      shadow="lg"
      borderWidth="1px"
      flex="1"
      borderRadius="md"
      bgColor={"white"}
      color={"black"}
      W={"200px"}
      h={"300px"}
      align={"center"}
      {...rest}
    >
      {icon}
      <Heading fontSize="xl">{title}</Heading>
      <Text mt={4}>{desc}</Text>
    </Box>
  );
}

function StackEx() {
  return (
    <HStack spacing={8} align={"right"} pr={"1px"} pt={"5px"}>
      <Feature
        title="Block Distractions"
        desc="Sharpen your focus by blocking distracting social media platforms."
        icon={<SunIcon w={"8"} h={"8"} color={"Black"} p={"7px"} />}
      />
      <Feature
        title="Support Charities"
        desc="Send donations to charities of your choice when you click on blocked sites."
        icon={<StarIcon w={"8"} h={"8"} color={"Black"} p={"7px"} />}
      />
      <Feature
        title={"Increase Productivity"}
        desc={"Work at your most efficent state and complete tasks."}
        icon={<RepeatClockIcon w={"8"} h={"8"} color={"Black"} p={"7px"} />}
      />
    </HStack>
  );
}
