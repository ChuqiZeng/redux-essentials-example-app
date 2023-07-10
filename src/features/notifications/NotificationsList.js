import React, { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'
import classnames from 'classnames'

import { selectAllUsers } from '../users/usersSlice'

import {
  useGetNotificationsQuery,
  allNotificationsRead,
  selectMetadataEntities
} from './notificationsSlice'
// import { Spinner } from '../../components/Spinner'

export const NotificationsList = () => {
  const dispatch = useDispatch()
  const { data: notifications = [] } = useGetNotificationsQuery()
  const notificationsMetadata = useSelector(selectMetadataEntities)

  // const notificationsStatus = useSelector(state => state.notifications.status)
  // const error = useSelector(state => state.notifications.error)

  const users = useSelector(selectAllUsers)
  
  useLayoutEffect(() => {
      dispatch(allNotificationsRead())
  })

  // let loader = null

  // if (notificationsStatus === 'loading') {
  //   loader = <Spinner text='Loading...' />
  // } else if (notificationsStatus === 'failed') {
  //   loader = <div>{error}</div>
  // }

  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find((user) => user.id === notification.user) || {
      name: 'Unknown User',
    }

    const metadata = notificationsMetadata[notification.id]
    
    const notificationClassname = classnames('notification', {
        new: metadata.isNew
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b>
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })
  
  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {/* {loader} */}
      {renderedNotifications}
    </section>
  )
}
