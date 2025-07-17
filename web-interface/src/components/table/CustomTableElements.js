import React from 'react'
import store from 'src/store'
import CIcon from '@coreui/icons-react'
import { CSpinner } from '@coreui/react'
import { CChartDoughnut } from '@coreui/react-chartjs'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'

const EmptyDataRow = ({
  loading = false,
  text = 'No data',
}) => (
  <div className="pt-3 pb-3 d-flex justify-content-center">
    {loading ? <CSpinner /> : text}
  </div>
)

const BooleanTrigger = ({
  item,
  isActive,
  onToggle,
  className = '',
  title = 'Toggle status',
  disabled = false,
}) => {
  const active = typeof isActive === 'function' ? isActive(item) : Boolean(isActive)

  const handleClick = async () => {
    if (disabled) return
    try {
      await onToggle(item)
    } catch (error) {
      window.toast?.error?.(error.message || 'Error while toggling')
    }
  }

  return (
    <div className={`row-cell-center-50 pt-2 ${className}`}>
      <CIcon
        icon={active ? cilCheckCircle : cilXCircle}
        className={active ? 'text-success' : 'text-danger'}
        title={title}
        onClick={handleClick}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.65 : 1 }}
      />
    </div>
  )
}

const BooleanStatusIcon = ({status, color, title}) => (
    <div className="row-cell-center-50 pt-2">
      {status ?
        <CIcon icon={cilCheckCircle} className={color ?? 'text-success'} title={title} /> :
        <CIcon icon={cilXCircle} className={color ?? 'text-danger'} title={title} />
      }
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

const LanguageFlag = ({language}) => (
  <img src={`${store.getState().path.languageFlags}/${language.code}.png`}
       title={language.name}
       alt={language.name}
       style={{ height: '30px', marginTop: '1px' }}
  />
)

export { EmptyDataRow, BooleanTrigger, BooleanStatusIcon, LogoCell, CompletedChart, LanguageFlag }
