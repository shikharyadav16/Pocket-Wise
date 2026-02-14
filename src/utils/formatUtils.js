export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDate = (dateString, includeYear = false) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const options = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  };
  
  if (includeYear) {
    options.year = 'numeric';
  }
  
  return date.toLocaleDateString(undefined, options);
};

export const isToday = (dateString) => {
    return dateString === getLocalDateString();
}

export const isYesterday = (dateString) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const [y, m, d] = dateString.split('-').map(Number);
    return y === yesterday.getFullYear() && 
           m === (yesterday.getMonth() + 1) && 
           d === yesterday.getDate();
}

export const getRelativeDateLabel = (dateString) => {
    if (isToday(dateString)) return 'Today';
    if (isYesterday(dateString)) return 'Yesterday';
    return formatDate(dateString, true); 
}
