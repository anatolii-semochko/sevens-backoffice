import React, { useState } from 'react'
import { Transaction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { deserializeTransaction, serializeTransaction } from '@js/components/utils/Blockchain'
import { fetchError, getTariffTransaction, postTariffTransaction } from '@js/api/tariff-history'
import { CButton, CCol, CFormInput, CFormLabel, CModal, CModalBody, CModalHeader, CRow, CModalTitle } from '@coreui/react'
import { WalletForm, WalletWrapper } from '@js/components/input-fields/WalletForm'
import { SecureFormInput } from 'src/components/input-fields/SecureFormInput'
import { formattedSevensToUsd, getFloat } from '@js/components/utils/Currency'

const EditTariffForm = ({ onSuccess, onClose, initialData }) => {
  const wallet = useWallet()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [waitingSignature, setWaitingSignature] = useState(false)
  const [formData, setFormData] = useState({
    targetWallet: initialData?.targetWallet || '',
    mint: initialData?.mint || '',
    setSale: initialData?.setSale || '',
    buy: initialData?.buy || '',
    burn: initialData?.burn || '',
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const validateForm = () => {
    if (!formData.targetWallet || formData.targetWallet.length < 32) {
      throw new Error('Invalid target wallet address')
    }

    const mint = getFloat(formData.mint)
    const setSale = getFloat(formData.setSale)
    const buy = getFloat(formData.buy)
    const burn = getFloat(formData.burn)

    if (isNaN(mint) || mint < 0) {
      throw new Error('Mint fee must be a valid number (0 or greater)')
    }
    if (isNaN(setSale) || setSale < 0) {
      throw new Error('Set Sale fee must be a valid number (0 or greater)')
    }
    if (isNaN(buy) || buy < 0 || buy >= 100) {
      throw new Error('Sale fee must be between 0 and 99')
    }
    if (isNaN(burn) || burn < 0) {
      throw new Error('Burn fee must be a valid number (0 or greater)')
    }

    return { mint, setSale, buy, burn }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!wallet.publicKey?.toString()) {
      setError({ message: 'Wallet is not activated.' })
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const { mint, setSale, buy, burn } = validateForm()

      const transactionData = await getTariffTransaction({
        authorityPublicKey: wallet.publicKey.toString(),
        targetWallet: formData.targetWallet,
        mint,
        setSale,
        buy,
        burn,
      })

      setWaitingSignature(true)
      const txSignature = await wallet.signTransaction(
        Transaction.from(deserializeTransaction(transactionData.transaction))
      )
      setWaitingSignature(false)

      setSubmitting(true)
      await postTariffTransaction({
        targetWallet: formData.targetWallet,
        mint,
        setSale,
        buy,
        burn,
        transactionId: transactionData.transactionId,
        txSignature: serializeTransaction(txSignature),
      })

      window.toast.success('Tariffs updated successfully')
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Failed to update tariffs:', err)
      setError({ message: fetchError(err) })
    } finally {
      setSubmitting(false)
      setWaitingSignature(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* Sale Fee (%) */}
      <CRow className="mb-3 align-items-center">
        <CCol md={2}>
          <CFormLabel className="mb-0">Sale Fee</CFormLabel>
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="number"
            value={formData.buy}
            onChange={(e) => handleChange('buy', e.target.value)}
            placeholder="0"
            min="0"
            max="99"
          />
        </CCol>
        <CCol md={7}>
          <small className="text-muted">Percentage: 0-99</small>
        </CCol>
      </CRow>

      {/* Mint Fee */}
      <CRow className="mb-3 align-items-center">
        <CCol md={2}>
          <CFormLabel className="mb-0">Mint Fee:</CFormLabel>
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="number"
            step="0.000000001"
            value={formData.mint}
            onChange={(e) => handleChange('mint', e.target.value)}
            placeholder="0"
            min="0"
          />
        </CCol>
        <CCol md={7}>
          <span className="text-dark-red">
            {formData.mint ? `${formattedSevensToUsd(formData.mint)} USD` : '0.00 USD'}
          </span>
        </CCol>
      </CRow>

      {/* Set Sale Fee */}
      <CRow className="mb-3 align-items-center">
        <CCol md={2}>
          <CFormLabel className="mb-0">Set Sale Fee:</CFormLabel>
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="number"
            step="0.000000001"
            value={formData.setSale}
            onChange={(e) => handleChange('setSale', e.target.value)}
            placeholder="0"
            min="0"
          />
        </CCol>
        <CCol md={7}>
          <span className="text-dark-red">
            {formData.setSale ? `${formattedSevensToUsd(formData.setSale)} USD` : '0.00 USD'}
          </span>
        </CCol>
      </CRow>

      {/* Burn Fee */}
      <CRow className="mb-3 align-items-center">
        <CCol md={2}>
          <CFormLabel className="mb-0">Burn Fee:</CFormLabel>
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="number"
            step="0.000000001"
            value={formData.burn}
            onChange={(e) => handleChange('burn', e.target.value)}
            placeholder="0"
            min="0"
          />
        </CCol>
        <CCol md={7}>
          <span className="text-dark-red">
            {formData.burn ? `${formattedSevensToUsd(formData.burn)} USD` : '0.00 USD'}
          </span>
        </CCol>
      </CRow>

      {/* Target Wallet */}
      <CRow className="mb-3 align-items-center">
        <CCol md={2}>
          <CFormLabel className="mb-3">Target Wallet</CFormLabel>
        </CCol>
        <CCol md={10}>
          <SecureFormInput
            type="text"
            value={formData.targetWallet}
            onChange={(e) => handleChange('targetWallet', e.target.value)}
            placeholder="Enter Solana wallet address"
            required
          />
        </CCol>
      </CRow>

      <div className="mb-3">
        <WalletForm
          operation="tariffsChange"
          error={error}
          waitingSignature={waitingSignature}
        />
      </div>

      <div className="d-grid gap-2">
        <CButton type="submit" color="primary" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Tariffs'}
        </CButton>
      </div>
    </form>
  )
}

export const EditTariffModal = ({ visible, onClose, onSuccess, initialData }) => {
  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Edit Tariffs</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <WalletWrapper>
          <EditTariffForm onSuccess={onSuccess} onClose={onClose} initialData={initialData} />
        </WalletWrapper>
      </CModalBody>
    </CModal>
  )
}
