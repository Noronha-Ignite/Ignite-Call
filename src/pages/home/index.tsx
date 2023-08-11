import { Heading, Text } from '@ignite-ui/react'

import PreviewImg from '../../assets/app-preview.png'

import * as S from './styles'
import Image from 'next/image'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'

export default function Home() {
  return (
    <S.Container>
      <S.Hero>
        <Heading size="4xl">Agendamento descomplicado</Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUsernameForm />
      </S.Hero>
      <S.Preview>
        <Image
          src={PreviewImg}
          alt="Calendário simbolizando aplicação em funcionamento"
          height={400}
          quality={100}
          priority
        />
      </S.Preview>
    </S.Container>
  )
}
