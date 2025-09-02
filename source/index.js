/**
 * Let's take advantage of some JS!
 * 
 * You can run any kind of JS in here that you'd like. Intervals, events, whatever.
 * This is however sandboxed within the launcher, so you cannot make system calls or
 * anything Tauri-related. Even if you could, the backend permissions are heavily locked
 * down and you wouldn't be able to do much anyways. 
 *
 */



// Change play button label

function injectPlayIcon() {
  const playBtn = document.getElementById('officialPlay');
  if (!playBtn || playBtn.querySelector('img')) return;

  const icon = document.createElement('img');
  icon.src = 'https://raw.githubusercontent.com/GID0317/Cultivation-HoYoPlay-Theme/refs/heads/main/assets/PlayIcon.png';
  icon.style.height = '48px';
  icon.style.verticalAlign = 'middle';
  icon.style.marginRight = '190px';
  icon.style.position = 'absolute';
  icon.style.pointerEvents = 'none';
  icon.style.userSelect = 'none';

  playBtn.prepend(icon);
}

// Initial injection
injectPlayIcon();

// Observe for changes
const playBtn = document.getElementById('officialPlay');
if (playBtn) {
  const observer = new MutationObserver(() => {
    injectPlayIcon();
  });
  observer.observe(playBtn, { childList: true, subtree: true });
}



const serverLaunchBtn = document.getElementById('serverLaunch');
if (serverLaunchBtn) {
  // Change button text
  //serverLaunchBtn.innerText = 'Start Private Server';

  // // Add a custom icon (optional)
  // const icon = document.createElement('img');
  // icon.src = '/your-server-icon.png'; // Make sure this icon is in your theme folder
  // icon.style.height = '28px';
  // icon.style.verticalAlign = 'middle';
  // icon.style.marginRight = '10px';
  // serverLaunchBtn.prepend(icon);
}

// Only add the bar if it doesn't exist
if (!document.getElementById('leftBar')) {
  const leftBar = document.createElement('div');
  leftBar.id = 'leftBar';
  leftBar.style.width = '67px';
  leftBar.style.height = '100vh';
  leftBar.style.background = '#0D0D0F';
  leftBar.style.position = 'fixed'; // Use fixed for overlay-style sidebars
  leftBar.style.left = '0';
  leftBar.style.top = '0';
  leftBar.style.zIndex = '0'; // Adjust as needed
  leftBar.style.display = 'flex';
  leftBar.style.flexDirection = 'column';
  leftBar.style.justifyContent = 'flex-start';
  leftBar.style.alignItems = 'center';

  // Add an image icon at the top center
  const icon = document.createElement('img');

  // Use the GitHub-hosted URL for the image
  icon.src = 'https://raw.githubusercontent.com/Grasscutters/Cultivation/refs/heads/main/src-tauri/icons/Square89x89Logo.png';
  console.log('Icon source:', icon.src); // Debugging: Check the resolved path

  // Set styles for the icon
  icon.style.width = '40px'; // Adjust size as needed
  icon.style.height = '40px';
  icon.style.marginTop = '16px'; // Add some spacing from the top

  // Apply a filter to make the icon white
  icon.style.filter = 'invert(100%) brightness(100%)';

  leftBar.appendChild(icon);

  // Add to .App if available, else body
  const appContainer = document.querySelector('.App');
  if (appContainer) {
    appContainer.appendChild(leftBar);
  } else {
    document.body.appendChild(leftBar);
  }
}

// Add commit message tooltips
function addCommitTooltips() {
  const commitRows = document.querySelectorAll('.Commit');

  commitRows.forEach(row => {
    const commitMessageCell = row.querySelector('.CommitMessage span');
    if (commitMessageCell) {
      const fullMessage = commitMessageCell.textContent || commitMessageCell.innerText;
      // Set the full commit message as a data attribute for the tooltip
      row.setAttribute('data-commit-message', fullMessage);

      // Add mouse enter event to position tooltip dynamically
      row.addEventListener('mouseenter', function () {
        const rect = row.getBoundingClientRect();
        const tooltipTop = rect.bottom + 12; // Position below the row
        const tooltipLeft = rect.left + (rect.width / 2); // Center horizontally

        // Set CSS custom properties for positioning
        row.style.setProperty('--tooltip-top', `${tooltipTop}px`);
        row.style.setProperty('--tooltip-left', `${tooltipLeft}px`);
      });
    }
  });
}

// Run when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addCommitTooltips);
} else {
  addCommitTooltips();
}

// Also run when the news content changes (in case it's dynamically loaded)
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    injectPlayIcon();

    if (mutation.type === 'childList') {
      const newsContent = document.getElementById('newsContent');
      if (newsContent && (mutation.target === newsContent || newsContent.contains(mutation.target))) {
        setTimeout(addCommitTooltips, 100); // Small delay to ensure content is rendered
      }
    }
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

