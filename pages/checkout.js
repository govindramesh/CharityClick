import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { Button, Container, Heading } from "@chakra-ui/react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51LvdtbF7Yo4hJn5LWugKh2c3TmmPnPGIatYH51XamPxrWshUAydOrfMWayxAOF1VmX1co8oIxkldgdUuj59y8OHN009130NKed"
);

export default function Checkout() {
  const { clientSecret, paymentIntentId } = useRouter().query;
  const options = {
    // passing the client secret obtained from the server
    clientSecret,
  };

  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <Container my={10}>
      <Heading mb={10}>Complete your Setup</Heading>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm paymentIntentId={paymentIntentId} />
      </Elements>
    </Container>
  );
}

const CheckoutForm = ({ paymentIntentId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url:
          "http://localhost:3000/finish-checkout?paymentIntentId=" +
          encodeURIComponent(paymentIntentId),
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        mt={10}
        type="submit"
        disabled={!stripe}
        color={"white"}
        bgColor={"blue.700"}
        _hover={{
          bg: "blue.500",
        }}
      >
        Setup
      </Button>
    </form>
  );
};
