'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';

export default function Calendar({ events }: { events: any[] }) {
    const [calendarView, setCalendarView] = useState("timeGridWeek");
    const [headerToolbar, setHeaderToolbar] = useState({
      left: "title prev,next today",
      center: "",
      right: "timeGridDay,timeGridWeek,dayGridMonth",
    });

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