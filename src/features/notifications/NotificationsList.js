import React, { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'
import classnames from 'classnames'

import { selectAllUsers } from '../users/usersSlice'

import { allNotificationsRead, selectAllNotifications } from './notificationsSlice'
import { Spinner } from '../../components/Spinner'

export const NotificationsList = () => {
  const dispatch = useDispatch()
  const notificationsStatus = useSelector(state => state.notifications.status)
  const error = useSelector(state => state.notifications.error)
  const notifications = useSelector(selectAllNotifications)
  const users = useSelector(selectAllUsers)
  
  useLayoutEffect(() => {
      dispatch(allNotificationsRead())
  })

  let loader = null

  if (notificationsStatus === 'loading') {
    loader = <Spinner text='Loading...' />
  } else if (notificationsStatus === 'failed') {
    loader = <div>{error}</div>
  }

  let renderedNotifications

  if (notifications.length === 0) {
    renderedNotifications =
    <div>
        <h5>There is no notifications. Please click the Refresh Notifications Button to check out new notifications!</h5>
    </div>
  } else {
    renderedNotifications = notifications.map((notification) => {
      const date = parseISO(notification.date)
      const timeAgo = formatDistanceToNow(date)
      const user = users.find((user) => user.id === notification.user) || {
        name: 'Unknown User',
      }
      
      const notificationClassname = classnames('notification', {
          new: notification.isNew
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
  }
  
  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {loader}
      {renderedNotifications}
    </section>
  )
}