function injectProgressRing() {
  const wrapper = document.querySelector('.MainProgressBarWrapper');
  if (!wrapper || document.querySelector('#customProgressRing')) return;

  const ring = document.createElement('div');
  ring.id = 'customProgressRing';
  ring.innerHTML = `
    <svg viewBox="0 0 42 42">
      <circle class="bg" cx="21" cy="21" r="20" />
      <circle class="progress" cx="21" cy="21" r="20" />
    </svg>
    <div id="customProgressRingText">0</div> <!-- 🔧 This was missing -->
  `;
  // Add the breathing class here
  ring.classList.add('breathing');
  wrapper.appendChild(ring);
}


function updateRingFromBar() {
  const bar = document.querySelector('.MainProgressBarWrapper .InnerProgress');
  const ring = document.querySelector('#customProgressRing .progress');
  const text = document.querySelector('#customProgressRingText');
  if (!bar || !ring) return;

  const percent = parseFloat(bar.style.width || '0') / 100;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - percent * circumference;
  ring.style.strokeDashoffset = offset;

  if (text) {
    // Check if we're in the mods page
    const isModsPage = document.querySelector('.Mods') !== null;
    
    if (isModsPage && percent >= 1) {
      // Show download icon when in mods page (idle state)
      text.textContent = '\uE896'; // Download icon
      text.style.fontFamily = "'Segoe MDL2 Assets', 'Segoe UI Symbol', sans-serif";
      text.style.fontSize = '14px';
      text.style.color = '#ffffff';
    } else {
      // Show normal percentage everywhere else
      text.textContent = Math.round(percent * 100);
      text.style.fontFamily = "inherit";
      text.style.fontSize = '12px';
      text.style.color = '#ffffff';
    }
  }
}


// Start syncing
injectProgressRing();
setInterval(() => {
  injectProgressRing();      // Ensure it's injected
  updateRingFromBar();       // Sync progress
}, 200);

let testProgress = 0;
let testInterval = null;

function startTestProgress() {
  stopTestProgress(); // Reset if already running

  const bar = document.querySelector('.MainProgressBarWrapper .InnerProgress');
  if (!bar) return;

  testProgress = 0;

  testInterval = setInterval(() => {
    testProgress += 1;
    if (testProgress > 1000) {
      stopTestProgress();
      return;
    }

    // Simulate width on real element
    bar.style.width = `${testProgress}%`;

    // Update ring
    updateRingFromBar();

  }, 50); // 50ms step
}

function stopTestProgress() {
  clearInterval(testInterval);
  testInterval = null;
}

// Function to check if progress is active and update button state
function updatePlayButtonState() {
  const downloadProgress = document.querySelector('#DownloadProgress');
  const progressWrapper = document.querySelector('.MainProgressBarWrapper');
  const progressBar = document.querySelector('.MainProgressBarWrapper .InnerProgress');
  const playButton = document.querySelector('#officialPlay');
  
  if (!playButton) return;
  
  let hasProgress = false;
  
  // Check if DownloadProgress exists and has children
  if (downloadProgress && downloadProgress.children.length > 0) {
    // Check if MainProgressBarWrapper exists and is visible
    if (progressWrapper && progressWrapper.style.display !== 'none') {
      // Check if there's actual progress (width > 0)
      if (progressBar) {
        const progressWidth = parseFloat(progressBar.style.width || '0');
        hasProgress = progressWidth > 0;
      } else {
        // If no progress bar but wrapper exists, assume there's progress
        hasProgress = true;
      }
    }
  }
  
  if (hasProgress) {
    // Apply progress state (hover-like appearance, hide text)
    playButton.classList.add('progress-active');
  } else {
    // Remove progress state (normal appearance, show text)
    playButton.classList.remove('progress-active');
  }
}

// Monitor progress changes more frequently
setInterval(updatePlayButtonState, 50);

// Enhanced mutation observer to watch for DownloadProgress changes
const enhancedProgressObserver = new MutationObserver(function(mutations) {
  let shouldUpdate = false;
  
  mutations.forEach(function(mutation) {
    // Check for attribute changes (style, class)
    if (mutation.type === 'attributes' && 
        (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
      shouldUpdate = true;
    }
    
    // Check for child list changes (elements being added/removed)
    if (mutation.type === 'childList') {
      shouldUpdate = true;
    }
  });
  
  if (shouldUpdate) {
    updatePlayButtonState();
  }
});

// Start observing both DownloadProgress and its children
function startProgressObserver() {
  const downloadProgress = document.querySelector('#DownloadProgress');
  const progressWrapper = document.querySelector('.MainProgressBarWrapper');
  const progressBar = document.querySelector('.MainProgressBarWrapper .InnerProgress');
  
  // Observe DownloadProgress for child changes
  if (downloadProgress) {
    enhancedProgressObserver.observe(downloadProgress, { 
      attributes: true, 
      childList: true, 
      subtree: true 
    });
  }
  
  // Observe progress wrapper for style changes
  if (progressWrapper) {
    enhancedProgressObserver.observe(progressWrapper, { 
      attributes: true 
    });
  }
  
  // Observe progress bar for style changes
  if (progressBar) {
    enhancedProgressObserver.observe(progressBar, { 
      attributes: true 
    });
  }
}

// Start observing immediately and retry if elements don't exist yet
startProgressObserver();
setInterval(startProgressObserver, 1000); // Retry every second in case elements are created later

function injectVersionHighlightsButton() {
  const newsSection = document.querySelector('.NewsSection');
  if (!newsSection || document.getElementById('customNewsButton')) return;

  const button = document.createElement('button');
  button.id = 'customNewsButton';
  button.textContent = 'Version Highlights';

  // Add class for styling
  button.className = 'version-button-style';

  // Optional: click behavior
  button.onclick = (event) => {
    // Prevent default behavior and stop propagation
    event.preventDefault();
    event.stopPropagation();
    
    const url = 'https://github.com/Grasscutters/Cultivation/releases/latest';
    
    // Create a temporary link and click it
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none'; // Hide the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Return false to ensure no further event handling
    return false;
  };

  // Insert before news section
  newsSection.parentNode.insertBefore(button, newsSection);
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectVersionHighlightsButton);
} else {
  injectVersionHighlightsButton();
}

