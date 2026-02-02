'use client';

interface Email {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  invited: string;
  status: string;
  time: string;
}

interface RecentEmailsProps {
  emails: Email[];
}

export function RecentEmails({ emails, title }: RecentEmailsProps & { title?: string }) {
  return (
    <div className="bg-white/55 dark:bg-gray-900/55 backdrop-blur-sm border border-white/55 dark:border-white/8 rounded-3xl p-5 xl:p-6 shadow-lg dark:shadow-2xl">
      {/* Header */}
      <h3 className="text-base xl:text-lg font-bold text-gray-900 dark:text-gray-50 mb-4">
        {title || 'Recent emails'}
      </h3>

      {/* Email List */}
      <div className="space-y-3">
        {emails.map((email) => (
          <div
            key={email.id}
            className="flex items-center gap-3 py-2 hover:bg-white/15 dark:hover:bg-white/4 rounded-xl px-2 -mx-2 transition-all cursor-pointer hover:-translate-y-0.5"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
              {email.avatar}
            </div>

            {/* Content - Responsive Layout */}
            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-center">
              {/* Name */}
              <div className="md:col-span-3">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">
                  {email.name}
                </div>
              </div>

              {/* Subject */}
              <div className="md:col-span-4">
                <div className="text-sm text-gray-900/78 dark:text-gray-50/78 truncate">
                  {email.subject}
                </div>
              </div>

              {/* Invited - Hidden on mobile */}
              <div className="hidden md:block md:col-span-2">
                <div className="text-sm text-gray-900/52 dark:text-gray-50/55 truncate">
                  {email.invited}
                </div>
              </div>

              {/* Status - Hidden on mobile */}
              <div className="hidden md:block md:col-span-2">
                <div className="text-sm text-gray-900/52 dark:text-gray-50/55 truncate">
                  {email.status}
                </div>
              </div>

              {/* Time */}
              <div className="md:col-span-1 md:text-right">
                <div className="text-sm text-gray-900/52 dark:text-gray-50/55">
                  {email.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
