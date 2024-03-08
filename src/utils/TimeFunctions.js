export function NotificationTime(createdAt) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeDifference = currentTimestamp - createdAt;
    let formattedRelativeTime = '';

    if (timeDifference < 60) {
        formattedRelativeTime = `${timeDifference} sec ago`;
    } else if (timeDifference < 60 * 60) {
        const minutes = Math.floor(timeDifference / 60);
        formattedRelativeTime = `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDifference < 24 * 60 * 60) {
        const hours = Math.floor(timeDifference / (60 * 60));
        formattedRelativeTime = `${hours} hr${hours > 1 ? 's' : ''} ago`;
    } else if (timeDifference < 7 * 24 * 60 * 60) {
        const days = Math.floor(timeDifference / (60 * 60 * 24));
        formattedRelativeTime = `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (timeDifference < 30 * 24 * 60 * 60) {
        const weeks = Math.floor(timeDifference / (7 * 24 * 60 * 60));
        formattedRelativeTime = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (timeDifference < 365 * 24 * 60 * 60) {
        const months = Math.floor(timeDifference / (30 * 24 * 60 * 60));
        formattedRelativeTime = `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(timeDifference / (365 * 24 * 60 * 60));
        formattedRelativeTime = `${years} year${years > 1 ? 's' : ''} ago`;
    }

    return formattedRelativeTime;
}

export function formatTimeStamp(timestamp) {
    const milliseconds = timestamp * 1000;
    const date = new Date(milliseconds);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-us', options);
    return formattedDate;
}