// Function to make text inputs writable
function makeTextInputsWritable() {
  const textInputs = document.querySelectorAll('.TextInput[readonly]');
  textInputs.forEach(input => {
    input.removeAttribute('readonly');
    input.readOnly = false; // Also set the property directly
  });
}

// Run on DOM load and periodically check for new inputs
function startTextInputObserver() {
  makeTextInputsWritable();
  
  // Also observe for dynamically added inputs
  const observer = new MutationObserver(() => {
    makeTextInputsWritable();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['readonly']
  });
}

// Start immediately and on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startTextInputObserver);
} else {
  startTextInputObserver();
}

// Also check periodically in case elements are recreated
setInterval(makeTextInputsWritable, 1000);

// Function to show download complete notification
function showDownloadCompleteNotification() {
  let notification = document.querySelector('.GameInstallNotify');
  
  if (!notification) {
    // Create notification if it doesn't exist
    notification = document.createElement('div');
    notification.className = '.GameInstallNotify';
    document.body.appendChild(notification);
  }
  
  // Add the download-complete class for different styling
  notification.classList.add('download-complete');
  
  // Update the notification content
  const span = notification.querySelector('span') || document.createElement('span');
  span.textContent = 'Download and extraction complete. Enjoy the game!';
  
  if (!notification.querySelector('span')) {
    notification.appendChild(span);
  }
  
  // Show the notification
  notification.style.display = 'flex';
  notification.classList.remove('hiding');
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.classList.add('hiding');
    setTimeout(() => {
      notification.style.display = 'none';
      notification.classList.remove('hiding');
      notification.classList.remove('download-complete'); // Clean up the class
    }, 300);
  }, 5000);
}

// Function to show copy success notification
function showCopySuccessNotification() {
  let notification = document.querySelector('.GameInstallNotify');
  
  if (!notification) {
    // Create notification if it doesn't exist
    notification = document.createElement('div');
    notification.className = 'GameInstallNotify';
    document.body.appendChild(notification);
  }
  
  // Add the download-complete class for the green checkmark
  notification.classList.add('download-complete');
  
  // Update the notification content
  const span = notification.querySelector('span') || document.createElement('span');
  span.textContent = 'Copied successfully';
  
  if (!notification.querySelector('span')) {
    notification.appendChild(span);
  }
  
  // Show the notification
  notification.style.display = 'flex';
  notification.classList.remove('hiding');
  
  // Auto-hide after 3 seconds (shorter than download complete)
  setTimeout(() => {
    notification.classList.add('hiding');
    setTimeout(() => {
      notification.style.display = 'none';
      notification.classList.remove('hiding');
      notification.classList.remove('download-complete'); // Clean up the class
    }, 300);
  }, 3000);
}

// Enhanced progress monitoring to detect completion
function monitorDownloadCompletion() {
  let wasDownloading = false;
  
  const checkCompletion = () => {
    const downloadProgress = document.querySelector('#DownloadProgress');
    const progressWrapper = document.querySelector('.MainProgressBarWrapper');
    const progressBar = document.querySelector('.MainProgressBarWrapper .InnerProgress');
    
    let isCurrentlyDownloading = false;
    
    // Check if there's active progress
    if (downloadProgress && downloadProgress.children.length > 0) {
      if (progressWrapper && progressWrapper.style.display !== 'none') {
        if (progressBar) {
          const progressWidth = parseFloat(progressBar.style.width || '0');
          isCurrentlyDownloading = progressWidth > 0 && progressWidth < 100;
          
          // Check if download just completed
          if (wasDownloading && !isCurrentlyDownloading && progressWidth === 100) {
            setTimeout(() => {
              const finalCheck = parseFloat(progressBar.style.width || '0');
              if (finalCheck === 100 || progressWrapper.style.display === 'none') {
                showDownloadCompleteNotification();
              }
            }, 1000);
          }
        }
      }
    }
    
    wasDownloading = isCurrentlyDownloading;
  };
  
  setInterval(checkCompletion, 500);
}

// Start monitoring
monitorDownloadCompletion();

// Also check periodically in case elements are recreated
setInterval(makeTextInputsWritable, 1000);

// Test function to trigger download complete notification
function testDownloadCompleteNotification() {
  console.log('Testing download complete notification...');
  showDownloadCompleteNotification();
}

