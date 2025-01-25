document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.nav-links');

    menuItems.forEach(item => {
      const link = item.querySelector('a');
      if (link.getAttribute('href') === currentPath) {
        item.classList.add('active');
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
    const spaceIcons = document.querySelectorAll('#spaceicon');

    // โทนสีพื้นหลังจากภาพ: สีเหลืองอ่อน, สีฟ้าอ่อน, สีน้ำเงินอ่อน, สีม่วงอ่อน
    const colors = [{
        background: '#FFE0B2',
        text: '#E65100'
      }, // สีเหลืองอ่อน - ตัวอักษรสีส้มเข้ม
      {
        background: '#C5CAE9',
        text: '#1A237E'
      }, // สีฟ้าอ่อน - ตัวอักษรสีน้ำเงินเข้ม
      {
        background: '#B3E5FC',
        text: '#01579B'
      }, // สีน้ำเงินอ่อน - ตัวอักษรสีน้ำเงินเข้ม
      {
        background: '#D1C4E9',
        text: '#4A148C'
      } // สีม่วงอ่อน - ตัวอักษรสีม่วงเข้ม
    ];

    spaceIcons.forEach(spaceIcon => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      // ตั้งค่าสีพื้นหลังและสีตัวอักษร
      spaceIcon.style.backgroundColor = randomColor.background;
      spaceIcon.style.color = randomColor.text;
    });
  });