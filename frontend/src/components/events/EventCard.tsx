import { queryClient } from "@/api/queryClient";
import { Rating } from "@/components/Rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getToken } from "@/lib/token";
import { Event } from "@/types/Event";
import { EventCategory } from "@/types/EventCategory";
import { formatCurrency } from "@/utils/currency";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

async function deleteEvent(eventId?: string) {
  const token = getToken();
  const response = await axios.delete(
    `http://localhost:8080/events/${eventId}`,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

async function rateEvent(eventId?: string, rating?: number) {
  const token = getToken();
  const response = await axios.post(
    `http://localhost:8080/events/${eventId}/rate`,
    { rating },
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

const eventCategoryColorMapper: Record<EventCategory, string> = {
  SPORTS: "bg-blue-600",
  CONFERENCE: "bg-green-600",
  CONCERT: "bg-purple-600",
};

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();
  const { role } = useAuth();

  const { mutateAsync: deleteEventMutation, isPending: isPendingDelete } =
    useMutation({
      mutationFn: () => deleteEvent(event.id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
    });

  const { mutateAsync: rateEventMutation, isPending: isPendingRating } =
    useMutation({
      mutationFn: (rating: number) => rateEvent(event?.id, rating),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
    });

  const handleDeleteEvent = async () => {
    try {
      await deleteEventMutation();
      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error("Could not delete the Event");
    }
  };

  const handleRating = async (rating: number) => {
    try {
      await rateEventMutation(rating);
      toast.success("Event rated successfully!");
    } catch (error) {
      toast.error("Could not rate the event");
    }
  };

  return (
    <Card className="bg-slate-200">
      <CardHeader>
        <CardTitle className="text-lg hover:underline underline-offset-4">
          <Link to={`event/${event.id}`}>{event.title}</Link>
        </CardTitle>
        <CardDescription>{event.description}</CardDescription>
        <CardDescription>
          <div className="flex">
            {event.eventDate.toLocaleString()} | {event.city}
          </div>
        </CardDescription>
        <div>
          <Badge className={eventCategoryColorMapper[event.category]}>
            {event.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {role === "MEMBER" && (
          <div className="flex gap-4">
            <Rating
              value={Math.round(event.averageRating)}
              onChange={handleRating}
              disabled={isPendingRating}
            />
            {event.averageRating}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button asChild>
            <Link to={`event/${event.id}`}>VIEW</Link>
          </Button>
          {role === "ADMIN" && (
            <>
              <Button
                variant="secondary"
                onClick={() => navigate(`/event/${event.id}/edit`)}
                disabled={isPendingDelete}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDeleteEvent}
                disabled={isPendingDelete}
              >
                <Trash />
              </Button>
            </>
          )}
        </div>
        <div className="text-lg font-bold">{formatCurrency(event.price)}</div>
      </CardFooter>
    </Card>
  );
}
