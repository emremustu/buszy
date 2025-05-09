export const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    sessionStorage.removeItem('userLoggedIn');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userMail');
    sessionStorage.removeItem('account_type');
    sessionStorage.removeItem('profile_picture')


    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    localStorage.removeItem('userMail');
    localStorage.removeItem('account_type');
    localStorage.removeItem('profile_picture')





    // İsteğe bağlı yönlendirme (Next.js router kullanımı)
    window.location.href = '/login';
  };