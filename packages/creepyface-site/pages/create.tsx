import { GetStaticProps } from 'next'
import Home from '.'

export const getStaticProps: GetStaticProps<React.ComponentProps<
  typeof Home
>> = async () => ({ props: { create: true } })

export default Home
