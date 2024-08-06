document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const settingsButton = document.getElementById('settingsButton');
    let currentMonth = new Date();
    let today = new Date();
  
    //const progressIncrement = 100 / new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const progressIncrement = 0.3; // TODO: 
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
    function updateProgressBar(attendance) {
      const attendedDays = Object.keys(attendance).map(monthKey => Object.keys(attendance[monthKey]).length).reduce((accumulator, currentValue) => accumulator + currentValue, 0); 
      const progress = attendedDays * progressIncrement;
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${progress.toFixed(2)}%`;
    }
  
    function loadAttendanceForMonth(month) {
      calendar.innerHTML = ''; // Clear existing calendar
      const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
      const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  
      // Add weekdays header
      daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('weekday');
        dayElement.textContent = day;
        calendar.appendChild(dayElement);
      });
  
      // Add empty days for the first week
      for (let i = 0; i < firstDay; i++) {
        const emptyDayElement = document.createElement('div');
        calendar.appendChild(emptyDayElement);
      }
  
      // Add days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = i;
        dayElement.id = `day-${i}`;
        if (today.getTime() == month.getTime()  && today.getDate() == i) {
          dayElement.classList.add('today');
        }
        calendar.appendChild(dayElement);
      }
  
      chrome.storage.sync.get(['attendance'], function(data) {
        const attendance = data.attendance || {};
        const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
        const monthlyAttendance = attendance[monthKey] || {};
  
        for (let i = 1; i <= daysInMonth; i++) {
          const dayElement = document.getElementById(`day-${i}`);
          if (monthlyAttendance[i]) {
            dayElement.classList.add('attended');
          } else {
            dayElement.classList.add('not-attended');
          }
        }
  
        updateProgressBar(attendance);
      });
    }
  
    function updateCurrentMonth() {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      currentMonthElement.textContent = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
      loadAttendanceForMonth(currentMonth);
    }
  
    prevMonthButton.addEventListener('click', function() {
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      updateCurrentMonth();
    });
  
    nextMonthButton.addEventListener('click', function() {
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      updateCurrentMonth();
    });

    settingsButton.addEventListener('click', function() {
      chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
    });


  
    calendar.addEventListener('click', function(event) {
      if (event.target.classList.contains('day')) {
        const day = event.target;
        const dayNumber = day.textContent;
        const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`;
  
        chrome.storage.sync.get(['attendance'], function(data) {
          const attendance = data.attendance || {};
          const monthlyAttendance = attendance[monthKey] || {};
  
          if (monthlyAttendance[dayNumber]) {
            delete monthlyAttendance[dayNumber];
            day.classList.remove('attended');
            day.classList.add('not-attended');
          } else {
            monthlyAttendance[dayNumber] = true;
            day.classList.remove('not-attended');
            day.classList.add('attended');
          }
  
          attendance[monthKey] = monthlyAttendance;
          chrome.storage.sync.set({ attendance: attendance }, function() {
            updateProgressBar(attendance);
          });
        });
      }
    });
  
    updateCurrentMonth();
  });
  