// Add test trigger - you can call this from browser console
window.testDownloadComplete = testDownloadCompleteNotification;

// Optional: Add a keyboard shortcut to trigger it (Ctrl+Shift+T)
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.shiftKey && event.key === 'T') {
    testDownloadCompleteNotification();
  }
});

// Easter egg: Secret menu when clicking leftBar image 5 times
let leftBarClickCount = 0;
let leftBarClickTimer = null;

function handleLeftBarImageClick() {
  console.log('LeftBar image clicked!', leftBarClickCount + 1); // Debug log
  
  leftBarClickCount++;
  
  // Reset timer
  if (leftBarClickTimer) {
    clearTimeout(leftBarClickTimer);
  }
  
  // Reset count after 2 seconds of no clicks
  leftBarClickTimer = setTimeout(() => {
    leftBarClickCount = 0;
    console.log('Click count reset'); // Debug log
  }, 2000);
  
  // Check if we reached 5 clicks
  if (leftBarClickCount >= 5) {
    console.log('5 clicks reached! Opening secret menu'); // Debug log
    leftBarClickCount = 0; // Reset counter
    showSecretMenu();
  }
}

function showSecretMenu() {
  // Remove any existing secret menu
  const existingMenu = document.getElementById('secretMenuContainer');
  if (existingMenu) {
    existingMenu.remove();
  }

  // Fetch theme version from index.json
  fetch('index.json')
    .then(response => response.json())
    .then(themeData => {
      const themeVersion = themeData.version || '1.0.0';
      
      // Get the real application version from the #version element
      const appVersionElement = document.getElementById('version');
      const appVersion = appVersionElement ? appVersionElement.textContent.trim() : 'Unknown';
      
      // Create secret menu container using standard menu structure
      const secretMenu = document.createElement('div');
      secretMenu.id = 'secretMenuContainer';
      secretMenu.className = 'Menu SecretMenu'; // Keep SecretMenu class for special styling
      secretMenu.innerHTML = `
        <div class="MenuTop" id="menuContainerTop">
          <div class="MenuHeading" id="menuHeading">Theme info</div>
          <div class="MenuExit" id="menuButtonCloseContainer">
            <img src="/static/media/close.f8111601cfc04c762c39a2b9324deae1.svg" class="MenuClose" id="menuButtonCloseIcon">
          </div>
        </div>
        <div class="MenuInner" id="menuContent">
          
          <div class="OptionSection">
            <div class="OptionLabel">Theme version:</div>
            <div class="OptionValue secret-menu-version">
             ${themeVersion}
            </div>
          </div>
          <div class="OptionSection">
            <div class="OptionLabel">Launcher version:</div>
            <div class="OptionValue secret-menu-version">
              ${appVersion}
            </div>
          </div>
          <div class="OptionSection FooterOptions">
      <div class="OptionLabel">
        <div class="FooterButton tertiary" id="advancedOptionsBtn">
          <img class="icon" src="src="/static/media/cog.08bd8fa3c3a1b1e18d7c8ce61bb70e2c.svg" alt="gear">
          <span>Advanced Settings</span>
        </div>
      </div>
      <div class="OptionValue ExtraLaunch">
        <div class="FooterButton secondary" id="copyInfoBtn">
          <span>Copy information</span>
        </div>
        <div class="FooterButton primary" id="okBtn">
          <span>OK</span>
        </div>
      </div>
    </div>



        </div>
        
      `;
      
      // Add to body
      document.body.appendChild(secretMenu);
      
      // Add event listeners - use correct ID
      const closeBtn = secretMenu.querySelector('#menuButtonCloseContainer');
      const testNotificationBtn = secretMenu.querySelector('#testNotificationBtn');
      const testProgressBtn = secretMenu.querySelector('#testProgressBtn');
        const okBtn = secretMenu.querySelector('#okBtn');
      const copyBtn = secretMenu.querySelector('#copyInfoBtn');
      
      if (okBtn) {
        okBtn.addEventListener('click', () => {
          secretMenu.remove();
        });
      }
      
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const themeVersionText = secretMenu.querySelector('.OptionSection .OptionValue.secret-menu-version')?.textContent.trim() || '';
          const launcherVersionText = secretMenu.querySelectorAll('.OptionSection .OptionValue.secret-menu-version')[1]?.textContent.trim() || '';
          const output = `Theme version: ${themeVersionText}\nLauncher version: ${launcherVersionText}`;
          navigator.clipboard.writeText(output).then(() => {
            copyBtn.querySelector('span').textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.querySelector('span').textContent = 'Copy information';
            }, 1200);
          });
        });
      }
      
      closeBtn.addEventListener('click', () => {
        secretMenu.remove();
      });
      
      testNotificationBtn.addEventListener('click', () => {
        showDownloadCompleteNotification();
      });
      
      testProgressBtn.addEventListener('click', () => {
        if (testInterval) {
          stopTestProgress();
          testProgressBtn.querySelector('.BigButtonText').textContent = 'Start Test';
        } else {
          startTestProgress();
          testProgressBtn.querySelector('.BigButtonText').textContent = 'Stop Test';
        }
      });
      
      // Close when clicking outside
      secretMenu.addEventListener('click', (e) => {
        if (e.target === secretMenu) {
          secretMenu.remove();
        }
      });
    })
    .catch(() => {
      // Fallback if fetch fails
      const themeVersion = '1.0.0';
      // Get the real application version from the #version element
      const appVersionElement = document.getElementById('version');
      const appVersion = appVersionElement ? appVersionElement.textContent.trim() : 'Unknown';
      
      // Create secret menu container using standard menu structure
      const secretMenu = document.createElement('div');
      secretMenu.id = 'secretMenuContainer';
      secretMenu.className = 'Menu SecretMenu'; // Keep SecretMenu class for special styling
      secretMenu.innerHTML = `
        <div class="MenuTop" id="menuContainerTop">
          <div class="MenuHeading" id="menuHeading">Theme info</div>
          <div class="MenuExit" id="menuButtonCloseContainer">
            <img src="/static/media/close.f8111601cfc04c762c39a2b9324deae1.svg" class="MenuClose" id="menuButtonCloseIcon">
          </div>
        </div>
        <div class="MenuInner" id="menuContent">
          
          <div class="OptionSection">
            <div class="OptionLabel">Theme version:</div>
            <div class="OptionValue secret-menu-version">
             ${themeVersion}
            </div>
          </div>
          <div class="OptionSection">
            <div class="OptionLabel">Launcher version:</div>
            <div class="OptionValue secret-menu-version">
              ${appVersion}
            </div>
          </div>
          <div class="OptionSection FooterOptions">
      <div class="OptionLabel">
        <div class="FooterButton tertiary" id="advancedOptionsBtn">
          <span>Theme repository</span>
        </div>
      </div>
      <div class="OptionValue ExtraLaunch">
        <div class="FooterButton secondary" id="copyInfoBtn">
          <span>Copy information</span>
        </div>
        <div class="FooterButton primary" id="okBtn">
          <span>OK</span>
        </div>
      </div>
    </div>



        </div>
        
      `;
      
      // Add to body
      document.body.appendChild(secretMenu);
      
      // Add event listeners - use correct ID
      const closeBtn = secretMenu.querySelector('#menuButtonCloseContainer');
      const testNotificationBtn = secretMenu.querySelector('#testNotificationBtn');
      const testProgressBtn = secretMenu.querySelector('#testProgressBtn');
      const okBtn = secretMenu.querySelector('#okBtn');
      const copyBtn = secretMenu.querySelector('#copyInfoBtn');
      const advancedBtn = secretMenu.querySelector('#advancedOptionsBtn'); // ADD this line
      
      // ADD this event listener block:
      if (advancedBtn) {
        advancedBtn.addEventListener('click', () => {
          const url = 'https://github.com/GID0317/Cultivation-HoYoPlay-Theme';
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      }
      
      if (okBtn) {
        okBtn.addEventListener('click', () => {
          secretMenu.remove();
        });
      }
      
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const themeVersionText = secretMenu.querySelector('.OptionSection .OptionValue.secret-menu-version')?.textContent.trim() || '';
          const launcherVersionText = secretMenu.querySelectorAll('.OptionSection .OptionValue.secret-menu-version')[1]?.textContent.trim() || '';
          const output = `Theme version: ${themeVersionText}\nLauncher version: ${launcherVersionText}`;
          navigator.clipboard.writeText(output).then(() => {
            showCopySuccessNotification();
          });
        });
      }
      
      closeBtn.addEventListener('click', () => {
        secretMenu.remove();
      });
      
      testNotificationBtn.addEventListener('click', () => {
        showDownloadCompleteNotification();
      });
      
      testProgressBtn.addEventListener('click', () => {
        if (testInterval) {
          stopTestProgress();
          testProgressBtn.querySelector('.BigButtonText').textContent = 'Start Test';
        } else {
          startTestProgress();
          testProgressBtn.querySelector('.BigButtonText').textContent = 'Stop Test';
        }
      });
      
      // Close when clicking outside
      secretMenu.addEventListener('click', (e) => {
        if (e.target === secretMenu) {
          secretMenu.remove();
        }
      });
    });
}

