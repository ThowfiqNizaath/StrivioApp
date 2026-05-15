import React, { useEffect, useState } from 'react'

const UpcomingRoutineTimer = ({targetTime}) => {
   const [timeLeft, setTimeLeft] = useState("");

   useEffect(() => {
     const interval = setInterval(() => {
       const now = new Date();

       // 🔥 Convert "HH:MM:SS" → hours, minutes, seconds
       const [h, m, s] = targetTime.split(":").map(Number);

       const target = new Date();
       target.setHours(h, m, s, 0);

       // If already passed → next day
       if (now > target) {
         target.setDate(target.getDate() + 1);
       }

       const diff = target - now;

       const hours = Math.floor(diff / (1000 * 60 * 60));
       const minutes = Math.floor((diff / (1000 * 60)) % 60);
       const seconds = Math.floor((diff / 1000) % 60);

       setTimeLeft(
         `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
           2,
           "0",
         )}:${String(seconds).padStart(2, "0")}`,
       );
     }, 1000);

     return () => clearInterval(interval);
   }, [targetTime]);

   return (
     <div className="flex flex-col gap-2 upcoming-card shadow">
       <h4 className="upcoming-text">Starts In</h4>
       <p className='upcoming-count'>{timeLeft || "00:00:00"}</p>
     </div>
   );
}

export default UpcomingRoutineTimer