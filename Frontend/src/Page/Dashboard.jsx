import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Gauge from '../components/Gauge'
import { UpcomingRoutine } from '../components/UpcomingRoutine'
import { WeeklyStats } from '../components/WeeklyStats'
import MonthlyStats from '../components/MonthlyStats'

const Dashboard = () => {

  const [dashboardCards, setDashboardCards] = useState([])
  const [todayEntries, setTodayEntries] = useState([])
  const { categories, routines, getRoutineEntryByFrom, activeRoutines } = useAuth();
  const [progressChart, setProgressChart] = useState({
    total: activeRoutines.length,
    completed: 0,
    pending: 0,
    completedPercentage: 0,
  });

  useEffect(() => {
    // console.log(generateDashboardCards())
    setDashboardCards(generateDashboardCards())
  },[categories, routines, activeRoutines])


  useEffect(() => {
    async function getTodayRoutine(){
      const response = await getRoutineEntryByFrom(
        new Date().toISOString().split("T")[0]
      );
      // console.log(response)
      setTodayEntries(await response)
    } 

    getTodayRoutine()
  }, [])


  // useEffect(() => console.log("Today", todayEntries), [todayEntries])


  useEffect(() => {
    processChartGenerate(todayEntries)
  }, [todayEntries, activeRoutines])


  const generateDashboardCards = () => {
     const cards = [
      {name: "Categories", value: categories.length},
      {name: "Routines", value: routines.length},
      {name: "Active Routines", value: activeRoutines.length}
     ]
     return cards
  }

  function processChartGenerate(entry){
    // const entryLength = entry.length;
    const total = activeRoutines.length; 
    // console.log(total)
    const completed = entry.filter((entry) => entry.completed === true).length;
    const pending = total - completed;
    const completedPercentage = Math.round((completed / total) * 100) || 0;
    const chartData = {
      total,
      completed,
      pending,
      completedPercentage,
    };
    
    setProgressChart(chartData)
  }

  return (
    <div>
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-10 ">
        {dashboardCards.map((card, index) => (
          <div
            key={index + card.name}
            className="border p-8 px-12 flex-1 flex justify-between items-center sm:min-w-75 rounded border-gray-200 shadow-sm text-[16px] sm:text-[18px]"
          >
            <p className="">{card.name}</p>
            <p className="">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Today Progress Chart */}
      <div className="flex flex-col mt-20 gap-12 xl:gap-20 lg:flex-row items-center lg:items-start">
        <Gauge data={progressChart} />
        <div className="w-full lg:flex-1 py-2 px-4 sm:py-4 sm:px-6 rounded shadow">
          <UpcomingRoutine />
        </div>
      </div>

      <div className="w-full md:w-[80%] mx-auto mt-25">
        <WeeklyStats />
      </div>

      <div className="w-full md:w-[80%] mx-auto my-25">
        <MonthlyStats />
      </div>
    </div>
  );
}

export default Dashboard










{/* <div>
        {
          Object.entries(progressChart)?.map(([key, value], index) => (
            <div key = {index}>
              <>{key}</>
              <p>{value}</p>
            </div>
          ))
        }
      </div> */}