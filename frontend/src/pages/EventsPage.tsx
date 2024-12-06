import { EventsList } from "@/components/events/EventsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function EventsPage() {
  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All Events</TabsTrigger>
        <TabsTrigger value="events">My Events</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <EventsList />
      </TabsContent>
      <TabsContent value="events">
        <EventsList byUser />
      </TabsContent>
    </Tabs>
  );
}
