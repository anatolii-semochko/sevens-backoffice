import { fetchCurrentTariffs } from 'src/api/tariffs'
import { Connection } from '@solana/web3.js'

export const testBlockchainStatus = async () => {
  const url = import.meta.env.VITE_ANCHOR_PROVIDER_URL
  if (!url) {
    throw new Error('VITE_ANCHOR_PROVIDER_URL is not defined')
  }

  const connection = new Connection(url, 'confirmed')

  try {
    const version = await connection.getVersion()
    if (!version || !version['solana-core']) {
      throw new Error('Invalid blockchain response')
    }
  } catch (error) {
    throw new Error(`Blockchain is not active: ${error.message}`)
  }
}

export const testSevensTokenIdl = async () => {
  const url = import.meta.env.VITE_MAIN_SITE_URL + '/storage/files/sevens_token.json'
  const address = 'Ah4sw8i5k74TC7tCzSrqkEitNdQVRhgrPsKfUrhqzEbn'

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const idl = await response.json()
  if (!idl.metadata?.address) {
    throw new Error('No metadata address')
  }
  if (idl.metadata.address !== address) {
    throw new Error('Metadata address is wrong: ' + idl.metadata.address)
  }
}

export const testTokenManageIdl = async () => {
  const url = import.meta.env.VITE_MAIN_SITE_URL + '/storage/files/sevens_token_management.json'
  const address = 'DLNR4oQQajCa6UyATqUzpqJgguUCkg3hShZPTMsVKq3h'

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const idl = await response.json()
  if (!idl.metadata?.address) {
    throw new Error('No metadata address')
  }
  if (idl.metadata.address !== address) {
    throw new Error('Metadata address is wrong: ' + idl.metadata.address)
  }
}

export const testTokenManagePda = async () => {
  const tariffs = await fetchCurrentTariffs()
  if (!tariffs.authority) {
    throw new Error('Authority is not set')
  }
  if (tariffs.paused) {
    throw new Error('Token operations are blocked !!!')
  }
}

export const testGetMintTransaction = async () => {

}
