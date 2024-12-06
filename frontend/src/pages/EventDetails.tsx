import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getToken } from "@/lib/token";
import { Event } from "@/types/Event";
import { EventCategory } from "@/types/EventCategory";
import { formatCurrency } from "@/utils/currency";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const getCategoryStockImage = (category: EventCategory) => {
  switch (category) {
    case "CONCERT":
      return "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b";
    case "SPORTS":
      return "https://images.unsplash.com/photo-1464983308776-3c7215084895";
    case "CONFERENCE":
      return "https://images.unsplash.com/photo-1540575467063-178a50c2df87";
    default:
      return;
  }
};

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

export function EventDetails() {
  const { id } = useParams();
  const { userId } = useAuth();

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventDetails(id),
  });

  const isBooked = event?.participants.some((p) => p.id === userId);

  if (isLoading) return <Loading />;

  if (error)
    return <div className="bg-red-600 text-white">{error.message}</div>;

  if (!event) return <div className="bg-red-600 text-white">No Events</div>;

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4 mb-8 lg:mb-0">
            <img
              className="w-full rounded-lg shadow-lg"
              src={getCategoryStockImage(event.category)}
              alt="event image"
            />
          </div>
          <div className="w-full lg:w-1/3 px-4">
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <p className="text-lg mb-6">{event.description}</p>
            <div className="mb-6">
              <p className="text-xl font-bold mb-2">When:</p>
              <p className="text-lg">
                {new Date(event.eventDate).toDateString()}
              </p>
              <p className="text-lg">
                {event.startTime} - {event.endTime}
              </p>
            </div>
            <div className="mb-6">
              <p className="text-xl font-bold mb-2">Where:</p>
              <p className="text-lg">{event.location}</p>
              <p className="text-lg">{event.city}</p>
            </div>
            <div className="mb-6">
              <p className="text-xl font-bold mb-2">Tickets:</p>
              <span className="text-lg font-bold">
                {formatCurrency(event.price)}
              </span>
              <span> / Person</span>
            </div>
            <Button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              disabled={isBooked}
            >
              {isBooked ? (
                <>BOOKED</>
              ) : (
                <Link to={`/event/${event.id}/payment`}>BUY TICKET</Link>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
