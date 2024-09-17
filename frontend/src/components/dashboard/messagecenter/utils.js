// utils.js
export const getBgColorByRole = (role) => {
  switch (role) {
    case 'admin':
      return 'bg-red-300';
    case 'service_worker':
      return 'bg-green-300';
    case 'client':
      return 'bg-blue-300';
    default:
      return 'bg-gray-300';
  }
};

export const scrollToBottom = (ref) => {
  ref.current?.scrollIntoView({ behavior: 'smooth' });
};
