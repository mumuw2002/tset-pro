const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
  });

  const overlay = document.getElementById('overlay');
  const toggleBtn = document.getElementById('arrow-btn');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('close');

    // Check if the sidebar is open or closed
    if (sidebar.classList.contains('close')) {
      overlay.classList.remove('show');
    } else {
      overlay.classList.add('show');
    }
  });

  // Hide overlay when clicked
  overlay.addEventListener('click', () => {
    sidebar.classList.add('close');
    overlay.classList.remove('show');
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Log current path for debugging
    console.log(window.location.pathname);

    // ส่วนของการทำให้เมนู active ตาม path
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
      const link = item.querySelector('a');
      if (link.getAttribute('href') === currentPath) {
        item.classList.add('active');
      }
    });
  });