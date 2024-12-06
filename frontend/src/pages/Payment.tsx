import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getToken } from "@/lib/token";
import { Event } from "@/types/Event";
import { formatCurrency } from "@/utils/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

async function getEventDetails(eventId: string | undefined) {
  if (eventId) {
    const token = getToken();
    const path = `http://localhost:8080/events/${eventId}`;
    const response = await axios.get<Event>(path, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
}

async function verifyPayment(paymentInfo: FormSchema) {
  const token = getToken();
  const path = `http://localhost:8080/payment/verify`;
  const response = await axios.post<FormSchema>(path, paymentInfo, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

async function bookEvent(eventId?: string) {
  const token = getToken();
  const response = await axios.post(
    `http://localhost:8080/events/${eventId}/book`,
    undefined,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

const formSchema = z.object({
  fullName: z.string().min(1).trim(),
  cardNumber: z.string().length(16).trim(),
  expirationDate: z.string().trim(),
  cvv: z.string().length(3),
});

type FormSchema = z.infer<typeof formSchema>;

const PaymentFooter = () => {
  return (
    <p className="mt-6 text-center text-gray-500 dark:text-gray-400 sm:mt-8 lg:text-left flex gap-1">
      Payment processed by
      <a
        href="#"
        className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
      >
        Stripe
      </a>
      for
      <a
        href="#"
        className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
      >
        Eventful LLC
      </a>
      - United States Of America
    </p>
  );
};

const PaymentSummary = ({ event }: { event: Event }) => {
  return (
    <div className="mt-6 grow sm:mt-8 lg:mt-0">
      <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
              Item
            </dt>
            <dd className="text-base font-medium text-gray-900 dark:text-white">
              {event.title}
            </dd>
          </dl>
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
              Item ID
            </dt>
            <dd className="text-sm font-medium">{event.id}</dd>
          </dl>
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
              Total
            </dt>
            <dd className="text-base font-medium text-green-500 dark:text-white">
              {formatCurrency(event.price)}
            </dd>
          </dl>
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
              Included Tax (20%)
            </dt>
            <dd className="text-base text-gray-700 dark:text-white">
              {formatCurrency((event.price * 20) / (100 + 20))}
            </dd>
          </dl>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-8">
        <img
          className="h-8 w-auto dark:hidden"
          src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal.svg"
          alt="PayPal"
        />
        <img
          className="hidden h-8 w-auto dark:flex"
          src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal-dark.svg"
          alt="PayPal Dark"
        />
        <img
          className="h-8 w-auto dark:hidden"
          src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa.svg"
          alt="Visa"
        />
        <img
          className="hidden h-8 w-auto dark:flex"
          src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa-dark.svg"
          alt="Visa Dark"
        />
        <img
          className="h-8 w-auto dark:hidden"
          src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard.svg"
          alt="MasterCard"
        />
        <img
          className="hidden h-8 w-auto dark:flex"
          src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard-dark.svg"
          alt="MasterCard Dark"
        />
      </div>
    </div>
  );
};

export function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventDetails(id),
  });

  const { mutateAsync: bookEventMutation } = useMutation({
    mutationFn: () => bookEvent(event?.id),
    onSuccess: () => {
      toast.success("Your event has been booked successfully");
      navigate("/");
    },
  });

  const {
    mutateAsync: verifyPaymentMutation,
    isPending: isPendingPaymentVerification,
  } = useMutation({
    mutationFn: verifyPayment,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      cardNumber: "",
      expirationDate: "",
      cvv: "",
    },
  });

  async function onSubmit(paymentPayload: FormSchema) {
    try {
      await verifyPaymentMutation(paymentPayload);
      await bookEventMutation();
      toast.success("Event created successfully!");
    } catch (error) {
      toast.error(
        "Payment Failed! Please verify your payment details and try again"
      );
    }
  }

  if (isLoading) return <Loading />;

  if (error)
    return <div className="bg-red-600 text-white">{error.message}</div>;

  if (!event) return <div className="bg-red-600 text-white">No Events</div>;

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Payment
          </h2>
          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8"
              >
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input placeholder="Title" type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            As displayed on the card
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="XXXX-XXXX-XXXX-XXXX"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="expirationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiration date</FormLabel>
                          <FormControl>
                            <Input placeholder="24/05" type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Format YY/MM (e.g. 24/05)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input placeholder="123" type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            The last 3 digits in the back of your card
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium  focus:outline-none focus:ring-4"
                  disabled={isPendingPaymentVerification}
                >
                  {isPendingPaymentVerification ? (
                    <>
                      <Loading /> Processing payment
                    </>
                  ) : (
                    "Pay now"
                  )}
                </Button>
              </form>
            </Form>

            <PaymentSummary event={event} />
          </div>
          <PaymentFooter />
        </div>
      </div>
    </section>
  );
}
