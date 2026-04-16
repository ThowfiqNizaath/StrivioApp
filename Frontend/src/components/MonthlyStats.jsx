import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { months } from '../../Files/asserts';
import { ChevronLeft, ChevronRight } from "lucide-react";

const MonthlyStats = () => {
    const { getRoutineEntryByFromTo, activeRoutines } = useAuth();
    const [monthlyEntries, setMonthlyEntries] = useState([])
    const [monthStartDate, setMonthStartDate] = useState(null)
    const [monthEndDate, setMonthEndDate] = useState(null)
    const [data, setData] = useState([])
    const [currentMonthYear, setCurrentMonthYear] = useState(new Date())


    useEffect(() => {
        getCurrentMonthRange()
    },[currentMonthYear])

    useEffect(() => {
       async function loaderFunction(){
         if (monthStartDate && monthEndDate) {
           setMonthlyEntries(
            await getRoutineEntryByFromTo(monthStartDate, monthEndDate),
           );
         } 
       }

       loaderFunction()
    },[monthStartDate, monthEndDate])

    useEffect(
      () => setData(fillRemainingDates(getMonthlyData(monthlyEntries))),
      [monthlyEntries],
    );



    function getCurrentMonthRange(){

        const today = new Date()

        const startDate = new Date(currentMonthYear.getFullYear(), currentMonthYear.getMonth());
        const endDate =
          today.getMonth() === currentMonthYear.getMonth() && today.getFullYear() === currentMonthYear.getFullYear()
            ? today
            : new Date(
                currentMonthYear.getFullYear(),
                currentMonthYear.getMonth() + 1,
                0
              );

        function formateDate(date){
            return date.toLocaleDateString("en-CA");
        }
        setMonthStartDate(formateDate(startDate));
        setMonthEndDate(formateDate(endDate));
    }


    function getMonthlyData(entries) {
      const result = {};

      entries.forEach((entry) => {

        if (!entry.completed) return; // ❗ ignore false

        // const day = new Date(entry.date).getDate().toString().padStart(2, "0");
        const day = new Date(entry.date).getDate().toString()

        result[day] = (result[day] || 0) + 1;
      });

      // console.log(result)

      const uptoDay = Object.keys(result).sort((a, b) => a - b);

      // console.log(uptoDay)

      const filledMissingDatesUptoDay = []

      let count = 1;

      uptoDay.forEach((day, index) => {
        const dayInNum = Number(day)

        if (dayInNum === index + count){
          filledMissingDatesUptoDay.push(day)
         }else{
          for(let i = index + count; i <= dayInNum; i++){
            // const dayString = String(i).padStart(2, "0")
            const dayString = String(i)
            filledMissingDatesUptoDay.push(dayString)
            if(index + count != i){
              count += 1;
          }
        }
      }
      })

      return filledMissingDatesUptoDay.map((day) => ({
          date: day,
          completed: result[day] || 0,
      }));
    }


    function fillRemainingDates(dataArg){

        const daysInMonth = new Date(currentMonthYear.getFullYear(), currentMonthYear.getMonth() + 1, 0).getDate();


        const map = {}

        dataArg.forEach(item => {
            map[item.date] = item.completed
        });

        const result = []

        for(let i = 1; i <= daysInMonth; i++){
            // const day = String(i).padStart(2,"0");
            const day = String(i);

            result.push({
              date: day,
              // completed: (map[day] || day in map) ? map[day] : null,
              completed: day in map ? map[day] : null,
            });
        }

        return result;
    }

    

  return (
    <>
      <h3 className="text-xl md:text-2xl font-semibold text-center mb-10">
        Monthly Progress
      </h3>
      <div className="w-full flex justify-end mb-8">
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
          <div className="px-8 py-1 sm:px-10 sm:py-2 shadow sm:text-xl flex gap-2 flex-wrap">
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

      {/* {data?.length > 0 && ( */}
        {/* <div className="w-full h-[350px] border"> */}
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                interval={1}
                type="category"
                label={{ value: "Date", position: "insideBottom", offset: -5 }}
              />

              <YAxis
                domain={[0, activeRoutines.length + 1]}
                label={{
                  value: "Completed",
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="completed"
                stroke="#4caf50"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
    </>
  );
}

export default MonthlyStats