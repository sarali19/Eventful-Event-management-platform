import { EventCard } from "@/components/events/EventCard";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getToken } from "@/lib/token";
import { Event } from "@/types/Event";
import { Role } from "@/types/Role";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

async function getAllEvents() {
  const token = getToken();
  const response = await axios.get<Event[]>(
    "http://localhost:8080/events/all",
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

async function getUserEvents(role: Role) {
  const token = getToken();
  const path =
    role === "ADMIN"
      ? "http://localhost:8080/events/organizer"
      : "http://localhost:8080/events/bookings";
  const response = await axios.get<Event[]>(path, {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

type EventsListProps = {
  byUser?: boolean;
};

export function EventsList({ byUser }: EventsListProps) {
  const { role } = useAuth();
  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events", role, byUser],
    queryFn: !byUser ? getAllEvents : () => getUserEvents(role as Role),
  });

  if (isLoading) return <Loading />;

  if (error)
    return <div className="bg-red-600 text-white">{error.message}</div>;

  if (!events) return <div className="bg-red-600 text-white">No Events</div>;

  return (
    <div className="bg-background">
      {role === "ADMIN" && (
        <div className="flex justify-end items-center py-6">
          <Button asChild>
            <Link to="/create">Create new event</Link>
          </Button>
        </div>
      )}
      <div className="grid gap-4 grid-cols-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
