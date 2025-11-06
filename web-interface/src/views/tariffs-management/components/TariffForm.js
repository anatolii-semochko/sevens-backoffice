import React, {useEffect, useState} from 'react'
import TokenManagementApi from '@js/api/tokenManagementApi'
import { Transaction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { deserializeTransaction, serializeTransaction } from '@js/components/utils/Blockchain'
import { $Usd, getFloat } from '@js/components/utils/Currency'
import { WalletForm, WalletWrapper } from '@js/components/input-fields/WalletForm'
import { SecureFormInput } from 'src/components/input-fields/SecureFormInput'
import { ErrorMessageBlock } from '@js/components/utils/Messages'
import { CButton, CCol, CFormInput, CFormLabel, CFormSwitch, CModal, CModalBody, CModalHeader, CRow, CModalTitle } from '@coreui/react'

const tokenManagementApi = new TokenManagementApi()

const EditTariffForm = ({ onSuccess, onClose, initialData, setPaused }) => {
  const wallet = useWallet()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [waitingSignature, setWaitingSignature] = useState(false)
  const [formData, setFormData] = useState({
    authority:  initialData?.authority || '',
    targetWallet: initialData?.targetWallet || '',
    mint: initialData?.mint || '',
    setSale: initialData?.setSale || '',
    buy: initialData?.buy || '',
    burn: initialData?.burn || '',
    paused: initialData?.paused || false,
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

      const transactionData = await tokenManagementApi.getTariffTransaction({
        authorityPublicKey: wallet.publicKey.toString(),
        targetWallet: formData.targetWallet,
        mint,
        setSale,
        buy,
        burn,
        paused: formData.paused,
      })

      setWaitingSignature(true)
      const txSignature = await wallet.signTransaction(
        Transaction.from(deserializeTransaction(transactionData.transaction))
      )
      setWaitingSignature(false)

      setSubmitting(true)
      await tokenManagementApi.postTariffTransaction({
        targetWallet: formData.targetWallet,
        mint,
        setSale,
        buy,
        burn,
        paused: formData.paused,
        transactionId: transactionData.transactionId,
        txSignature: serializeTransaction(txSignature),
      })

      window.toast.success('Tariffs updated successfully')
      onSuccess()
      onClose()
    } catch (error) {
      setError(error)
    } finally {
      setSubmitting(false)
      setWaitingSignature(false)
    }
  }

  useEffect(() => {setError(null)}, [wallet.publicKey?.toString()])

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
            min="0"
          />
        </CCol>
        <CCol md={7}>
          <$Usd sevens={formData.mint} label color />
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
            min="0"
          />
        </CCol>
        <CCol md={7}>
          <$Usd sevens={formData.setSale} label color />
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
            min="0"
          />
        </CCol>
        <CCol md={7}>
          <$Usd sevens={formData.burn} label color />
        </CCol>
      </CRow>

      {/* Target Wallet */}
      <CRow className="mb-1 align-items-center">
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

      {/* Paused Switch */}
      <CRow className="mb-3 align-items-center">
        <CCol md={3}>
          <CFormLabel className="mb-0">Operations Status</CFormLabel>
        </CCol>
        <CCol md={9}>
          <CFormSwitch
            id="pausedSwitch"
            label={!formData.paused ? 'Active' : 'Paused (Emergency Stop Active)'}
            checked={!formData.paused}
            onChange={(e) => {
              handleChange('paused', !e.target.checked)
              setPaused(!e.target.checked)
            }}
          />
        </CCol>
      </CRow>

      {formData.paused && (
        <h4 className="text-center text-danger mb-4">All token operations (mint, buy, sell, burn) are blocked</h4>
      )}

      <div className="mb-3">
        <WalletForm
          operation="tariffsChange"
          waitingSignature={waitingSignature}
          expectedPublicKey={formData.authority}
        />
      </div>

      {error && (
        <ErrorMessageBlock message={error} />
      )}

      <div className="d-grid gap-2">
        <CButton type="submit" color="primary" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Tariffs'}
        </CButton>
      </div>
    </form>
  )
}

export const EditTariffModal = ({ visible, onClose, onSuccess, initialData }) => {
  const [paused, setPaused] = useState(initialData?.paused)
  useEffect(() => {setPaused(initialData?.paused)}, [initialData])

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Edit Tariffs</CModalTitle>
      </CModalHeader>
      <CModalBody className={paused ? 'bg-danger-subtle' : ''}>
        <WalletWrapper>
          <EditTariffForm onSuccess={onSuccess} onClose={onClose} initialData={initialData} setPaused={setPaused} />
        </WalletWrapper>
      </CModalBody>
    </CModal>
  )
}
