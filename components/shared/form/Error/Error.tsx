import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/router'
import { ErrorProps } from './types'
import React from 'react'

const Error: React.FC<ErrorProps> = (props) => {
  const { locale } = useRouter()
  return (
    <ErrorMessage
      errors={props.errors}
      name={props.name}
      render={({ message }) => (
        <div className='flex justify-center'>
          <div className='w-r19 nm:w-r22 sm:w-r24'>
            <p
              className={`absolute mt-1 text-sm font-light text-redStar ${
                locale === 'en' ? 'font-helveticaEn' : 'font-helveticaKa'
              }`}
            >
              {message}
            </p>
          </div>
        </div>
      )}
    />
  )
}

export default Error
