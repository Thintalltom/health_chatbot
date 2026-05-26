import { useState, useRef, useEffect } from 'react';
import { BellIcon, X, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { useAuth } from '../../store/slices/useAuth';
import {
  useGetNotificationsSummaryQuery,
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation
} from '../../store/slices/notificationsApiSlice';
import { UserProfile } from '../ui/UserProfile';
import logo from '../../assets/png/MEDAUX-LOGO.png';
export function NavBar() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { logoutUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Fetch notifications data
  const { data: notificationsSummary } = useGetNotificationsSummaryQuery();
  const { data: notifications, isLoading: notificationsLoading } = useGetNotificationsQuery(
    { limit: 10 },
    { skip: !showNotifications }
  );
  const [markAllAsRead, { isLoading: isMarkingAsRead }] = useMarkAllNotificationsAsReadMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const today = new Date();
  const currentMonthShort = today
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase();
  const currentDayNumber = today.getDate();
  const currentFullDate = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const currentWeekday = today.toLocaleDateString('en-US', {
    weekday: 'long',
  });

  return (
    <nav className="w-full bg-white rounded-[28px] shadow-[0px_2px_8px_rgba(0,0,0,0.04)] px-6 py-5 flex justify-between items-center">
      {/* Logo */}
      <div className="text-[#080E0D] font-satoshi font-bold text-[28px] tracking-tight ml-2">
        <img src={logo} alt="MedAUX Logo" className="w-full h-auto max-w-[200px] mx-auto mb-6" />
      </div>

      {/* Right Section */}
      <div className="flex flex-row gap-5 items-center cursor-pointer">
        {/* Date Widget */}
        <div className="flex flex-row gap-3 items-center">
          <div className="flex flex-col shadow-[0px_2px_8px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden">
            <div className="bg-[#14B8A6] text-white font-mulish font-bold text-[10px] leading-none py-1.5 px-2 text-center">
              {currentMonthShort}
            </div>
            <div className="bg-white text-[#080E0D] font-satoshi font-bold text-base py-1.5 px-2 text-center">
              {currentDayNumber}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-satoshi font-medium text-[18px] text-[#080E0D] leading-tight">
              {currentFullDate}
            </span>
            <span className="font-mulish font-medium text-[14px] text-[#9B9B9B] leading-tight mt-0.5">
              {currentWeekday}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-[#F2F2F2] mx-1"></div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <div
            className="relative cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <BellIcon className="w-6 h-6 text-[#BCBCBC]" strokeWidth={2} />
            {notificationsSummary && notificationsSummary.unread_notifications > 0 && (
              <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#E30303] rounded-full border border-white flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">
                  {notificationsSummary.unread_notifications > 99 ? '99+' : notificationsSummary.unread_notifications}
                </span>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-[#E5E7EB] z-50 max-h-96 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
                <h3 className="font-satoshi font-bold text-[16px] text-[#080E0D]">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {notificationsSummary && notificationsSummary.unread_notifications > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      disabled={isMarkingAsRead}
                      className="flex items-center gap-1 px-2 py-1 text-[12px] text-[#418BF5] hover:bg-[#F0F8FF] rounded-md transition-colors disabled:opacity-50"
                    >
                      <CheckCheck className="w-3 h-3" />
                      {isMarkingAsRead ? 'Marking...' : 'Mark all read'}
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4 text-[#7A7A7A]" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notificationsLoading ? (
                  <div className="p-4 text-center text-[#7A7A7A]">
                    Loading notifications...
                  </div>
                ) : !notifications?.notifications || notifications.notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <BellIcon className="w-12 h-12 text-[#BCBCBC] mx-auto mb-3" strokeWidth={1} />
                    <p className="text-[#7A7A7A] font-mulish text-[14px]">
                      No notifications yet
                    </p>
                    <p className="text-[#BCBCBC] font-mulish text-[12px] mt-1">
                      We'll notify you when something happens
                    </p>
                  </div>
                ) : (
                  notifications.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-[#F5F5F5] hover:bg-[#F9FAFB] transition-colors cursor-pointer ${!notification.is_read ? 'bg-[#F0F8FF]' : ''
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-lg mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-satoshi font-semibold text-[14px] text-[#080E0D] truncate">
                              {notification.title}
                            </h4>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-[#418BF5] rounded-full flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className="font-mulish text-[12px] text-[#7A7A7A] line-clamp-2 mb-2">
                            {notification.message}
                          </p>
                          <span className="font-mulish text-[11px] text-[#BCBCBC]">
                            {formatTimeAgo(notification.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications?.notifications && notifications.notifications.length > 0 && (
                <div className="p-3 border-t border-[#E5E7EB] text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      // Navigate to full notifications page if you have one
                      // navigate('/notifications');
                    }}
                    className="text-[#418BF5] font-mulish text-[12px] hover:underline"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-[#F2F2F2] mx-1"></div>

        {/* User Profile */}
        <UserProfile
          name={user?.name || "Joanne D."}
          title={user?.role}
          image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80"
          onLogout={handleLogout}
        />
      </div>
    </nav>);

}