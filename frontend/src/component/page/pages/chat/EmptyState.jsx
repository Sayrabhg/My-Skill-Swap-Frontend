import React from 'react';

const EmptyState = ({
    title = "Welcome to Messages",
    description = "Select a conversation from the left sidebar to start chatting.",
    icon = "message-circle",
    actionButton = null
}) => {
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'message-circle':
                return (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                );
            case 'inbox':
                return (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                );
            case 'users':
                return (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                );
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 bg-gradient-to-br from-slate-50/50 dark:from-gray-800 to-indigo-50/50 dark:to-gray-900 min-h-0">
            <div className="text-center max-w-md w-full">
                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl ring-1 ring-white/20">
                    {getIcon(icon)}
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-4 leading-tight">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 mb-8 leading-relaxed px-4">
                    {description}
                </p>

                {/* Status Badge */}
                <div className="flex items-center justify-center gap-2 mb-8 px-6 py-3 bg-white/60 dark:bg-gray-700/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-gray-600/50">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm"></span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">End-to-end encrypted</span>
                </div>

                {/* Action Button */}
                {actionButton && (
                    <div className="mt-8">
                        {actionButton}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmptyState;