import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilReload } from '@coreui/icons'
import { CButton, CCard, CCardBody, CCardFooter, CCol, CProgress, CRow } from '@coreui/react'
import {
  testBlockchainStatus,
  testGetMintTransaction,
  testSevensTokenIdl,
  testTokenManageIdl,
  testTokenManagePda,
} from '@js/components/functionsl-tests/functional-tests'

export const FunctionalTests = () => {
  const tests = [
    ['Blockchain status', testBlockchainStatus],
    ['Sevens token IDL', testSevensTokenIdl],
    ['Token management IDL', testTokenManageIdl],
    ['Token management PDA', testTokenManagePda],
    ['Mint token transaction', testGetMintTransaction],
  ]

  const [testResults, setTestResults] = useState({})
  const [currentTestIndex, setCurrentTestIndex] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    runTests().catch()
  }, [])

  const runTests = async () => {
    setCurrentTestIndex(-1)
    setIsRunning(true)

    for (let i = 0; i < tests.length; i++) {
      const [testName, testFunction] = tests[i]
      setCurrentTestIndex(i)

      try {
        await testFunction()
        setTestResults(prev => ({
          ...prev,
          [i]: { success: true, error: null }
        }))
      } catch (error) {
        setTestResults(prev => ({
          ...prev,
          [i]: { success: false, error: error.message || String(error) }
        }))
      }
    }

    setIsRunning(false)
    setCurrentTestIndex(tests.length)
  }

  const progress = tests.length > 0 ? ((currentTestIndex + 1) / tests.length) * 100 : 0

  return (
    <CCard className="mb-4">
      <CCardBody>
        <CRow>
          <CCol sm={6}>
            <h4 id="traffic" className="card-title mb-3">Functional Tests</h4>
          </CCol>
          <CCol sm={6}>
            <CButton color="primary" className="float-end">
              <CIcon icon={cilReload} onClick={runTests} />
            </CButton>
          </CCol>
        </CRow>
        {tests.map((test, key) => (
          <div key={key}>
            <TestView
              test={test}
              result={testResults[key]}
              isRunning={currentTestIndex === key}
            />
          </div>
        ))}
      </CCardBody>
      <CCardFooter>
        <CRow className="mb-2">
          <CCol>
            <CProgress thin className="mt-2" color={'success'} value={progress} />
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>
  )
}

const TestView = ({ test, result, isRunning }) => {
  const [testName] = test

  const renderResult = () => {
    if (isRunning) {
      return <span className={'text-info fw-bold'}>Running...</span>
    }
    if (!result) {
      return <span className={'text-secondary'}>Pending...</span>
    }
    if (result.success) {
      return <ResultOk />
    }
    return <ResultError error={result.error} />
  }

  return (
    <CRow className="mb-2">
      <CCol>{testName} - {renderResult()}</CCol>
    </CRow>
  )
}

const ResultOk = () => <span className={'text-success fw-bold ms-2'}>OK</span>

const ResultError = ({ error }) => <span className={'text-danger fw-bold'}>ERROR: {error}</span>