// Add click listener to leftBar image
function addLeftBarClickListener() {
  const leftBarImage = document.querySelector('#leftBar img');
  if (leftBarImage && !leftBarImage.hasAttribute('data-click-listener')) {
    // Enable pointer events and set cursor
    leftBarImage.style.pointerEvents = 'auto'; // Override the CSS that disables pointer events
    leftBarImage.style.cursor = 'pointer';
    leftBarImage.addEventListener('click', handleLeftBarImageClick);
    leftBarImage.setAttribute('data-click-listener', 'true');
    
    console.log('Click listener added to leftBar image'); // Debug log
  }
}

// Initialize the click listener
addLeftBarClickListener();

// Also check periodically in case the leftBar is recreated
setInterval(addLeftBarClickListener, 1000);

// Variables to track notification state
let hijackedNotification = null;
let originalNotificationContent = '';

// Function to hijack and preserve notification
function hijackVersionNotification() {
  document.querySelectorAll('.Notification').forEach(el => {
    const msgDiv = el.querySelector('.NotificationMessage');
    
    if (msgDiv && msgDiv.innerHTML && msgDiv.innerHTML.trim() !== '') {
      const messageContent = msgDiv.innerHTML.trim();
      
      // Check if this is a version notification
      if (messageContent.includes('Cultivation') && 
          (messageContent.includes('available') || messageContent.includes('version'))) {
        
        // Store the original content if we haven't already
        if (!originalNotificationContent) {
          originalNotificationContent = messageContent;
          console.log('Hijacked notification content:', originalNotificationContent);
        }
        
        // Store reference to this notification
        hijackedNotification = el;
        
        // Apply our styling
        el.classList.add('NotifShow');
        el.style.top = '84%';
        el.style.right = '30%';
        el.style.zIndex = '9999';
        
        // Update the link to point to latest releases
        const versionLink = msgDiv.querySelector('a');
        if (versionLink) {
          versionLink.href = 'https://github.com/Grasscutters/Cultivation/releases/latest';
          versionLink.target = '_blank';
          versionLink.rel = 'noopener noreferrer';
        }
      }
    }
  });
}

