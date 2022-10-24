import {
  HStack,
  Stack,
  Button,
  Heading,
  Center,
  VStack,
} from "@chakra-ui/react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import { Box, Image, Badge } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import {
  Text,
  FormControl,
  Container,
  InputLeftAddon,
  InputGroup,
  Input,
  FormLabel,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import React, { useEffect } from "react";
import { getCharities, setCharities } from "../src/actions/User";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import mongodb from "../server/mongodb";
import User from "../server/mongodb/models/User";
import { getToken } from "next-auth/jwt";

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const token = await getToken({ req: context.req });
  let { sub: id } = token;
  await mongodb();
  let user = await User.findById(id);

  const totalAmount = user.transactions.reduce((acc, cur) => {
    return acc + cur.amount;
  }, 0);

  return {
    props: {
      email: user.email,
      balance: user.balance,
      totalAmount,
    },
  };
}

export default function Charities({ balance, email, totalAmount }) {
  const { data: session, status } = useSession();

  let loggedIn = false;
  if (status === "authenticated") {
    loggedIn = true;
  }

  const [angelsSelected, setAngelsSelected] = React.useState(false);
  const [hopeSelected, setHopeSelected] = React.useState(false);
  const [rainnSelected, setRainnSelected] = React.useState(false);

  useEffect(() => {
    (async () => {
      if (loggedIn) {
        const { angels, hope, rainn } = await getCharities();

        setAngelsSelected(angels);
        setHopeSelected(hope);
        setRainnSelected(rainn);
      }
    })();
  }, [loggedIn]);

  return (
    <>
      <Center mt="20px">
        <Stack>
          <Box borderWidth="2px" w="300px" borderRadius="10px">
            <Center>
              <Stack spacing="1px">
                <Text fontSize="lg">
                  <strong>Total Donations: </strong>$
                  {(totalAmount / 100).toFixed(2)}
                </Text>
              </Stack>
            </Center>
          </Box>
        </Stack>
      </Center>
      <Center>
        <VStack>
          <Box h="30px" />
          <Heading>Select Charities to Donate To</Heading>
          <HStack spacing="15px">
            <CharityBox
              image={
                "https://www.guidestar.org/ViewEdoc.aspx?eDocId=7941942&approved=True"
              }
              CharityName={"Atlanta Angels"}
              charityDescription={
                "Atlanta Angels provides continuous support to local foster homes by providing mentorship to both children and foster parents in a period of change and instability."
              }
              selected={angelsSelected}
              setSelected={(angels) => {
                setCharities({
                  angels,
                  hope: hopeSelected,
                  rainn: rainnSelected,
                });
                setAngelsSelected(angels);
              }}
              visible={loggedIn}
            />
            <CharityBox
              image={
                "https://images.squarespace-cdn.com/content/v1/5939441b1e5b6c8ab18e524f/1623693407934-MRSWU81XEBYU2SB1ICIX/6.png?format=300w"
              }
              CharityName={"HOPE Atlanta"}
              charityDescription={
                "Through programs like SuperPacks and PATH, HOPE Atlanta aids people experiencing homelessness and food insecurity by providing long-term accommodations and support."
              }
              selected={hopeSelected}
              setSelected={(hope) => {
                setCharities({
                  hope,
                  rainn: rainnSelected,
                  angels: angelsSelected,
                });
                setHopeSelected(hope);
              }}
              visible={loggedIn}
            />
            <CharityBox
              image={
                "https://www.rainn.org/sites/all/themes/rainn/RAINN_Logo_NoTagline.jpg"
              }
              CharityName={"RAINN"}
              charityDescription={
                "RAINN employs trained sexual assault service workers to guide survivors through moments of crisis, providing resources such as counseling and emergency shelter."
              }
              selected={rainnSelected}
              setSelected={(rainn) => {
                setCharities({
                  rainn,
                  hope: hopeSelected,
                  angels: angelsSelected,
                });
                setRainnSelected(rainn);
              }}
              visible={loggedIn}
            />
          </HStack>
        </VStack>
      </Center>
      <Box align="right" mr="260px">
        {balance === 0 ? <Pay /> : <Pay reset />}
      </Box>
    </>
  );
}

function CharityBox({
  image = "https://default.com",
  CharityName = "default",
  charityDescription = "default",
  selected,
  setSelected,
  visible,
}) {
  const property = {
    imageUrl: image,
    title: CharityName,
    URL: "https://www.atlantaangels.org/",
    Description: charityDescription,
  };

  return (
    <Stack>
      <Box
        w="300px"
        borderWidth="2px"
        overflow="hidden"
        borderRadius="10px"
        _hover={{
          bg: "grey.100",
        }}
      >
        <Box display="flex" borderBottomWidth="2px" borderColor="grey">
          <Center>
            <Stack>
              <Image
                h="250px"
                w="300px"
                src={property.imageUrl}
                alt={property.imageAlt}
              />
            </Stack>
          </Center>
        </Box>
        <Box>
          <Box display="flex" h="1px" alignItems="baseline"></Box>
          <Box m="3" fontWeight="bold" as="h4" lineHeight="tight" noOfLines={1}>
            {property.title}
          </Box>
          <Text m="3">{property.Description}</Text>
          <Checkbox
            m="3"
            isChecked={selected}
            visibility={visible ? "visible" : "hidden"}
            onChange={(e) => setSelected(!selected)}
          />
        </Box>
      </Box>
    </Stack>
  );
}

function Pay({ reset = false }) {
  const router = useRouter();
  return (
    <FormControl w="30%">
      {/* <FormLabel>Amount</FormLabel> */}
      <InputGroup>
        {/* <InputLeftAddon>$</InputLeftAddon>
        <Input
          type="number"
          placeholder="amount to pay"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        /> */}
      </InputGroup>

      <Button
        mt="4"
        w="70%"
        bgColor={"blue.700"}
        color={"white"}
        _hover={{
          bg: "blue.500",
        }}
        onClick={() => {
          if (reset) {
            (async () => {
              await fetch("/api/user/reset-setup", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
              });
              // reload
              router.reload();
            })();

            return;
          }

          // make a post request to the backend /api/payment
          // with the amount
          (async () => {
            const resp = await fetch("/api/payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount: 1,
              }),
            });

            const data = await resp.json();

            if (data.success) {
              router.push(
                "/checkout?clientSecret=" +
                  encodeURIComponent(data.clientSecret) +
                  "&paymentIntentId=" +
                  encodeURIComponent(data.paymentIntentId)
              );
            }
          })();
        }}
      >
        {!reset ? "Setup Donations" : "Remove Payment Information"}
      </Button>
    </FormControl>
  );
}
