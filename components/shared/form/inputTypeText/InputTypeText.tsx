import { Approve, ErrorSvg, Hide, Show } from 'components'
import { useForm } from './useForm'
import { InputTypeTextProps } from './types'
import React from 'react'

const InputTypeText: React.FC<InputTypeTextProps> = (props) => {
  const {
    locale,
    setValue,
    inputReference,
    register,
    changePasswordType,
    isUndefinedError,
    setUndefinedError,
  } = useForm()

  return (
    <div>
      <div className='flex justify-center'>
        <div className='w-r19 nm:w-r22 sm:w-r24'>
          <label
            htmlFor={props.id}
            className={`block font-normal text-base text-white mt-6
        ${locale === 'en' ? 'font-helveticaEn' : 'font-helveticaKa'}`}
          >
            {props.labelContent} <span className='text-redStar'>*</span>
          </label>
        </div>
      </div>
      <div className='flex flex-row items-center justify-center h-14'>
        {(props.name === 'password' || props.name === 'confirm_password') &&
          props.isTypePassword && (
            <div
              className='absolute flex justify-center items-center mt-2 ml-60 nm:ml-r18 sm:ml-0 sm:right-r085 cursor-pointer'
              onClick={() =>
                changePasswordType(
                  props.isTypePassword!,
                  props.setIsTypePassword!
                )
              }
            >
              <Hide />
            </div>
          )}
        {(props.name === 'password' || props.name === 'confirm_password') &&
          !props.isTypePassword && (
            <div
              className='absolute flex justify-center items-center mt-2 ml-60 nm:ml-r18 sm:ml-0 sm:right-r085 cursor-pointer'
              onClick={() =>
                changePasswordType(
                  props.isTypePassword!,
                  props.setIsTypePassword!
                )
              }
            >
              <Show />
            </div>
          )}

        {!props.error && !isUndefinedError && (
          <div className='absolute flex justify-center items-center mt-2 ml-r1705 nm:ml-r2005 sm:ml-0 sm:right-28'>
            <Approve />
          </div>
        )}

        {((props.error && !isUndefinedError) ||
          (props.error && isUndefinedError)) && (
          <div className='absolute flex justify-center items-center mt-2 ml-r1705 nm:ml-r2005 sm:ml-0 sm:right-28'>
            <ErrorSvg />
          </div>
        )}

        <input
          {...register(props.name, {
            ...props.errors,
            onChange: (e) => {
              e.target.value = e.target.value.trim()
              setUndefinedError(false)
              setValue(props.name, e.target.value.trim(), {
                shouldValidate: true,
              })
            },
          })}
          id={props.id}
          placeholder={props.placeholder}
          type={`${
            (props.name === 'password' && props.isTypePassword) ||
            (props.name === 'confirm_password' && props.isTypePassword)
              ? 'password'
              : 'text'
          }`}
          className={`font-helveticaKa placeholder-gray-500 placeholder-4 placeholder-base border-2 ${
            !props.error && isUndefinedError
              ? 'border-borderGray'
              : (props.error && !isUndefinedError) ||
                (props.error && isUndefinedError)
              ? 'border-borderRed'
              : 'border-borderGreen'
          }
          font-normal rounded text-base bg-inputGray pl-4 mt-2 w-r19 nm:w-r22 sm:w-r24 h-r027 outline-none pr-11 sm:pr-0`}
          ref={inputReference}
        />
      </div>
    </div>
  )
}

export default InputTypeText