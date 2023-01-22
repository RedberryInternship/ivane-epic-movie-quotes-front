import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'
import { RootState, SetStateString } from 'types'
import { gandalfProfile } from 'public'
import { useAuth } from 'hooks'

export const useUserPageMainLayout = () => {
  const { t } = useTranslation()
  const { locale } = useRouter()
  useAuth()

  const [currentUserImageUrl, setCurrentImageUrl] =
    useState<SetStateString>(null)
  const [userName, setUserName] = useState<SetStateString>(null)
  const [isActiveDropdown, setIsActiveDropdown] = useState(false)

  const userInformation = useSelector((state: RootState) => state.userData)

  const dropdownSwitcher = () => {
    if (!isActiveDropdown) {
      setIsActiveDropdown(true)
    } else {
      setIsActiveDropdown(false)
    }
  }
  const closeDropdownOnBlur = () => {
    if (isActiveDropdown) {
      setIsActiveDropdown(false)
    }
  }
  useEffect(() => {
    userInformation.user_image
      ? setCurrentImageUrl(userInformation.user_image)
      : setCurrentImageUrl(gandalfProfile)
    userInformation.name && setUserName(userInformation.name)
  }, [userInformation])

  return {
    t,
    locale,
    isActiveDropdown,
    dropdownSwitcher,
    closeDropdownOnBlur,
    currentUserImageUrl,
    userName,
  }
}
