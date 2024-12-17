'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import { eachWeekOfInterval, format, parse, addDays, startOfWeek, addMinutes } from 'date-fns';
import { updateAvailability } from '@/app/lib/action'; // Importez la fonction
import { FaTrash } from 'react-icons/fa'; // Importez l'icône de suppression

interface Availability {
  [key: string]: any;
}

export default function Calendar({ availability, intervenantId }: { availability: string, intervenantId: string }) {
  const [calendarView, setCalendarView] = useState("timeGridWeek");
  const [headerToolbar, setHeaderToolbar] = useState({
    left: "title prev,next today",
    center: "",
    right: "timeGridDay,timeGridWeek,dayGridMonth",
  });
  const [events, setEvents] = useState<{ title: string; start: string; end: string; url?: string; groupId?: string }[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability>(JSON.parse(availability));

  const handleWindowResize = () => {
    const { innerWidth } = window;
    if (innerWidth < 768) {
      setCalendarView("timeGridDay");
      setHeaderToolbar({
        left: "today,prev",
        center: "title",
        right: "next",
      });
    } else if (innerWidth < 1024) {
      setCalendarView("timeGridWeek");
      setHeaderToolbar({
        left: "today,prev title next,timeGridDay,timeGridWeek,dayGridMonth",
        center: "",
        right: "",
      });
    } else {
      setHeaderToolbar({
        left: "today,prev title next,timeGridDay,timeGridWeek,dayGridMonth",
        center: "",
        right: "",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    function AvailabilityIntoEvents(availability: any) {
      let events: { title: string; start: string; end: string; url?: string; groupId?: string }[] = [];
      const JourSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
      availability = JSON.parse(availability);
      
      const Currentyear = new Date().getFullYear();
      const DebutAnneeScolaire = new Date(Currentyear, 8, 1); 
      const FinAnneeScolaire = new Date(Currentyear + 1, 6, 1); 
      const allWeeks = eachWeekOfInterval({ start: DebutAnneeScolaire, end: FinAnneeScolaire }, { weekStartsOn: 1 });
    
      for (const weekStart of allWeeks) {
        const weekNumber = format(weekStart, 'I'); 
        if (!availability[`S${weekNumber}`] && availability.default !== null) {
          availability[`S${weekNumber}`] = availability.default;
        }
      }
    
      for (const [week, weekAvailability] of Object.entries(availability)) {
        if (week === 'default') continue;
        const weekStart = allWeeks.find(w => format(w, 'I') === week.replace('S', ''));
        if (!weekStart) continue;
    
        events = events.filter(event => event.groupId !== week);
    
        for (const availability of weekAvailability as { days: string; from: string; to: string }[]) {
          if (!availability.days) continue;
          const days = availability.days.split(', ');
          const from = parse(availability.from, 'HH:mm', new Date());
          const to = parse(availability.to, 'HH:mm', new Date());
    
          if (isNaN(from.getTime())) {
            console.error(`Invalid 'from' time: ${availability.from}`);
            continue;
          }
          if (isNaN(to.getTime())) {
            console.error(`Invalid 'to' time: ${availability.to}`);
            continue;
          }
    
          for (const day of days) {
            const dayIndex = JourSemaine.indexOf(day);
            const start = addDays(startOfWeek(weekStart, { weekStartsOn: 1 }), dayIndex);
            const startTime = addMinutes(start, from.getHours() * 60 + from.getMinutes());
            const endTime = addMinutes(start, to.getHours() * 60 + to.getMinutes());
            events.push({
              title: 'Disponible',
              start: startTime.toISOString(),
              end: endTime.toISOString(),
              groupId: week
            });
          }
        }
      }
    
      return events;
    }

    const transformedEvents = AvailabilityIntoEvents(availability);
    setEvents(transformedEvents);
  }, [availability]);

  const handleSelect = async (selectInfo: any) => {
    const { start, end } = selectInfo;
    const weekNumber = format(start, 'I');
    const day = start.toLocaleDateString('fr-FR', { weekday: 'long' });

    const newAvailability = {
      days: day,
      from: format(start, 'HH:mm'),
      to: format(end, 'HH:mm')
    };

    setAvailabilities((prev) => {
      const updated = { ...prev };

      // Si la semaine est par défaut, copiez les disponibilités par défaut dans la semaine spécifique
      if (!updated[`S${weekNumber}`] && updated.default) {
        updated[`S${weekNumber}`] = [...updated.default];
      }

      if (!updated[`S${weekNumber}`]) {
        updated[`S${weekNumber}`] = [];
      }

      // Vérifiez si une entrée avec les mêmes horaires existe déjà
      const existingEntry = updated[`S${weekNumber}`].find(
        (a: any) => a.from === newAvailability.from && a.to === newAvailability.to
      );

      if (existingEntry) {
        // Ajoutez le nouveau jour à l'entrée existante
        const existingDays = existingEntry.days.split(', ');
        if (!existingDays.includes(day)) {
          existingEntry.days = [...existingDays, day].join(', ');
        }
      } else {
        // Ajoutez une nouvelle entrée
        updated[`S${weekNumber}`].push(newAvailability);
      }

      return updated;
    });

    setEvents((prev) => [
      ...prev,
      {
        title: 'Disponible',
        start: start.toISOString(),
        end: end.toISOString(),
        groupId: `S${weekNumber}`
      }
    ]);

    console.log(availabilities);

    await updateAvailability(intervenantId, availabilities); // Appelez la fonction pour mettre à jour les disponibilités
  };

  const handleEventClick = async (clickInfo: any) => {
    const { event } = clickInfo;
    const weekNumber = event.groupId;
    const day = new Date(event.start).toLocaleDateString('fr-FR', { weekday: 'long' });
    const from = format(event.start, 'HH:mm');
    const to = format(event.end, 'HH:mm');
  
    setAvailabilities((prev) => {
      const updated = { ...prev };
      const weekAvailability = updated[weekNumber];
  
      if (weekAvailability) {
        const entryIndex = weekAvailability.findIndex(
          (a: any) => a.from === from && a.to === to
        );
  
        if (entryIndex !== -1) {
          const entry = weekAvailability[entryIndex];
          const days = entry.days.split(', ').filter((d: string) => d !== day);
  
          if (days.length > 0) {
            entry.days = days.join(', ');
          } else {
            weekAvailability.splice(entryIndex, 1);
          }
  
          if (weekAvailability.length === 0) {
            delete updated[weekNumber];
          }
        }
      }
  
      return updated;
    });
  
    setEvents((prev) => prev.filter(e => e !== event));

    console.log(availabilities);
  
    event.remove();
    await updateAvailability(intervenantId, availabilities); // Appelez la fonction pour mettre à jour les disponibilités
  };

  const renderEventContent = (eventInfo: any) => {
    return (
      <div className="relative">
        <span>{eventInfo.timeText}</span>
        <div className="mt-1">{eventInfo.event.title}</div>
        <button
          onClick={() => handleEventClick({ event: eventInfo.event })}
          className="absolute top-0 right-0 p-2 m-1 bg-white rounded-md"
        >
          <FaTrash className="text-slate-700" />
        </button>
      </div>
    );
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={calendarView}
      headerToolbar={headerToolbar}
      events={events}
      locale={"fr"}
      allDaySlot={false}
      slotLabelFormat={{
        hour: "2-digit",
        minute: "2-digit",
      }}
      weekNumbers={true}
      navLinks={true}
      editable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      select={handleSelect}
      eventContent={renderEventContent} // Utilisez la fonction pour personnaliser le contenu des événements
      dayHeaderContent={(args) => {
        const date = new Date(args.date);
        const day = date.toLocaleDateString("fr-FR", { weekday: "short" });
        const dayNumber = date.getDate();
        return (
          <div className="flex flex-col text-center">
            <div className="capitalize text-sm font-semibold text-muted-foreground">{day}</div>
            <div className="text-xl font-semibold text-foreground">{dayNumber}</div>
          </div>
        );
      }}
    />
  );
}