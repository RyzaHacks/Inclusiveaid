import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const EventsCalendar = () => {
  const events = [
    { title: 'Event 1', date: '2024-07-01' },
    { title: 'Event 2', date: '2024-07-05' },
  ];

  return (
    <section className="p-8 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4">Events Calendar</h2>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
        />
      </div>
    </section>
  );
};

export default EventsCalendar;
