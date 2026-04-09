import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  metadata?: Record<string, any>;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total_count: number;
  unread_count: number;
  next_page_token?: string;
}

export interface NotificationsSummary {
  total_notifications: number;
  unread_notifications: number;
  recent_notifications: Notification[];
}

export const notificationsApiSlice = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Notifications', 'NotificationsSummary'],
  endpoints: (builder) => ({
    // Get all notifications
    getNotifications: builder.query<NotificationsResponse, { page_token?: string; limit?: number }>({
      query: ({ page_token, limit = 20 }) => ({
        url: '/notifications',
        params: {
          ...(page_token && { page_token }),
          limit,
        },
      }),
      providesTags: ['Notifications'],
    }),
    
    // Get notifications summary
    getNotificationsSummary: builder.query<NotificationsSummary, void>({
      query: () => '/notifications/summary',
      providesTags: ['NotificationsSummary'],
    }),
    
    // Mark all notifications as read
    markAllNotificationsAsRead: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'POST',
      }),
      invalidatesTags: ['Notifications', 'NotificationsSummary'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationsSummaryQuery,
  useMarkAllNotificationsAsReadMutation,
} = notificationsApiSlice;