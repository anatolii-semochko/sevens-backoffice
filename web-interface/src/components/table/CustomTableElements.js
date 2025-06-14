import { CSpinner, CTableDataCell, CTableRow } from "@coreui/react"
import React from "react";
import { CChartDoughnut } from "@coreui/react-chartjs"

const EmptyDataRow = ({
  loading = false,
  text = 'No data',
}) => (
  <div className="pt-3 pb-3 d-flex justify-content-center">
    {loading ? <CSpinner /> : text}
  </div>
)

const LogoCell = ({path, value}) => (
  <div className="row-cell-center-50">
    {value
      ? <img src={path + 'small-' + value} alt="logo"/>
      : <i className="text-muted">no logo</i>
    }
  </div>
)

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
        animation: false,
      }}
      height={50}
      width={50}
      style={{ width: '35px', height: '35px', marginTop: '-6px' }}
    />
  )
}

export { EmptyDataRow, LogoCell, CompletedChart }
