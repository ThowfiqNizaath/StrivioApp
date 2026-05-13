import React from 'react'
import { NotepadText } from "lucide-react";


const UserGuide = () => {
  return (
    <div className="leading-relaxed">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold ">Strivio</h1>
      <hr />
      {/* Welcome  */}
      <div className="my-8">
        <h3 className="font-semibold text-xl pb-2 sm:text-2xl">
          Welcome to Strivio!
        </h3>
        <div className="flex flex-col gap-2 ">
          <p className="">
            This app helps you build better routines, stay consistent, and track
            your daily progress.
          </p>
          <p className="">
            Whether you’re trying to improve your habits, stay organized, or
            reach your goals, Strivio is here to support you—one day at a time.
          </p>
        </div>
        <p className="pt-4 font-semibold">
          Start small, stay consistent, and grow every day.
        </p>
      </div>

      <hr />

      {/* How to Use */}
      <div className="mt-8">
        <h3 className="font-semibold text-xl pb-2 sm:text-2xl">How to Use</h3>
        <p>Don’t worry — it’s very simple. Just follow step by step:</p>
      </div>
      {/* Categoroy */}

      <div className="space-y-8 my-8">
        <div>
          <h4 className=" font-semibold sm:text-lg pb-2">
            1. Create a Category
          </h4>
          <p>First, create a category to group your routines.</p>
          <ul className="ml-12 my-4">
            <li className="list-disc">Morning Routine</li>
            <li className="list-disc">Evening Routine</li>
            <li className="list-disc">Study Routine</li>
          </ul>
          <p>
            Think of a category like a folder that keeps related tasks together.
          </p>
        </div>

        {/* Routines */}
        <div>
          <h4 className=" font-semibold sm:text-lg pb-2">
            2. Add Routines (Tasks)
          </h4>
          <p>Now, go inside the category and add your daily routines.</p>
          <p className="font-semibold mt-4">
            Example (inside Morning Routine):
          </p>
          <ul className="ml-12 mt-2">
            <li className="list-disc">Wake up at 5 AM</li>
            <li className="list-disc">No phone for 1 hour after waking up</li>
            <li className="list-disc">Exercise for 20 minutes</li>
            <li className="list-disc">Read a book</li>
          </ul>
        </div>

        {/* Schedule */}
        <div>
          <h4 className="font-semibold sm:text-lg pb-2">
            3. Set Your Schedule
          </h4>
          <p>
            You can set a time for each routine to organize your day better.
          </p>
          <p className="font-semibold mt-4">Example</p>
          <ul className="ml-12 mt-2">
            <li className="list-disc">Wake up at 5:00 AM</li>
            <li className="list-disc">Exercise at 6:00 AM</li>
          </ul>
          <p className="font-semibold mt-4">Setting a schedule helps you:</p>
          <ul className="ml-12 mt-2">
            <li className="list-disc">
              See how many hours are left for the next task
            </li>
            <li className="list-disc">
              Keep your routines in the correct order
            </li>
            <li className="list-disc">Plan your day more effectively</li>
          </ul>

          <p className="font-semibold mt-4 pb-2">No Schedule?</p>
          <p>
            If a routine does not need a specific time, leave the time as 00:00.
          </p>
          <p>This means the routine has no fixed schedule.</p>
        </div>

        <div>
          <h4 className="font-semibold sm:text-lg pb-2">
            4. Open the To-Do Tab
          </h4>
          <p>
            Go to the <span className="font-semibold">To-Do</span> tab to see
            all routines scheduled for the selected date.
          </p>
        </div>
        <div>
          <h4 className="font-semibold sm:text-lg pb-2">
            5. Mark Routines as Completed
          </h4>
          <p>After completing a routine, mark it as completed and save it.</p>

          <p className="font-semibold mt-4">Benefits</p>
          <ul className="ml-12 mt-2">
            <li className="list-disc">Track your daily progress</li>
            <li className="list-disc">Build consistency</li>
            <li className="list-disc">Monitor completed routines easily</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold sm:text-lg pb-2 ">
            6. Check the Selected Date
          </h4>
          <p>Before saving, make sure the correct date is selected.</p>

          <p className="font-semibold mt-4">Important</p>
          <ul className="ml-12 mt-2">
            <li className="list-disc">You can update routines for today</li>
            <li className="list-disc">
              You can also update routines for past dates
            </li>
            <li className="list-disc">
              You cannot mark routines for future dates
            </li>
          </ul>

          <p className="mt-4">
            This helps maintain accurate progress tracking.
          </p>
        </div>
        <div>
          <h4 className="font-semibold sm:text-lg pb-2">
            7. Unscheduled Routines
          </h4>
          <p>
            If a routine time is set as{" "}
            <span className="font-semibold">00:00</span>, it means the routine
            has no fixed schedule.
          </p>

          <p className="mt-2">
            These routines can be completed anytime during the day.
          </p>
        </div>
        <div>
          <h4 className="font-semibold sm:text-lg pb-2">8. Active Routines</h4>

          <p>
            Active routines are routines that are currently enabled and shown in
            the To-Do tab.
          </p>

          <p className="mt-4">
            These routines will continue appearing daily based on their schedule
            until they are disabled.
          </p>

          <p className="font-semibold mt-4">Why disable a routine?</p>

          <p>
            Sometimes you may not want to track a routine for a few days or for
            a certain period of time.
          </p>

          <p className="mt-4">
            In that case, you can set the routine as inactive (false).
          </p>

          <ul className="ml-12 mt-2">
            <li className="list-disc">
              Inactive routines will not appear in the To-Do tab
            </li>
            <li className="list-disc">You can activate them again anytime</li>
          </ul>
        </div>
      </div>

      <hr />

      <div className="my-6">
        <h4 className="font-semibold sm:text-lg pb-2">
          Edit Categories and Routines
        </h4>

        <p>
          Edit options are available for all categories and routines in their
          respective tabs.
        </p>

        <p className="font-semibold mt-4">You can:</p>

        <ul className="ml-12 mt-2">
          <li className="list-disc">Update names</li>
          <li className="list-disc">Change schedules</li>
          <li className="list-disc">Modify routine details</li>
          <li className="list-disc">Delete unwanted items</li>
        </ul>

        <p className="mt-4">
          This helps you keep your routines organized and up to date.
        </p>
      </div>

      <hr />

      <div className="my-6">
        <h4 className="font-semibold sm:text-lg pb-2">
          Dashboard & Progress Tracking
        </h4>

        <p>
          The Dashboard helps you track your routine progress visually using
          graphs and statistics.
        </p>

        <p className="font-semibold mt-4">You can view:</p>

        <ul className="ml-12 mt-2">
          <li className="list-disc">Today’s progress</li>
          <li className="list-disc">Weekly progress</li>
          <li className="list-disc">Monthly progress</li>
          <li className="list-disc">Particular routine progress</li>
        </ul>

        <p className="mt-4">
          Visual charts and graphs make it easier to understand your consistency
          and improvement over time.
        </p>

        <p className="mt-2">
          Use the Dashboard regularly to stay motivated and monitor your habits.
        </p>
      </div>
      <hr />

      <div className="my-8 pt-6">
        <h4 className="font-semibold sm:text-lg pb-2">🎯 Final Note</h4>

        <p>
          Building strong habits takes time and consistency. Start with small
          routines, stay committed, and improve step by step every day.
        </p>

        <p className="mt-4">
          Strivio is here to help you stay organized, track your progress, and
          become more consistent with your goals.
        </p>

        <p className="mt-4 font-semibold">
          Small daily improvements lead to big results 🚀
        </p>
      </div>
    </div>
  );
}

export default UserGuide