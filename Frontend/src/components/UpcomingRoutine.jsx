import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import UpcomingRoutineTimer from './UpcomingRoutineTimer';

export const UpcomingRoutine = () => {
    const { routines, convertTimeTo12Hrs } = useAuth();
    const [nextRoutine, setNextRoutine] = useState(null)
    
    useEffect(() => {
      if (routines.length > 0) {
        getUpcomingRoutine();
      }
    }, [routines])

    function getUpcomingRoutine(){
      const currTime = new Date().toTimeString().slice(0, 8);
      // console.log(currTime)
      const upComingRoutines = routines
        .filter((routine) => currTime <= routine.scheduled_at && routine.active )
        .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))[0];

      const response =
        upComingRoutines ||
        routines
          .filter(
            (routine) =>
              currTime >= routine.scheduled_at &&
              routine.scheduled_at !== "00:00:00",
          )
          .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))[0] ||
        null;
      setNextRoutine(response);
    }

  return (
    <>
      <div className="flex items-center gap-2 mb-6 lg:mb-8">
        <div className="bg-green-600 w-3 h-3 rounded-full"></div>
        <h3 className="text-xl md:text-2xl font-semibold">Upcoming</h3>
      </div>
      {nextRoutine?.scheduled_at ? (
        <div>
          <div className="flex justify-between my-4 text-xl font-semibold text-gray-600">
            <h4 className="">{nextRoutine.name}</h4>
            <p>{convertTimeTo12Hrs(nextRoutine.scheduled_at)}</p>
          </div>

          <UpcomingRoutineTimer targetTime={nextRoutine?.scheduled_at}/>
        </div>
      ) : (
        <p className="text-lg">No Routines are active</p>
      )}
    </>
  );
}
