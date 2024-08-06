

document.addEventListener('DOMContentLoaded', function() {
  const dailyIncrementInput = document.getElementById('dailyIncrement');
  const weeklyIncrementInput = document.getElementById('weeklyIncrement');
  const monthlyIncrementInput = document.getElementById('monthlyIncrement');
  const quarterlyIncrementInput = document.getElementById('quarterlyIncrement');
  const yearlyIncrementInput = document.getElementById('yearlyIncrement');
  const saveSettingsButton = document.getElementById('saveSettingsButton');

  chrome.storage.sync.get(['settings'], function(data) {
    const settings = data.settings || {
      dailyIncrement: 3,
      weeklyIncrement: 0,
      monthlyIncrement: 0,
      quarterlyIncrement: 0,
      yearlyIncrement: 0
    };

    dailyIncrementInput.value = settings.dailyIncrement;
    weeklyIncrementInput.value = settings.weeklyIncrement;
    monthlyIncrementInput.value = settings.monthlyIncrement;
    quarterlyIncrementInput.value = settings.quarterlyIncrement;
    yearlyIncrementInput.value = settings.yearlyIncrement;
  });

  saveSettingsButton.addEventListener('click', function() {
    const settings = {
      dailyIncrement: parseFloat(dailyIncrementInput.value) || 0,
      weeklyIncrement: parseFloat(weeklyIncrementInput.value) || 0,
      monthlyIncrement: parseFloat(monthlyIncrementInput.value) || 0,
      quarterlyIncrement: parseFloat(quarterlyIncrementInput.value) || 0,
      yearlyIncrement: parseFloat(yearlyIncrementInput.value) || 0
    };

    chrome.storage.sync.set({ settings: settings }, function() {
      alert('Settings saved.');
    });
  });
});
