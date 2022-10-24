import {
  List,
  ListItem,
  Heading,
  Text,
  Tag,
  TagLeftIcon,
  Flex,
  Badge,
  TagLabel,
  Highlight,
  VStack,
} from "@chakra-ui/react";
import { Center } from "@chakra-ui/react";
import { HStack, Stack, Box } from "@chakra-ui/react";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaTiktok,
  FaYoutube,
  FaSnapchat,
  FaReddit,
  FaGamepad,
} from "react-icons/fa";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import mongodb from "../server/mongodb";
import User from "../server/mongodb/models/User";

import "@splidejs/react-splide/css";

function platformToIcon(platform) {
  if (platform === "instagram") {
    return FaInstagram;
  } else if (platform === "twitter") {
    return FaTwitter;
  } else if (platform === "facebook") {
    return FaFacebook;
  } else if (platform === "tiktok") {
    return FaTiktok;
  } else if (platform === "youtube") {
    return FaYoutube;
  } else if (platform === "snapchat") {
    return FaSnapchat;
  } else if (platform === "reddit") {
    return FaReddit;
  } else {
    return FaGamepad;
  }
}

function platformToColorScheme(platform) {
  if (platform === "instagram") {
    return "pink";
  } else if (platform === "twitter") {
    return "blue";
  } else if (platform === "facebook") {
    return "teal";
  } else if (platform === "tiktok") {
    return "gray";
  } else if (platform === "youtube") {
    return "red";
  } else if (platform === "snapchat") {
    return "yellow";
  } else if (platform === "reddit") {
    return "orange";
  } else {
    return "purple";
  }
}
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

  const totalAngelsAmount = user.transactions.reduce((acc, cur) => {
    if (cur.charity === "angels") {
      return acc + cur.amount;
    } else return acc;
  }, 0);

  const totalHopeAmount = user.transactions.reduce((acc, cur) => {
    if (cur.charity === "hope") {
      return acc + cur.amount;
    } else return acc;
  }, 0);

  const totalRainnAmount = user.transactions.reduce((acc, cur) => {
    if (cur.charity === "rainn") {
      return acc + cur.amount;
    } else return acc;
  }, 0);

  const totalTotalAmount = user.transactions.reduce((acc, cur) => {
    return acc + cur.amount;
  }, 0);

  const totalAmount = {
    angels: totalAngelsAmount,
    hope: totalHopeAmount,
    rainn: totalRainnAmount,
    total: totalTotalAmount,
  };

  // const angelsTransactions = user.transactions.filter(
  //   (transaction) => transaction.charity === "angels"
  // ).
  // map((transaction) => {
  //   return {
  //     amount: transaction.amount,
  //     date: transaction.date,
  //     time: transaction.time,
  //     platform: transaction.platform,
  //   };
  // }

  const transactions = user.transactions.map((transaction) => {
    return {
      amount: transaction.amount,
      date: transaction.date.toString(),
      charity: transaction.charity,
      platform: transaction.platform,
      id: transaction.id,
    };
  });

  return {
    props: {
      totalAmount,
      transactions,
    },
  };
}

export default function TransactionsPage({ totalAmount, transactions }) {
  const str = (totalAmount.total / 100).toFixed(2);

  const angelsTransactions = transactions.filter(
    (transaction) => transaction.charity === "angels"
  );

  const hopeTransactions = transactions.filter(
    (transaction) => transaction.charity === "hope"
  );

  const rainnTransactions = transactions.filter(
    (transaction) => transaction.charity === "rainn"
  );

  return (
    <Center my={"5%"}>
      <VStack>
        <Heading mb={"5%"} size={"3xl"}>
          {" "}
          {/* <Highlight
            query="Thank You"
            styles={{ px: "3", py: "3", bg: "green.100", rounded: "md" }}
          > */}
          Thank You For Donating ${str}!{/* </Highlight> */}
        </Heading>
        <HStack spacing={"100px"}>
          {totalAmount.angels > 0 ? (
            <Transaction
              name="Atlanta Angels"
              totalAmount={totalAmount.angels}
              transactions={angelsTransactions}
            />
          ) : null}
          {totalAmount.hope > 0 ? (
            <Transaction
              name="HOPE Atlanta"
              totalAmount={totalAmount.hope}
              transactions={hopeTransactions}
            />
          ) : null}
          {totalAmount.rainn > 0 ? (
            <Transaction
              name="RAINN"
              totalAmount={totalAmount.rainn}
              transactions={rainnTransactions}
            />
          ) : null}
        </HStack>
      </VStack>
    </Center>
  );
}

// Given a date string formed by Date.prototype.toString(), return a string
// with the time in the format HH:MM AM/PM.
function formatTime(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours12}:${minutesStr} ${ampm}`;
}

// Given a date string formed by Date.prototype.toString(), return a string
// of the format MM/DD/YYYY.
function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function Carousel({ transactions }) {
  const options = {
    type: "loop",
    gap: "1rem",
    pauseOnHover: false,
    resetProgress: false,
    perPage: 3,
    arrows: false,
    direction: "ttb",
    height: "17em",
    padding: 0,
  };

  return (
    <div className="wrapper">
      {/* <h2 id="autoplay-example-heading">Autoplay</h2> */}
      <Splide
        options={options}
        aria-labelledby="autoplay-example-heading"
        hasTrack={false}
        extensions={{ AutoScroll }}
      >
        <div style={{ position: "relative" }}>
          <SplideTrack>
            {transactions.map((transaction) => {
              const icon = platformToIcon(transaction.platform);
              return (
                <SplideSlide key={transaction.id}>
                  <Center>
                    <Box>
                      <VStack>
                        <Tag
                          px="8"
                          size="lg"
                          variant="subtle"
                          colorScheme={platformToColorScheme(
                            transaction.platform
                          )}
                        >
                          <TagLeftIcon boxSize="20px" as={icon} />
                          <TagLabel>$0.25</TagLabel>
                        </Tag>
                        <HStack>
                          <Badge colorScheme={"blue"}>
                            {formatDate(transaction.date)}
                          </Badge>
                          <Badge colorScheme={"teal"}>
                            {formatTime(transaction.date)}
                          </Badge>
                        </HStack>
                      </VStack>
                    </Box>
                  </Center>
                </SplideSlide>
              );
            })}
          </SplideTrack>
        </div>

        {/* <div className="splide__progress">
          <div className="splide__progress__bar" />
        </div> */}

        {/* <button className="splide__toggle">
          <span className="splide__toggle__play">Play</span>
          <span className="splide__toggle__pause">Pause</span>
        </button> */}
      </Splide>
    </div>
  );
}

function Transaction({ name, totalAmount, transactions }) {
  return (
    <Center>
      <Stack>
        <Box
          borderWidth="2px"
          w="225px"
          h="400px"
          p="15px"
          pb="15px"
          borderRadius="10px"
        >
          <Stack spacing="1px">
            <Text fontSize="md" as="b" color="grey">
              Donations to {name}
            </Text>
            <Text fontSize="3xl" as="b">
              ${(totalAmount / 100).toFixed(2)}
            </Text>
          </Stack>
          <Box w="100%" h="75%">
            <Carousel transactions={transactions} />
          </Box>
        </Box>
      </Stack>
    </Center>
  );
}
