import { GetServerSideProps } from 'next'
import Home from '../[[...parts]]'

export const getServerSideProps: GetServerSideProps<React.ComponentProps<
  typeof Home
>> = async () => {
  return { props: { namespace: 'liferay' } }
}

export default Home
