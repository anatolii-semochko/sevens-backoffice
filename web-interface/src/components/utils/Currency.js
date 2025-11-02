import store from '@js/store'

export const getFloat = (value) => value === '' || value === null || value === undefined ? 0 : parseFloat(value)

export const formattedSevens = (sevens) => {
  if (!sevens || sevens === 0) return '0'
  return parseFloat(parseFloat(sevens).toFixed(9)).toString()
}

export const formattedSevensToUsd = (sevens) => {
  if (!sevens || sevens === 0) return '0.00'
  const usdRate = store.getState().sevensUsdRate || 1
  return (parseFloat(sevens) / usdRate).toFixed(2)
}

export const FormattedSevens = ({sevens, showUsd}) => {
  const TextUsd = () => showUsd && (
    <span className="text-dark-red"> - {formattedSevensToUsd(sevens)} USD</span>
  )

  return (
    <span className="text-primary">
      {formattedSevens(sevens)} <span className="fst-italic">$SEV</span>
      <TextUsd />
    </span>
  )
}
