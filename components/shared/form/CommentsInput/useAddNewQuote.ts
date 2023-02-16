import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FormObj, RootState } from 'types'
import { gandalfProfile } from 'public'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { storeUserComment } from 'services'

export const useAddNewQuote = () => {
  const { locale, query } = useRouter()
  const { movie, stage, quote } = query
  const { t } = useTranslation()

  const { mutate: submitForm } = useMutation(storeUserComment)
  const queryClient = useQueryClient()

  const [currentUserImageUrl, setCurrentImageUrl] = useState('')

  const userInformation = useSelector((state: RootState) => state.userData)

  const form = useForm({
    defaultValues: {
      comment: '',
    },
    mode: 'all',
  })
  const { errors, isDirty } = form.formState

  const storeComment = (data: FormObj) => {
    data['quote_id'] = quote as string

    form.resetField('comment')

    submitForm(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries('quote')
      },
    })
  }

  useEffect(() => {
    userInformation.user_image
      ? setCurrentImageUrl(userInformation.user_image)
      : setCurrentImageUrl(gandalfProfile.src)
  }, [userInformation, isDirty])

  return {
    locale,
    t,
    currentUserImageUrl,
    form,
    errors,
    register: form.register,
    storeComment,
    handleSubmit: form.handleSubmit,
    stage,
    movie,
  }
}