// Function to restore hijacked content if it gets cleared
function restoreHijackedContent() {
  if (hijackedNotification && originalNotificationContent) {
    const msgDiv = hijackedNotification.querySelector('.NotificationMessage');
    
    // If the content was cleared or changed, restore it
    if (msgDiv && (!msgDiv.innerHTML || msgDiv.innerHTML.trim() === '' || 
        !msgDiv.innerHTML.includes('Cultivation'))) {
      
      console.log('Restoring hijacked notification content');
      msgDiv.innerHTML = originalNotificationContent;
      
      // Reapply link fix
      const versionLink = msgDiv.querySelector('a');
      if (versionLink) {
        versionLink.href = 'https://github.com/Grasscutters/Cultivation/releases/latest';
        versionLink.target = '_blank';
        versionLink.rel = 'noopener noreferrer';
      }
      
      // Ensure styling is maintained
      hijackedNotification.classList.add('NotifShow');
      hijackedNotification.style.top = '84%';
      hijackedNotification.style.right = '30%';
      hijackedNotification.style.zIndex = '9999';
    }
  }
}

// Enhanced monitoring with faster intervals
setInterval(hijackVersionNotification, 100); // Check every 100ms for new notifications
setInterval(restoreHijackedContent, 200);    // Restore content every 200ms if needed

// Also use mutation observer for immediate detection
const notificationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' || mutation.type === 'characterData') {
      hijackVersionNotification();
      // Small delay then check if we need to restore
      setTimeout(restoreHijackedContent, 50);
    }
  });
});

// Start observing the document for notification changes
notificationObserver.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});

// // Game data for API calls (fail due to CSP. Pull Request if you can fix this!)
// const gameData = {
//   GI: {
//     name: "Genshin Impact",
//     url: "https://sg-hyp-api.hoyoverse.com/hyp/hyp-connect/api/getAllGameBasicInfo?launcher_id=VYTpXlbWo8&language=en-us&game_id=gopR6Cufr3"
//   },
//   HSR: {
//     name: "Honkai Star Rail", 
//     url: "https://sg-hyp-api.hoyoverse.com/hyp/hyp-connect/api/getAllGameBasicInfo?launcher_id=VYTpXlbWo8&language=en-us&game_id=4ziysqXOQ8"
//   },
//   ZZZ: {
//     name: "Zenless Zone Zero",
//     url: "https://sg-hyp-api.hoyoverse.com/hyp/hyp-connect/api/getAllGameBasicInfo?launcher_id=VYTpXlbWo8&language=en-us&game_id=U5hbdsT9W7"
//   },
//   BH3: {
//     name: "Honkai Impact 3rd",
//     url: "https://sg-hyp-api.hoyoverse.com/hyp/hyp-connect/api/getAllGameBasicInfo?launcher_id=VYTpXlbWo8&language=en-us&game_id=bxPTXSET5t"
//   }
// };

// // Function to fetch and apply background from HoYoVerse API
// async function applyHoYoPlayBackground(gameId) {
//   const game = gameData[gameId];
//   if (!game) return;

//   try {
//     // Use a CORS proxy to bypass CORS restrictions
//     const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
//     const response = await fetch(proxyUrl + game.url);
//     const data = await response.json();
    
//     // Get background URL from API response
//     const backgroundUrl = data.data.game_info_list[0].backgrounds[0].background.url;
    
//     // Apply background to the .App element
//     const appElement = document.querySelector('.App');
//     if (appElement) {
//       appElement.style.background = `url("${backgroundUrl}") fixed`;
//       appElement.style.backgroundSize = 'cover';
//       appElement.style.backgroundPosition = 'center';
//     }
    
//     console.log(`Applied ${game.name} background:`, backgroundUrl);
//   } catch (error) {
//     console.error(`Error fetching ${game.name} background:`, error);
//   }
// }

