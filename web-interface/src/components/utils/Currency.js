import store from '@js/store'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export const formattedSevens = (lamports) => {
  if (!lamports) return '0'
  const sevens = parseInt(lamports) / LAMPORTS_PER_SOL
  return parseFloat(sevens.toFixed(9)).toString()
}

export const formattedSevensToUsd = (lamports) => {
  if (!lamports) return '0.00'
  const sevens = parseInt(lamports) / LAMPORTS_PER_SOL
  const usdRate = store.getState().sevensUsdRate || 1
  return (sevens / usdRate).toFixed(2)
}

export const FormattedSevens = ({lamports, showLamports, showUsd}) => {
  const TextLamports = () => showLamports && (
    <span className="text-muted fw-normal"> ({lamports || 0} lamports)</span>
  )

  const TextUsd = () => showUsd && (
    <span className="text-dark-red"> - {formattedSevensToUsd(lamports)} USD</span>
  )

  return (
    <span className="text-primary">
      {formattedSevens(lamports)} <span className="fst-italic">$SEV</span>
      <TextLamports/>
      <TextUsd />
    </span>
  )
}
