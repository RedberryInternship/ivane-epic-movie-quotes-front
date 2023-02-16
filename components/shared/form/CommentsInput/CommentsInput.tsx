import { useAddNewQuote } from './useAddNewQuote'
import React from 'react'
import Image from 'next/image'
import { FormProvider } from 'react-hook-form'

const CommentsInput = () => {
  const { t, currentUserImageUrl, form, register, handleSubmit, storeComment } =
    useAddNewQuote()
  return (
    <>
      <FormProvider {...form}>
        <form
          className={`w-r19 nm:w-[22.375rem] sm:w-r55 mt-8 flex items-center mb-10 justify-between sm:justify-start`}
          onSubmit={handleSubmit(storeComment)}
        >
          {currentUserImageUrl && (
            <Image
              priority={true}
              unoptimized={true}
              className='w-[3.25rem] h-[3.25rem] rounded-full object-fill mr-6'
              height={100}
              width={100}
              loader={() => currentUserImageUrl}
              src={currentUserImageUrl}
              alt={'user image'}
            />
          )}
          <input
            type='text'
            id='comment'
            {...register('comment', {
              required: t('errors:fieldIsRequired')!,
            })}
            placeholder={t('movies:writeAComment')!}
            className={`font-helveticaKa placeholder-borderGraySoft text-white placeholder-4 placeholder-base movies-input
           border-0
          font-normal rounded-xl text-lg bg-deleteOrEdit pl-6 w-[15rem] nm:w-[17.125rem] sm:w-[50.875rem] h-10 sm:h-[3.25rem] outline-none pr-16`}
          ></input>
        </form>
      </FormProvider>
    </>
  )
}

export default CommentsInput