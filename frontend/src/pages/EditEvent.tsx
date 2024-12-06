import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageTitle from "@/components/PageTitle";
import axios from "axios";
import { getToken } from "@/lib/token";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Event } from "@/types/Event";
import { useParams } from "react-router-dom";
import Loading from "@/components/Loading";

async function updateEvent(formData: Partial<Event>) {
  const token = getToken();
  const response = await axios.put<Event>(
    "http://localhost:8080/events/update",
    formData,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

async function getEvent(id?: string) {
  const token = getToken();
  const response = await axios.get<Event>(
    `http://localhost:8080/events/${id}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return { ...response.data, eventDate: new Date(response.data.eventDate) };
}

const formSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  eventDate: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  city: z.string().min(1),
  location: z.string().min(1),
  category: z.enum(["CONCERT", "CONFERENCE", "SPORTS"]),
  maxParticipants: z.coerce.number().min(1),
  price: z.number().min(0),
});

type FormSchema = z.infer<typeof formSchema>;

export function EditEvent() {
  const { id } = useParams();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateEvent,
  });

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events", id],
    queryFn: () => getEvent(id),
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      city: "",
      location: "",
      eventDate: new Date(),
      startTime: "",
      endTime: "",
      maxParticipants: 1,
      price: 0,
    },
    values: event,
  });

  async function onSubmit(formValues: FormSchema) {
    const formattedFormValues = {
      ...formValues,
      eventDate: (formValues.eventDate as Date).toISOString().split("T")[0],
    };
    try {
      await mutateAsync(formattedFormValues);
      toast.success("Event updated successfully!");
    } catch (error) {
      toast.error("Could not update the Event");
    }
  }

  if (isLoading) return <Loading />;

  if (error)
    return <div className="bg-red-600 text-white">{error.message}</div>;

  return (
    <Form {...form}>
      <PageTitle>Edit Event</PageTitle>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Short description of the event"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value as Date}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Select event date</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Berlin">Berlin</SelectItem>
                  <SelectItem value="Paris">Paris</SelectItem>
                  <SelectItem value="London">London</SelectItem>
                  <SelectItem value="Oslo">Oslo</SelectItem>
                  <SelectItem value="Amsterdam">Amsterdam</SelectItem>
                  <SelectItem value="Rabat">Rabat</SelectItem>
                  <SelectItem value="Casablanca">Casablanca</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Example: 121 Baker Street"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The address of the venu where the event is held
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CONFERENCE">Conference</SelectItem>
                  <SelectItem value="CONCERT">Concert</SelectItem>
                  <SelectItem value="SPORTS">Sports</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Event Category</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxParticipants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum participants</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                  min={0}
                  step={1}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                  min={0}
                  step={1}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
