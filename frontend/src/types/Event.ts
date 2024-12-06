import { EventCategory } from "@/types/EventCategory";
import { User } from "@/types/User";

export type Event = {
  id?: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  city: string;
  location: string;
  maxParticipants: number;
  currentParticants?: number;
  category: EventCategory;
  price: number;
  averageRating: number;
  participants: User[];
  organizer: User;
};
