import React, { useEffect, useRef, useState } from 'react'
import { openWallet } from '@js/wallet'
import { SevensWalletAdapter } from '@wallet/SevensWalletAdapter'
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider} from '@solana/wallet-adapter-react-ui'

export const wallets = [
    new SevensWalletAdapter()
]

const texts = {
    tariffsChange: 'To change tariffs you need to activate appropriate wallet and sign the transaction.',
}

export const WalletWrapper = ({ children }) => (
    <ConnectionProvider endpoint={import.meta.env.VITE_ANCHOR_PROVIDER_URL}>
        <WalletProvider wallets={wallets} autoConnect={true}>
            <WalletModalProvider>
                {children}
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
)

export const WalletForm = ({operation, error, expectedPublicKey, waitingSignature}) => {
    const wallet = useWallet()
    const walletRef = useRef(wallet)
    const retryIntervalRef = useRef(null)
    const [walletOpened, setWalletOpened] = useState(false)

    useEffect(() => {
        walletRef.current = wallet
    })

    useEffect(() => {
        openWallet()
        walletPanelState(setWalletOpened)
        walletInitialization(wallet, walletRef, retryIntervalRef, setWalletOpened)
    }, [])

    useEffect(() => {
        walletAutoConnection(wallet)
    }, [wallet.wallet, wallet.connected])

    return (
        <div className="alert-success bg-light alert border text-center">
            <h4>Wallet</h4>
            <h6 className="lh-base mb-3">{texts[operation]}</h6>
            <PublicKeyText {...{wallet, expectedPublicKey}} />
            <SignatureText waitingSignature={waitingSignature} />
            <ErrorText error={error} />
            <div className="d-flex justify-content-center gap-2">
                {!walletOpened && (
                    <button className="btn btn-primary w-100" onClick={openWallet}>
                        Open Wallet
                    </button>
                )}
                {/*<WalletMultiButton />*/}
            </div>
        </div>
    )
}

const PublicKeyText = ({wallet, expectedPublicKey}) => {
    const publicKey = wallet.publicKey?.toString()

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

// Ініціалізація: вибираємо адаптер, підписуємося на події
const walletInitialization = (wallet, walletRef, retryIntervalRef) => {
    openWallet()

    const selectSevensWallet = () => {
        if (!walletRef.current.wallet) {
            try {
                wallet.select('Sevens Wallet')
            } catch (error) {
                console.error('Failed to select Sevens Wallet:', error)
            }
        }
    }

    // Вибираємо гаманець з retry (на випадок якщо адаптер ще не готовий)
    selectSevensWallet()
    setTimeout(selectSevensWallet, 100)
    setTimeout(selectSevensWallet, 300)

    // Обробник подій від SevensWallet (активація/зміна акаунту)
    const handleSevensWalletEvent = () => {
        const currentWallet = walletRef.current
        if (!currentWallet.wallet) {
            try {
                currentWallet.select('Sevens Wallet')
            } catch (error) {
                console.error('Failed to select in event handler:', error)
            }
        }
    }

    // Підписка на події від window.sevens з retry механізмом
    let retryCount = 0
    const maxRetries = 20

    const trySubscribe = () => {
        const sevensWallet = window.sevens || window.solana

        if (sevensWallet?.isSevens) {
            sevensWallet.on('accountChanged', handleSevensWalletEvent)
            sevensWallet.on('connect', handleSevensWalletEvent)

            // Якщо гаманець вже підключений при монтуванні, синхронізуємо
            if (sevensWallet.isConnected && sevensWallet.publicKey && wallet.wallet && !wallet.connected) {
                setTimeout(() => {
                    wallet.connect().catch(err => {
                        console.error('Initial sync failed:', err)
                    })
                }, 100)
            }

            if (retryIntervalRef.current) {
                clearInterval(retryIntervalRef.current)
                retryIntervalRef.current = null
            }
            return true
        } else {
            retryCount++
            if (retryCount >= maxRetries) {
                console.error('SevensWallet not found after', maxRetries, 'retries')
                if (retryIntervalRef.current) {
                    clearInterval(retryIntervalRef.current)
                    retryIntervalRef.current = null
                }
            }
            return false
        }
    }

    if (!trySubscribe()) {
        retryIntervalRef.current = setInterval(trySubscribe, 200)
    }

    return () => {
        if (retryIntervalRef.current) {
            clearInterval(retryIntervalRef.current)
            retryIntervalRef.current = null
        }

        const sevensWallet = window.sevens || window.solana
        if (sevensWallet?.isSevens) {
            sevensWallet.off('accountChanged', handleSevensWalletEvent)
            sevensWallet.off('connect', handleSevensWalletEvent)
        }
    }
}

// Автоматичне підключення коли Sevens Wallet вибраний і активований
const walletAutoConnection = (wallet) => {
    const walletName = wallet.wallet?.adapter?.name

    if (!wallet.wallet || wallet.connected || walletName !== 'Sevens Wallet') {
        return
    }

    const sevensWallet = window.sevens || window.solana

    // Підключаємося якщо window.sevens вже активований
    if (sevensWallet?.isConnected && sevensWallet?.publicKey) {
        wallet.connect().catch(err => {
            console.error('Auto-connect failed:', err)
        })
        return
    }

    // Якщо ще не активований, чекаємо на події
    const handleSevensConnect = (publicKey) => {
        if (!wallet.connected && publicKey) {
            wallet.connect().catch(err => {
                console.error('Auto-connect failed:', err)
            })
        }
    }

    if (sevensWallet?.isSevens) {
        sevensWallet.on('connect', handleSevensConnect)
        sevensWallet.on('accountChanged', handleSevensConnect)

        return () => {
            sevensWallet.off('connect', handleSevensConnect)
            sevensWallet.off('accountChanged', handleSevensConnect)
        }
    }
}

const walletPanelState = (setWalletOpened) => {
    const walletPanel = document.getElementById('wallet-panel')
    if (!walletPanel) return

    // Перевіряємо початковий стан
    setWalletOpened(walletPanel.classList.contains('open'))

    // Спостерігаємо за змінами класів панелі
    const observer = new MutationObserver(() => {
        setWalletOpened(walletPanel.classList.contains('open'))
    })

    observer.observe(walletPanel, {
        attributes: true,
        attributeFilter: ['class']
    })

    return () => observer.disconnect()
}
