import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { months } from "../../Files/asserts";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import api from "../../Files/axios";

const ParticularRoutineStats = () => {
  const { routines, errorHandlerFn } = useAuth();
  const [currentRoutine, setCurrentRoutine] = useState("");
  const [monthStartDate, setMonthStartDate] = useState(null);
  const [monthEndDate, setMonthEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [currentMonthYear, setCurrentMonthYear] = useState(new Date());
  const [fetchLoading, setFetchLoading] = useState(false)

  useEffect(() => {
    if (routines.length > 0) {
      setCurrentRoutine(routines[0].id);
    } else {
      setCurrentRoutine("");
    }
  }, [routines]);

  useEffect(() => {
    getCurrentMonthRange();
  }, [currentMonthYear]);

  // useEffect(() => {
  //   console.log(JSON.stringify(data, null, 2));
  // }, [data]);

    useEffect(() => {
      if(currentRoutine){
        getRoutineEntryByRoutineId();
      }
    }, [monthStartDate, monthEndDate, currentRoutine])

  function getCurrentMonthRange() {
    const today = new Date();

    const startDate = new Date(
      currentMonthYear.getFullYear(),
      currentMonthYear.getMonth(),
    );
    const endDate =
      today.getMonth() === currentMonthYear.getMonth() &&
      today.getFullYear() === currentMonthYear.getFullYear()
        ? today
        : new Date(
            currentMonthYear.getFullYear(),
            currentMonthYear.getMonth() + 1,
            0,
          );

    function formateDate(date) {
      return date.toLocaleDateString("en-CA");
    }
    setMonthStartDate(formateDate(startDate));
    setMonthEndDate(formateDate(endDate));
  }

  async function getRoutineEntryByRoutineId() {
    setFetchLoading(true)
    try {
      const response = await api.get(
        `/api/routineEntry/by-routine/${currentRoutine}/?fromDate=${monthStartDate}&toDate=${monthEndDate}`,
      );
      setData(await response.data)
    } catch (err) {
      errorHandlerFn(err);
    } finally{
      setFetchLoading(false)
    }
  }


  function getDaysInMonth(){
    const year = currentMonthYear.getFullYear()
    const month = currentMonthYear.getMonth()

    const totalDays = new Date(year, month + 1, 0).getDate();

    return Array.from({length: totalDays}, (_, index) => index + 1)
  }

  const entryMap = data.reduce((acc, item) => {
    acc[item.date] = {
      completed: item.completed,
      note: item.note,
    };
    return acc;
  }, {});


  return (
    <div className="">
      <h3 className="text-xl md:text-2xl font-semibold mt-3 mb-8">
        Routine Calendar
      </h3>
      {/* Top Routine Picker */}
      {/* <div className="flex items-center gap-3"> */}
      {/* <label htmlFor="routinePicker">Routine:</label> */}
      <select
        id="routinePicker"
        value={currentRoutine}
        className="px-8 py-1 sm:px-10 sm:py-2 shadow w-full cursor-pointer"
        onChange={(e) => {
          setCurrentRoutine(e.target.value);
          // getRoutineEntryByRoutineId();
        }}
      >
        {routines?.map((routine) => (
          <option key={`routine_${routine.id || 0}`} value={routine.id}>
            {routine.name}
          </option>
        ))}
      </select>
      {/* </div> */}

      {/* <div> */}
      <div className="w-full flex justify-center my-8">
        <div className="flex flex-row gap-5 items-center">
          <button
            className="opacity-40 active:opacity-100 cursor-pointer"
            onClick={() =>
              setCurrentMonthYear((prev) =>
                prev.getMonth() === 0
                  ? new Date(prev.getFullYear() - 1, 11)
                  : new Date(prev.getFullYear(), prev.getMonth() - 1),
              )
            }
          >
            <ChevronLeft />
          </button>
          <div className="px-8 py-1 sm:px-10 sm:py-2 shadow flex gap-2 flex-wrap">
            <p>{months[currentMonthYear?.getMonth()]}</p>
            <p>{currentMonthYear?.getFullYear()}</p>
          </div>
          <button
            className="opacity-40 active:opacity-100 cursor-pointer"
            onClick={() =>
              setCurrentMonthYear((prev) =>
                prev.getMonth() === 11
                  ? new Date(prev.getFullYear() + 1, 0)
                  : new Date(prev.getFullYear(), prev.getMonth() + 1),
              )
            }
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      {/* </div> */}

      {fetchLoading ? (
        <div className="flex justify-center items-center h-20 ">
          <LoaderCircle className="animate-spin duration-300 ease-in" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2 max-w-[350px] xl:max-w-[400px] mx-auto w-full">
          {getDaysInMonth().map((day) => {
            const year = currentMonthYear.getFullYear();
            const month = String(currentMonthYear.getMonth() + 1).padStart(
              2,
              "0",
            );
            const dateStr = `${year}-${month}-${String(day).padStart(2, "0")}`;

            const entry = entryMap[dateStr];

            const isCompleted = entry?.completed;
            const note = entry?.note;
            const today = new Date();

            return (
              <div
                key={day}
                title={note || ""} // 👈 hover tooltip
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm rounded
          ${isCompleted ? "bg-green-500" : "border border-gray-400"}
          ${note ? "cursor-pointer" : "cursor-default"}
          ${today.toISOString().split("T")[0] < dateStr && "bg-gray-300 text-gray-500 border-gray-100"}
        `}
              >
                {day}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ParticularRoutineStats;
