export default function showToast(message: string, type: 'success' | 'error') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast toast--${type}`;
    document.body.appendChild(toast);
  
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }
  
  