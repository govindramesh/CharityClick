import { Center, Container, Heading } from "@chakra-ui/react";
import Stripe from "stripe";
import User from "../server/mongodb/models/User";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import { HStack, Stack, Box, Text, Image } from "@chakra-ui/react";
import mongodb from "../server/mongodb";
import { CheckCircleIcon } from "@chakra-ui/icons";

export default function Checkout({ amount, balance }) {
  return (
    <Box h="100px" bgColor="blue.800">
      <Center>
        <Box padding="33">
          <CheckCircleIcon w="30px" h="30px" color="white" />
        </Box>
      </Center>
      <Center>
        <Stack mt="80px">
          <HStack spacing="50px">
            <Stack>
              <Heading fontSize="5xl" as="b">
                Thank you for your deposit!
              </Heading>
              <Text fontSize="xl">
                Every time you go off task, 25 cents will be donated to the
                charity of your choice.
              </Text>
            </Stack>
            <Image
              src="https://media.tenor.com/9a0QBLnMWaEAAAAM/cute-bear.gif"
              alt="THANK YOU"
            />
          </HStack>
        </Stack>
      </Center>
    </Box>
  );
}
const stripe = new Stripe(
  "sk_test_51LvdtbF7Yo4hJn5Ln3IWIkbAFUNxaPRdUuBEN9UuXQcP9piEk2iHkiGJlkBOJZPsS1t7ebkwYYXMuzQB5Vubz8x100CCxxCpad"
);
export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  await mongodb();

  const { paymentIntentId } = context.query;
  const data = await stripe.paymentIntents.retrieve(paymentIntentId);
  const token = await getToken({ req: context.req });
  let { sub: id } = token;

  let user = await User.findById(id);

  user.balance += data.amount;
  user.save();

  return {
    props: { amount: data.amount, balance: user.balance }, // will be passed to the page component as props
  };
}