// // Function to inject new option section with dropdown
// function injectCustomOptionSection() {
//   const useThemeBGSection = document.getElementById('menuOptionsContainerUseThemeBG');
//   if (!useThemeBGSection || document.getElementById('menuOptionsContainerCustomOption')) return;

//   const newOptionSection = document.createElement('div');
//   newOptionSection.className = 'OptionSection';
//   newOptionSection.id = 'menuOptionsContainerCustomOption';
//   newOptionSection.innerHTML = `
//     <div class="OptionLabel" id="menuOptionsLabelCustomOption">Use background supplied by HoYoPlay</div>
//     <div class="OptionValue" id="menuOptionsCustomOption">
//       <select id="hoyoplayGameSelect">
//         <option value="GI">Genshin Impact</option>
//         <option value="HSR">Honkai Star Rail</option>
//         <option value="ZZZ">Zenless Zone Zero</option>
//         <option value="BH3">Honkai Impact 3rd</option>
//       </select>
//     </div>
//   `;

//   // Insert after the useThemeBG section
//   useThemeBGSection.parentNode.insertBefore(newOptionSection, useThemeBGSection.nextSibling);
  
//   // Get elements
//   const dropdown = newOptionSection.querySelector('#hoyoplayGameSelect');
//   const useThemeBGCheckbox = document.getElementById('useThemeBG');
  
//   // Load saved state
//   const savedGame = localStorage.getItem('hoyoplay-selected-game') || 'GI';
//   dropdown.value = savedGame;
  
//   // Function to apply background based on current settings
//   function applyBackgroundBasedOnSettings() {
//     const useThemeBackground = useThemeBGCheckbox && useThemeBGCheckbox.checked;
    
//     if (useThemeBackground) {
//       // Use the theme's built-in background - restore original
//       const appElement = document.querySelector('.App');
//       if (appElement) {
//         // Reset to original theme background
//         appElement.style.background = 'url("https://asset.localhost/C%3A%2FUsers%2FUser%2FAppData%2FRoaming%2Fcultivation%2Fbg%2Fbg.png") fixed';
//       }
//     } else {
//       // Use HoYoPlay background
//       applyHoYoPlayBackground(dropdown.value);
//     }
//   }
  
//   // Apply background on load
//   applyBackgroundBasedOnSettings();
  
//   // Save selection and apply background when dropdown changes
//   dropdown.addEventListener('change', function() {
//     const selectedGame = this.value;
//     localStorage.setItem('hoyoplay-selected-game', selectedGame);
    
//     // Only apply if theme background is not enabled
//     if (!useThemeBGCheckbox || !useThemeBGCheckbox.checked) {
//       applyHoYoPlayBackground(selectedGame);
//     }
    
//     console.log('HoYoPlay game selection saved:', selectedGame);
//   });
  
//   // Monitor theme background checkbox changes
//   if (useThemeBGCheckbox) {
//     useThemeBGCheckbox.addEventListener('change', applyBackgroundBasedOnSettings);
//   }
// }

// Function to monitor for menu changes and inject the option
function startMenuObserver() {
  const menuContainer = document.getElementById('menuContainer');
  if (menuContainer) {
    injectCustomOptionSection();
    
    const observer = new MutationObserver(() => {
      injectCustomOptionSection();
    });
    
    observer.observe(menuContainer, {
      childList: true,
      subtree: true
    });
  }
}

// Start immediately and on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startMenuObserver);
} else {
  startMenuObserver();
}

(function changeSettingsIconSrc() {
  function updateIcon() {
    const btn = document.getElementById('settingsBtn');
    if (!btn) return;
    const img = btn.querySelector('img');
    if (!img) return;
    // Only update if not already set
    if (img.src !== 'https://raw.githubusercontent.com/GID0317/Cultivation-HoYoPlay-Theme/main/assets/Settings.png') {
      img.src = 'https://raw.githubusercontent.com/GID0317/Cultivation-HoYoPlay-Theme/main/assets/Settings.png';
      img.style.height = '190%';
      img.style.filter = 'invert(100%) brightness(100%)';
      console.log('[SettingsBtn] Icon src changed!');
    }
  }
  updateIcon();
  // Watch for DOM changes (in case the button is re-rendered)
  const observer = new MutationObserver(updateIcon);
  observer.observe(document.body, { childList: true, subtree: true });
  setInterval(updateIcon, 2000); // Backup periodic check
})();

(function changeMinimizeIconSrc() {
  function updateIcon() {
    const btn = document.getElementById('minBtn');
    if (!btn) return;
    const img = btn.querySelector('img');
    if (!img) return;
    // Only update if not already set
    if (img.src !== 'https://raw.githubusercontent.com/GID0317/Cultivation-HoYoPlay-Theme/refs/heads/main/assets/Minimize.png') {
      img.src = 'https://raw.githubusercontent.com/GID0317/Cultivation-HoYoPlay-Theme/refs/heads/main/assets/Minimize.png';
      img.style.height = '300%';
      img.style.filter = 'invert(100%) brightness(100%)';
      console.log('[MinBtn] Icon src changed!');
    }
  }
  updateIcon();
  // Watch for DOM changes (in case the button is re-rendered)
  const observer = new MutationObserver(updateIcon);
  observer.observe(document.body, { childList: true, subtree: true });
  setInterval(updateIcon, 2000); // Backup periodic check
})();

