import React, { useEffect, useRef, useState } from 'react'
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const texts = {
    tariffsChange: 'To change tariffs you need to activate appropriate wallet and sign the transaction.',
}

export const WalletWrapper = ({ children }) => (
    <ConnectionProvider endpoint={import.meta.env.VITE_ANCHOR_PROVIDER_URL}>
        <WalletProvider wallets={[]} autoConnect={true}>
            <WalletModalProvider>
                {children}
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
)

export const WalletForm = ({operation, error, expectedPublicKey, waitingSignature}) => {
    const wallet = useWallet()
    const walletRef = useRef(wallet)
    const [walletPublicKey, setWalletPublicKey] = useState(wallet.publicKey?.toString())

    useEffect(() => {
      walletRef.current = wallet
    })

    useEffect(() => {
      setWalletPublicKey(wallet.publicKey?.toString())
    }, [wallet.connected, wallet.publicKey?.toString()])

    return (
        <div className="bg-light alert border text-center">
            <h4>Wallet</h4>
            <h6 className="lh-base mb-3">{texts[operation]}</h6>
            <PublicKeyText publicKey={walletPublicKey} expectedPublicKey={expectedPublicKey} />
            <SignatureText waitingSignature={waitingSignature} />
            <ErrorText error={error} />
            <div className="d-flex justify-content-center gap-2" style={{zIndex: 1000}}>
                <WalletMultiButton />
            </div>
        </div>
    )
}

const PublicKeyText = ({publicKey, expectedPublicKey}) => {
    if (!publicKey) return (
        <p className="text-danger">Wallet is not connected.</p>
    )

    if (expectedPublicKey && publicKey !== expectedPublicKey) return (
        <div className="text-danger">
            <p className="fw-semibold">{publicKey}</p>
            <div className="alert-danger alert text-center text-break pt-4">
                <h6>This wallet address does not match the token owner's public address.</h6>
                <h5 className="p-2">Expected wallet:</h5>
                <span className="text-primary fw-semibold ms-2">{expectedPublicKey}</span>
            </div>
        </div>
    )

    return (
        <p className="text-success fw-semibold">{publicKey}</p>
    )
}

const SignatureText = ({waitingSignature}) => waitingSignature && (
    <p className="text-danger">Waiting wallet signature</p>
)

const ErrorText = ({error}) => !!error && (
    <p className="text-danger">{error.message || error}</p>
)
