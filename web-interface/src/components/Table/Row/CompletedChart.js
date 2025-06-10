import React from 'react'
import { CChartDoughnut } from '@coreui/react-chartjs'

const CompletedChart = ({ value }) => {
  return (
      <CChartDoughnut
        customTooltips={false}
        data={{
          datasets: [
            {
              backgroundColor: ['#41B883', '#DD1B16'],
              data: [value, 100 - value],
            },
          ],
        }}
        options={{
          responsive: false,
          maintainAspectRatio: false,
        }}
        height={50}
        width={50}
        style={{ width: '35px', height: '35px', marginTop: '-5px' }}
      />
  )
}

export { CompletedChart }