(function changeCloseIconSrc() {
  function updateIcon() {
    const btn = document.getElementById('closeBtn');
    if (!btn) return;
    const img = btn.querySelector('img');
    if (!img) return;
    // Only update if not already set
    if (img.src !== 'https://raw.githubusercontent.com/GID0317/Cultivation-HoYoPlay-Theme/refs/heads/main/assets/Close.png') {
      img.src = 'https://raw.githubusercontent.com/GID0317/Cultivation-HoYoPlay-Theme/refs/heads/main/assets/Close.png';
      img.style.height = '300%';
      img.style.filter = 'invert(100%) brightness(100%)';
      console.log('[CloseBtn] Icon src changed!');
    }
  }
  updateIcon();
  // Watch for DOM changes (in case the button is re-rendered)
  const observer = new MutationObserver(updateIcon);
  observer.observe(document.body, { childList: true, subtree: true });
  setInterval(updateIcon, 2000); // Backup periodic check
})();

(function createHoYoPlaySelector() {
  // Create full-width shadow background
  const shadowBg = document.createElement('div');
  shadowBg.id = 'hoyoplay-shadow-bg';
  shadowBg.style.position = 'fixed';
  shadowBg.style.top = '0';
  shadowBg.style.left = '0';
  shadowBg.style.width = '100vw';
  shadowBg.style.height = '64px';
  shadowBg.style.zIndex = '9998';
  shadowBg.style.background = 'linear-gradient(0deg,rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.69) 100%)';
  shadowBg.style.pointerEvents = 'none';
  shadowBg.style.opacity = '0';
  shadowBg.style.transition = 'opacity 0.25s cubic-bezier(.4,0,.2,1)';

  document.body.appendChild(shadowBg);

  // Create selector container
  const overlay = document.createElement('div');
  overlay.id = 'hoyoplay-selector';
  overlay.style.position = 'fixed';
  overlay.style.top = '0px';
  overlay.style.left = '50%';
  overlay.style.transform = 'translateX(-50%)';
  overlay.style.zIndex = '9999';
  overlay.style.width = '80px';
  overlay.style.height = '48px';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'space-evenly';
  overlay.style.pointerEvents = 'none';
  overlay.style.transition = 'top 0.25s cubic-bezier(.4,0,.2,1), opacity 0.18s';
  overlay.style.opacity = '0';

  // Helper to create a circle
  function makeCircle(id) {
    const c = document.createElement('div');
    c.className = 'hoyoplay-circle';
    c.id = id;
    c.style.width = '12px';
    c.style.height = '12px';
    c.style.borderRadius = '50%';
    c.style.position = 'relative';
    c.style.pointerEvents = 'auto';
    c.style.cursor = 'pointer';
    c.style.transition = 'box-shadow 0.18s cubic-bezier(.4,0,.2,1), background 0.18s cubic-bezier(.4,0,.2,1)';
    return c;
  }

  // Create two circles
  const leftCircle = makeCircle('hoyoplay-left');
  const rightCircle = makeCircle('hoyoplay-right');

  // By default, right circle is selected
  function updateCircles(selected) {
    if (selected === 'left') {
      leftCircle.classList.add('selected');
      rightCircle.classList.remove('selected');
      leftCircle.style.background = 'rgba(255,255,255,0.95)';
      rightCircle.style.background = 'rgba(180, 180, 180, 0.59)';
    } else {
      leftCircle.classList.remove('selected');
      rightCircle.classList.add('selected');
      leftCircle.style.background = 'rgba(180, 180, 180, 0.59)';
      rightCircle.style.background = 'rgba(255,255,255,0.95)';
    }
  }
  updateCircles('right');

  // Add circles to overlay
  overlay.appendChild(leftCircle);
  overlay.appendChild(rightCircle);
  document.body.appendChild(overlay);

  // Selection logic
  leftCircle.addEventListener('mouseenter', () => updateCircles('left'));
  rightCircle.addEventListener('mouseenter', () => updateCircles('right'));

  // Optional: click handler
  leftCircle.onclick = () => alert('Left circle clicked!');
  rightCircle.onclick = () => alert('Right circle clicked!');

  // Show/hide overlay and shadow on mouse movement near top center
  let isVisible = false;
  document.addEventListener('mousemove', function(e) {
    const y = e.clientY;
    const x = e.clientX;
    const winW = window.innerWidth;
    // Only show if mouse is near top (e.g. < 80px) and near center (within 60px of center)
    if (y < 80 && Math.abs(x - winW/2) < 60) {
      if (!isVisible) {
        overlay.style.top = '15px';
        overlay.style.opacity = '1';
        shadowBg.style.opacity = '1';
        isVisible = true;
      }
    } else {
      if (isVisible) {
        overlay.style.top = '0px';
        overlay.style.opacity = '0';
        shadowBg.style.opacity = '0';
        isVisible = false;
      }
    }
  });
})();

// Also check periodically in case menu is recreated
setInterval(injectCustomOptionSection, 1000);
