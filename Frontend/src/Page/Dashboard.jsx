import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Gauge from '../components/Gauge'
import { UpcomingRoutine } from '../components/UpcomingRoutine'
import { WeeklyStats } from '../components/WeeklyStats'
import MonthlyStats from '../components/MonthlyStats'
import ParticularRoutineStats from '../components/ParticularRoutineStats'

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
        new Date().toLocaleDateString("en-CA")
      );
      // console.log(response)
      setTodayEntries(response)
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
      <div className="grid grid-cols-3 card p-4 rounded-2xl">
        {dashboardCards.map((card, index) => (
          <div
            key={index + card.name}
            className="flex flex-col border-r pl-6 last:border-r-0 border-dashboard"
          >
            <p className="dashboard-header">{card.name}</p>
            <p className="dashboard-count">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Today Progress Chart */}
      <div className="flex flex-col mt-20 py-8 gap-12 xl:gap-20 lg:flex-row  lg:items-center rounded-2xl card">
        <Gauge data={progressChart} />
        <div className="flex w-full lg:w-1/2 flex-1 flex-col gap-8 px-10 py-4">
          <div className="flex-1 border-b border-[#F0F0F0] pb-12">
            <UpcomingRoutine />
          </div>
          <div className="flex-1 py-2 px-4 sm:py-4 sm:px-6 rounded my-5">
            <ParticularRoutineStats />
          </div>
        </div>
      </div>

      <div className="card mt-16 rounded-2xl p-8">
        <WeeklyStats />
      </div>

      <div className="card mt-16 rounded-2xl p-8">
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