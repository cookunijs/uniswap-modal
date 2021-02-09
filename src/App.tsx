import React, { Suspense } from 'react'
import styled from 'styled-components'

import AddressClaimModal from './components/claim/AddressClaimModal'
import URLWarning from './components/Header/URLWarning'
import Popups from './components/Popups'
import Web3ReactManager from './components/Web3ReactManager'
import { ApplicationModal } from './state/application/actions'
import { useModalOpen, useToggleModal } from './state/application/hooks'
import Swap from './pages/Swap'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
  const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
  return <AddressClaimModal isOpen={open} onDismiss={toggle} />
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <AppWrapper>
        <URLWarning />
        <BodyWrapper>
          <Popups />
          <TopLevelModals />
          <Web3ReactManager>
            <Swap />
          </Web3ReactManager>
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}
