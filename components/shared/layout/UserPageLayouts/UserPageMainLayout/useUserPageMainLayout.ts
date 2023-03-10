import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'
import {
  BroadcastData,
  NewsFeedNotification,
  ReactDivMouseEvent,
  RootState,
  SetState,
} from 'types'
import { gandalfProfile } from 'public'
import { useAuth } from 'hooks'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { useMutation, useQuery } from 'react-query'
import {
  getBroadcast,
  getNotifications,
  logOut,
  removeNotifications,
} from 'services'
import { deleteCookie, getCookie } from 'cookies-next'

export const useUserPageMainLayout = (
  setIsSetBackground?: SetState<boolean>,
  setIsSearchMobileOpen?: SetState<boolean>,
  setIsSearchOpen?: SetState<boolean>,
  setIsWriteNewQuoteModalOpen?: SetState<boolean>
) => {
  const { t } = useTranslation()
  const { locale, query, push, asPath, pathname } = useRouter()
  const { stage, movie, quote, edit } = query
  useAuth()

  const { mutate: submitForm } = useMutation(logOut)
  const { mutate: authorizeBroadcast } = useMutation(getBroadcast)

  const [currentUserImageUrl, setCurrentImageUrl] = useState('')
  const [userName, setUserName] = useState('')
  const [isActiveDropdown, setIsActiveDropdown] = useState(false)
  const [notifications, setNotifications] = useState<NewsFeedNotification[]>([])
  const [notificationsQuantity, setNotificationsQuantity] = useState(0)
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false)
  const [newNotifications, setNewNotifications] = useState<
    NewsFeedNotification[]
  >([])

  const [isFirstRender, setIsFirstRender] = useState(true)
  const [isNewGlobal, setIsNewGlobal] = useState(true)
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)

  const [page, setPage] = useState(0)

  const [hasMoreItems, setHasMoreItems] = useState(true)

  const [isNotificationsRemoved, setIsNotificationsRemoved] = useState(false)

  const userInformation = useSelector((state: RootState) => state.userData)

  useQuery('removedNotifications', removeNotifications, {
    onSuccess: () => {
      setIsNotificationsRemoved(false)
      setNotificationsQuantity(0)
      setIsNewGlobal(false)
      setNewNotifications([])
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0,
    enabled: isNotificationsRemoved,
  })

  const logOutUser = () => {
    submitForm(true, {
      onSuccess: () => {
        getCookie('userInfo') && deleteCookie('userInfo')
        getCookie('XSRF-TOKEN') && deleteCookie('XSRF-TOKEN')
        localStorage.removeItem('userInfo')
        push(`/`)
      },
    })
  }

  useEffect(() => {
    let echo: Echo
    ;(() => {
      window.pusher = Pusher

      echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.NEXT_PUBLIC_PUSHER_KEY,
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
        authorizer: (channel: any) => {
          return {
            authorize: (socketId: string, callback: Function) => {
              const data: BroadcastData = {}
              data['socket_id'] = socketId
              data['channel_name'] = channel.name
              data['callback'] = callback
              authorizeBroadcast(data, {
                onSuccess: (response) => {
                  callback(false, response?.data)
                },
                onError: (error) => {
                  callback(true, error)
                },
              })
            },
          }
        },
      })

      echo
        .private(`notifications.` + userInformation.id)
        .listen(`NotificationStored`, async (e: any) => {
          setNotifications((prev) => [e.notification, ...prev])
          setNewNotifications((prev) => [e.notification, ...prev])
          setNotificationsQuantity((prev) => prev + 1)
        })
    })()
    return () => {
      echo?.disconnect()
    }
  }, [userInformation, authorizeBroadcast])

  useQuery(['notifications', page], () => getNotifications(page), {
    onSuccess: (response) => {
      const data: NewsFeedNotification[] = response?.data[0]

      if (page === 0) {
        setNotificationsQuantity(response?.data[1])
      }
      setNotifications((prev) => [...prev, ...data])

      if (data.length === 0) {
        setHasMoreItems(false)
      }
    },
    refetchOnWindowFocus: false,
  })

  const openMobileMenu = (e: ReactDivMouseEvent) => {
    if (e && e.stopPropagation) e.stopPropagation()
    setIsOpenMobileMenu(true)
  }
  const closeMobileMenu = () => {
    setIsOpenMobileMenu(false)
  }

  const openMobileSearch = () => {
    setIsSearchMobileOpen && setIsSearchMobileOpen(true)
  }
  const closeMobileSearch = () => {
    setIsSearchMobileOpen && setIsSearchMobileOpen(false)
  }

  const getQuoteNotifications = async () => {
    setTimeout(() => {
      setPage((prev) => prev + 10)
    }, 100)
  }

  const removeNotificationsOnClick = (e: ReactDivMouseEvent) => {
    setIsNotificationsRemoved(true)
    if (e && e.stopPropagation) e.stopPropagation()
  }

  const openNotificationsModal = (e: ReactDivMouseEvent) => {
    if (e && e.stopPropagation) e.stopPropagation()
    setIsNotificationsModalOpen(true)
  }

  const closeNotificationsModal = (e: ReactDivMouseEvent) => {
    if (e && e.stopPropagation) e.stopPropagation()
    setIsNotificationsModalOpen(false)
  }

  const dropdownSwitcher = (e: ReactDivMouseEvent) => {
    if (e && e.stopPropagation) e.stopPropagation()

    if (!isActiveDropdown) {
      setIsActiveDropdown(true)
    } else {
      setIsActiveDropdown(false)
    }
  }
  const closeDropdownOnBlur = async (e: ReactDivMouseEvent) => {
    if (e && e.stopPropagation) e.stopPropagation()
    if (isActiveDropdown) {
      setIsActiveDropdown(false)
    }
    setIsSetBackground && setIsSetBackground(false)
    setIsSearchOpen && setIsSearchOpen(false)
    setIsWriteNewQuoteModalOpen && setIsWriteNewQuoteModalOpen(false)
    setIsOpenMobileMenu(false)

    switch (pathname.split('/')[1]) {
      case 'profile':
        push('profile', '', { scroll: false })
        break
      case 'movies':
        if (stage === 'addMovie' || stage === 'search' || edit) {
          push('movies', '', { scroll: false })
        } else if (stage === 'editQuote') {
          push(`/movies/${movie}/quote/${quote}`, '', { scroll: false })
        } else if (stage === 'addQuote' || quote) {
          push(`/movies/${movie}`, '', { scroll: false })
        }
        break
    }
  }

  useEffect(() => {
    if (userInformation.user_image) {
      setIsFirstRender(false)
      setCurrentImageUrl(userInformation.user_image)
    } else {
      if (isFirstRender) {
        setCurrentImageUrl(gandalfProfile.src)
        setIsFirstRender(false)
      } else {
        return
      }
    }

    userInformation.name && setUserName(userInformation.name)
  }, [userInformation, isFirstRender])

  return {
    t,
    locale,
    isActiveDropdown,
    dropdownSwitcher,
    closeDropdownOnBlur,
    currentUserImageUrl,
    userName,
    stage,
    asPath,
    pathname,
    movie,
    quote,
    edit,
    notifications,
    removeNotificationsOnClick,
    notificationsQuantity,
    openNotificationsModal,
    closeNotificationsModal,
    isNotificationsModalOpen,
    setIsNewGlobal,
    isNewGlobal,
    page,
    hasMoreItems,
    getQuoteNotifications,
    setNotificationsQuantity,
    openMobileSearch,
    closeMobileSearch,
    openMobileMenu,
    closeMobileMenu,
    isOpenMobileMenu,
    logOutUser,
    newNotifications,
  }
}
