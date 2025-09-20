import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js/auto'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

const AnalyticDashboard = () => {
  return (
    <div className='p-10'>
      <h1 className='font-bold '>
        Analytic Dashboard
      </h1>
    </div>
  )
}

export default AnalyticDashboard
