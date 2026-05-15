import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell} from 'recharts'


export const WeeklyStats = () => {
  const { getRoutineEntryByFromTo, categories, activeRoutines } = useAuth();
  const [weeklyEntries, setWeeklyEntries] = useState([]);
  const [data, setData] = useState([])
  const [weekSundayDate, setWeekSundayDate] = useState("")
  const [weekSaturdayDate, setWeekSaturdayDate] = useState("")


  // useEffect(() => {
  //   console.log(new Date().getMonth())
  // },[])

  useEffect(() => {
    getCurrentWeekRange();
  }, [])

  useEffect(() => {
    if(weekSundayDate && weekSaturdayDate){
      getWeeklyEntries();
    }
  }, [weekSundayDate, weekSaturdayDate]);

  // useEffect(() => {
  //   console.log(weeklyEntries)
  // },[weeklyEntries])



  // useEffect(() => console.log(data), [])


  function getCurrentWeekRange(){
    const today = new Date()
    const currentDay = today.getDay()

    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay)

    const saturday = new Date(today)
    saturday.setDate(sunday.getDate() + 6)

    const formatDate = (date) => date. toISOString().split("T")[0]

    setWeekSundayDate(formatDate(sunday))
    setWeekSaturdayDate(formatDate(saturday))
  }

  async function getWeeklyEntries() {
    setWeeklyEntries(await getRoutineEntryByFromTo(weekSundayDate, weekSaturdayDate));
  }

  useEffect(
    () => {
      setData(getWeeklyData(weeklyEntries))
    },
    [weeklyEntries]
  );

  function getWeeklyData(entries) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = days.map((day, index) => {
      const count = entries.filter((entry) => {
        const date = new Date(entry.date);
        const day = date.getDay()
        return day === index && entry.completed
      }).length;

      return {day, completed: count}
    });

    return result;
  }

  return (
    <div className="md:w-[80%] w-full  mx-auto">
      <h3 className="text-xl md:text-2xl page-header text-center mb-10">
        Weekly Progress
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" interval={0} angle={-30} textAnchor="end" />
          <YAxis domain={[0, activeRoutines.length]} />
          <Tooltip />
          <Bar dataKey="completed" radius={[5, 5, 0, 0]}>
            {data?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.completed === 0 ? "#ccc" : "#5932ea"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
