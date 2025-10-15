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
  leftBar.style.background = 'linear-gradient(0deg, rgb(0 0 0 / 83%) 0%, rgb(50 50 50 / 24%) 60%)';
  leftBar.style.position = 'fixed'; // Use fixed for overlay-style sidebars
  leftBar.style.left = '0';
  leftBar.style.top = '0';
  leftBar.style.zIndex = '2'; // Keep above background fade overlay
  leftBar.style.display = 'flex';
  leftBar.style.flexDirection = 'column';
  leftBar.style.justifyContent = 'flex-start';
  leftBar.style.alignItems = 'center';

  // Add an image icon at the top center
  const icon = document.createElement('img');

  // Use the GitHub-hosted URL for the image
  icon.src = 'https://raw.githubusercontent.com/GID0317/Cultivation-HoYoPlay-Theme/refs/heads/main/source/assets/CultivationIcon.png.png';
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
    // Force non-tabbable for commit rows and descendants in news table
    try {
      row.setAttribute('tabindex', '-1');
      row.querySelectorAll('*').forEach(el => {
        if (el.matches('a, button, input, select, textarea, [tabindex]')) {
          el.setAttribute('tabindex', '-1');
        }
      });
    } catch (e) {}

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
        setTimeout(() => {
          addCommitTooltips();
          // Re-apply tab disabling for News in case of re-render
          try {
            const newsRoots = Array.from(document.querySelectorAll('#newsContent, .NewsContent, .newsContent, #newsContainer, .NewsSection'));
            if (newsRoots.length) {
              newsRoots.forEach(root => {
                // Disable container + descendants
                setGroupTabDisabled(root, true);
                const tableNodes = root.querySelectorAll('table, tbody, thead, tfoot, tr, th, td');
                tableNodes.forEach(node => setTabDisabled(node, true));
              });
            }
          } catch (_) {}
        }, 100); // Small delay to ensure content is rendered
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
  // class names should not include the '.' prefix
  notification.className = 'GameInstallNotify';
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
      const themeVersion = themeData.version || '4.0.0';
      
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
      const themeVersion = '4.0.0';
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
    // injectCustomOptionSection may be commented out in some theme copies.
    // Guard the call to avoid runtime ReferenceError when it's not defined.
    if (typeof injectCustomOptionSection === 'function') {
      try { injectCustomOptionSection(); } catch (e) { console.warn('injectCustomOptionSection failed', e); }
    }

    const observer = new MutationObserver(() => {
      if (typeof injectCustomOptionSection === 'function') {
        try { injectCustomOptionSection(); } catch (e) { console.warn('injectCustomOptionSection failed', e); }
      }
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

  // Create dialog/menu backdrop to darken background when menus/dialogs are open
  const dialogBackdrop = document.createElement('div');
  dialogBackdrop.id = 'menu-dialog-backdrop';
  Object.assign(dialogBackdrop.style, {
    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
    background: 'transparent',
    zIndex: '9996', // below menus (10000), above app content
    pointerEvents: 'none', // container doesn't block, panels do
    opacity: '0',
    transition: 'opacity 0.18s cubic-bezier(.4,0,.2,1)',
    display: 'none'
  });
  document.body.appendChild(dialogBackdrop);

  // Backdrop blocking panels (leave a top-center hole for window drag)
  let panelTop = null, panelBottom = null, panelLeft = null, panelRight = null, holeVeil = null;
  function ensureBackdropPanels() {
    if (panelTop) return;
    const make = () => {
      const d = document.createElement('div');
      Object.assign(d.style, {
        position: 'fixed',
        background: 'rgba(0,0,0,0.45)',
        pointerEvents: 'auto',
        top: '0', left: '0', width: '0', height: '0'
      });
      return d;
    };
    panelTop = make();
    panelBottom = make();
    panelLeft = make();
    panelRight = make();
    // Non-blocking veil to visually darken the draggable hole area
    holeVeil = document.createElement('div');
    Object.assign(holeVeil.style, {
      position: 'fixed',
      background: 'rgba(0,0,0,0.45)',
      pointerEvents: 'none', // do not block drag interactions underneath
      top: '0', left: '0', width: '0', height: '0'
    });
    dialogBackdrop.appendChild(panelTop);
    dialogBackdrop.appendChild(panelBottom);
    dialogBackdrop.appendChild(panelLeft);
    dialogBackdrop.appendChild(panelRight);
    // Append veil last so it renders above blocking panels for uniform look
    dialogBackdrop.appendChild(holeVeil);
  }

  function layoutBackdropPanels() {
    try {
      const vw = window.innerWidth, vh = window.innerHeight;
      const bar = document.getElementById('topBarContainer');
      const btns = document.getElementById('topBarButtonContainer');
      const barRect = bar ? bar.getBoundingClientRect() : { top: 0, left: 0, width: vw, height: 48, right: vw };
      const btnRect = btns ? btns.getBoundingClientRect() : null;
      // Define a hole centered on the top bar, but not overlapping the buttons
      const holeHeight = Math.max(36, Math.min(64, barRect.height));
      const centerX = vw / 2;
      // Wider and left-biased hole: make left side larger than right
      let holeWidth = Math.min(720, Math.max(320, vw * 0.58));
  const leftBias = 0.70; // 70% of width extends to the left of center
      let holeLeft = centerX - holeWidth * leftBias;
      let holeRight = centerX + holeWidth * (1 - leftBias);
      const safety = 4;
      if (btnRect) {
        // Ensure the hole doesn't overlap the right buttons; expand to reach them if short
        const maxRight = Math.max(0, btnRect.left - safety);
        if (holeRight < maxRight) {
          holeRight = maxRight; // allow more width on the right up to buttons
        } else if (holeRight > maxRight) {
          const overlap = holeRight - maxRight;
          holeRight -= overlap;
          holeLeft -= overlap; // shift left to avoid overlap
        }
      }
      // Clamp within viewport
      holeLeft = Math.max(8, holeLeft);
      holeRight = Math.min(vw - 8, holeRight);
      // Enforce a larger minimum width, prefer expanding left if constrained
      const minHoleWidth = 200;
      if (holeRight - holeLeft < minHoleWidth) {
        holeLeft = Math.max(8, holeRight - minHoleWidth);
      }
      const holeTop = Math.max(0, barRect.top);
      const holeBottom = Math.min(vh, holeTop + holeHeight);

      // Top panel: above the hole, full width
      Object.assign(panelTop.style, {
        top: '0px', left: '0px', width: vw + 'px', height: holeTop + 'px'
      });
      // Bottom panel: below the hole, full width
      Object.assign(panelBottom.style, {
        top: holeBottom + 'px', left: '0px', width: vw + 'px', height: Math.max(0, vh - holeBottom) + 'px'
      });
      // Left panel: from holeTop..holeBottom, left area
      Object.assign(panelLeft.style, {
        top: holeTop + 'px', left: '0px', width: Math.max(0, holeLeft) + 'px', height: Math.max(0, holeBottom - holeTop) + 'px'
      });
      // Right panel: from holeTop..holeBottom, right area
      Object.assign(panelRight.style, {
        top: holeTop + 'px', left: Math.max(0, holeRight) + 'px', width: Math.max(0, vw - holeRight) + 'px', height: Math.max(0, holeBottom - holeTop) + 'px'
      });
      // Veil over the hole: visually dim without blocking interactions
      Object.assign(holeVeil.style, {
        top: holeTop + 'px', left: Math.max(0, holeLeft) + 'px', width: Math.max(0, holeRight - holeLeft) + 'px', height: Math.max(0, holeBottom - holeTop) + 'px'
      });
    } catch (e) { /* ignore */ }
  }

  // Create selector container
  const overlay = document.createElement('div');
  overlay.id = 'hoyoplay-selector';
  overlay.style.position = 'fixed';
  overlay.style.top = '0px';
  overlay.style.left = '50%';
  overlay.style.transform = 'translateX(-50%)';
  overlay.style.zIndex = '9999';
  overlay.style.width = '80px'; // will be adjusted dynamically based on circle count
  overlay.style.height = '28px';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'space-evenly';
  overlay.style.pointerEvents = 'none';
  overlay.style.transition = 'top 0.25s cubic-bezier(.4,0,.2,1), opacity 0.18s';
  overlay.style.opacity = '0';

  // Helper: adjust selector width based on visible circle count
  function updateOverlayWidth() {
    try {
      const circles = overlay.querySelectorAll('.hoyoplay-circle');
      let visible = 0;
      circles.forEach(el => {
        const cs = window.getComputedStyle(el);
        if (cs.display !== 'none' && cs.visibility !== 'hidden') visible++;
      });
      // If 3 buttons: 100px, else (2 or fewer) keep current 80px sizing
      overlay.style.width = visible >= 3 ? '100px' : '80px';
    } catch (e) { /* ignore */ }
  }

  // Detect if Mods page is active (only Mods-related containers)
  const isModsActive = () => {
    const candidates = [
      '.Mods',
      '.mods',
      '.Menu.ModMenu',
      '.menu.modmenu',
      '#menuContainer.ModMenu',
      '#menuContainer.modmenu',
      '.ModList',
      '.modlist',
      '.ModDownloadList',
      '.moddownloadlist',
      // Also detect when Mods are rendered inside menu container
      '#menuContainer .Mods',
      '#menuContainer .mods',
      '#menuContainer .ModList',
      '#menuContainer .modlist',
      '#menuContainer .ModDownloadList',
      '#menuContainer .moddownloadlist'
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const cs = window.getComputedStyle(el);
      const visible = cs.display !== 'none' && cs.visibility !== 'hidden' && el.getClientRects().length > 0;
      if (visible) return true;
    }
    return false;
  };

  // Detect if any menu/dialog from the options/secret menu is active
  const isMenuDialogActive = () => {
    const candidates = [
      '#secretMenuContainer',
      '#menuContainer',
      '#menuContainer .Menu',
      '#menuContainer .MenuTop',
      '#menuContainer .MenuInner',
      '#menuContainer .OptionSection',
      '#menuContainer .Dialog',
      '#menuContainer .Modal',
      '#menuContainer .Popup'
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const cs = window.getComputedStyle(el);
      const visible = cs.display !== 'none' && cs.visibility !== 'hidden' && el.getClientRects().length > 0;
      if (visible) return true;
    }
    return false;
  };

  const isUiOverlayActive = () => isModsActive() || isMenuDialogActive();

  // Keep Mods above selector and disable selector when Mods is active
  function updateModsState() {
    const modsActive = isModsActive();
    const menuActive = isMenuDialogActive();
    const active = modsActive || menuActive;
    const modCandidates = Array.from(document.querySelectorAll(
      '.Mods, .Menu.ModMenu, #menuContainer, #menuContainer.ModMenu, .ModList, .ModDownloadList, #secretMenuContainer, #menuContainer .Menu, #menuContainer .MenuTop, #menuContainer .MenuInner'
    ));
    const menuEls = Array.from(document.querySelectorAll('#menuContainer, .Menu.ModMenu, #menuContainer .Menu, #menuContainer .MenuTop, #menuContainer .MenuInner'));
    const modListEls = Array.from(document.querySelectorAll('.ModList, .ModListInner, .Mods .ModList, .Mods .ModListInner'));
    if (active) {
      // Hide selector and shadow entirely, and hide video control too
      overlay.style.display = 'none';
      shadowBg.style.display = 'none';
      // Show darkening backdrop only for menus/dialogs, not Mods
      if (menuActive && !modsActive) {
        ensureBackdropPanels();
        layoutBackdropPanels();
        dialogBackdrop.style.display = 'block';
        requestAnimationFrame(() => { dialogBackdrop.style.opacity = '1'; });
      } else {
        dialogBackdrop.style.opacity = '0';
        setTimeout(() => { if (dialogBackdrop.style.opacity === '0') dialogBackdrop.style.display = 'none'; }, 200);
      }
      // Pause/hide video overlay only for Mods. Keep playing when menus/dialogs are open.
      if (modsActive) {
        try { showVideoOverlay(false, { hideControl: true }); } catch (e) {}
        if (typeof hoyoVideoControl !== 'undefined' && hoyoVideoControl) {
          hoyoVideoControl.style.display = 'none';
        }
      } else {
        // Menu/dialog open: keep video playing and control visible if left circle is active
        if (typeof hoyoVideoControl !== 'undefined' && hoyoVideoControl) {
          if (selectedCircleIndex === 0) {
            hoyoVideoControl.style.display = 'block';
            // Render under the dark backdrop (backdrop=9996), but visible through it
            hoyoVideoControl.style.zIndex = '9995';
          } else {
            hoyoVideoControl.style.display = 'none';
          }
        }
      }
      // Ensure Mods pane(s) are on top of everything
      modCandidates.forEach(el => {
        if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
        el.style.zIndex = '10000';
      });
      // When a menu is active inside Mods, raise the menu above any ModList
      if (menuActive) {
        menuEls.forEach(el => {
          if (!el) return;
          const cs = window.getComputedStyle(el);
          if (cs.position === 'static') el.style.position = 'relative';
          el.style.zIndex = '10020';
        });
        // Nudge mod lists below the menu
        modListEls.forEach(el => {
          if (!el) return;
          const cs = window.getComputedStyle(el);
          if (cs.position === 'static') el.style.position = 'relative';
          el.style.zIndex = '10005';
        });
      }

      // Ensure ModDownloadList is above ModList but without backdrop (Mods context)
      const modDownloadEls = Array.from(document.querySelectorAll('.ModDownloadList'));
      modDownloadEls.forEach(el => {
        const cs = window.getComputedStyle(el);
        if (cs.position === 'static') el.style.position = 'relative';
        el.style.zIndex = '10012';
        el.style.pointerEvents = 'auto';
        try { el.setAttribute('data-mod-z-boosted', 'true'); } catch (_) {}
      });
    } else {
      // Restore selector visibility and control based on current selection
      overlay.style.display = 'flex';
      shadowBg.style.display = 'block';
      // Hide backdrop
      dialogBackdrop.style.opacity = '0';
      // After transition, hide display to avoid intercepting clicks
      setTimeout(() => {
        if (dialogBackdrop.style.opacity === '0') dialogBackdrop.style.display = 'none';
      }, 200);
      if (typeof hoyoVideoControl !== 'undefined' && hoyoVideoControl) {
        if (selectedCircleIndex === 0) {
          hoyoVideoControl.style.display = 'block';
        } else {
          hoyoVideoControl.style.display = 'none';
        }
      }
      // Optionally reset Mods z-index we set
      modCandidates.forEach(el => {
        if (el.style.zIndex === '10000') el.style.zIndex = '';
        if (el.style.position === 'relative') el.style.position = '';
      });
      // Clear any elevated menu/list stacking set above
      menuEls.forEach(el => { if (el && el.style.zIndex) el.style.zIndex = ''; });
      modListEls.forEach(el => { if (el && el.style.zIndex) el.style.zIndex = ''; });
      const modDownloadEls = Array.from(document.querySelectorAll('.ModDownloadList'));
      modDownloadEls.forEach(el => { if (el && el.style.zIndex) el.style.zIndex = ''; });
    }

  // Update tab navigation disables according to current page state
  try { updateTabStops({ modsActive, menuActive }); } catch (e) {}
  }

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
    // Base subtle appearance so hover white-translucent stands out
    c.style.background = 'rgba(255,255,255,0.12)';
    // Accessibility: allow keyboard focus and announce purpose
    c.setAttribute('tabindex', '0');
    c.setAttribute('role', 'button');
    c.setAttribute('aria-label', id === 'hoyoplay-left' ? 'Left background (video)' : id === 'hoyoplay-mid' ? 'Middle background' : 'Right background');
    return c;
  }

  // Track which circle is currently selected (0=left,1=mid,2=right)
  let selectedCircleIndex = 0;

  // Create three circles (left, middle, right) to support up to 3 backgrounds per side
  const leftCircle = makeCircle('hoyoplay-left');
  const midCircle = makeCircle('hoyoplay-mid');
  const rightCircle = makeCircle('hoyoplay-right');

  // Example background keys (lookups will use cache + prefetch)
  const leftBgKey = 'left-default';
  const rightBgKey = 'right-default';

  // Helper to get nth cached URL for a key (graceful fallback to first available)
  function getCachedUrlByIndex(key, idx) {
    const list = getCachedBackgrounds(key);
    if (!list || !list.length) return null;
    return list[idx] || list[0] || null;
  }

  // By default, select the center/right-most (index 1 if present)
  function updateCircles(selectedIndex) {
    selectedCircleIndex = selectedIndex;
    // selectedIndex: 0=left,1=mid,2=right
    const circles = [leftCircle, midCircle, rightCircle];
    circles.forEach((c, i) => {
      if (i === selectedIndex) {
        c.classList.add('selected');
        c.style.background = 'rgba(255,255,255,0.95)';
      } else {
        c.classList.remove('selected');
        c.style.background = 'rgba(180, 180, 180, 0.59)';
      }
    });
    // Style the Version Highlights button when middle/right is selected
    try {
      const btn = document.getElementById('customNewsButton');
      if (btn) {
        if (selectedIndex === 1 || selectedIndex === 2) {
          // Only change text color and border color per request
          btn.style.color = '#2f469e';
          btn.style.borderColor = '#2f469e';
        } else {
          // revert to default - clear inline overrides so CSS can control it
          btn.style.color = '';
          btn.style.borderColor = '';
        }
      }
    } catch (e) { /* ignore */ }
  }
  // Default to the left (video+image1) as selected
  updateCircles(0);

  // Add circles to overlay (left -> mid -> right)
  overlay.appendChild(leftCircle);
  overlay.appendChild(midCircle);
  overlay.appendChild(rightCircle);
  document.body.appendChild(overlay);
  // Set width according to circle count (3 => 100px, else 80px)
  updateOverlayWidth();

  // Hide circles when their corresponding cached background is missing.
  // This allows the selector to gracefully adapt if GitHub Action didn't produce image files.
  function updateCircleVisibility() {
    try {
      const leftList = getCachedBackgrounds(leftBgKey) || [];
      const rightList = getCachedBackgrounds(rightBgKey) || [];
      // Check actual index presence; do NOT fallback to index 0 here
      const hasLeft = leftList.length >= 1;      // left uses index 0
      const hasMid = rightList.length >= 1;      // mid uses right index 0
      const hasRight = rightList.length >= 2;    // right uses right index 1

      leftCircle.style.display = hasLeft ? 'block' : 'none';
      midCircle.style.display = hasMid ? 'block' : 'none';
      rightCircle.style.display = hasRight ? 'block' : 'none';

      // Recalc overlay width when visibility changes
      updateOverlayWidth();

      // If the currently selected circle is hidden, pick a visible one (left > mid > right)
      const visible = [hasLeft, hasMid, hasRight];
      if (!visible[selectedCircleIndex]) {
        let newIndex = 0;
        if (hasLeft) newIndex = 0;
        else if (hasMid) newIndex = 1;
        else if (hasRight) newIndex = 2;
        // If none visible, keep selection but nothing will show
        if (visible[newIndex]) updateCircles(newIndex);
      }

      // Ensure video control visibility follows left availability and selection
      try {
        if (typeof hoyoVideoControl !== 'undefined' && hoyoVideoControl) {
          if (hasLeft && selectedCircleIndex === 0) {
            hoyoVideoControl.style.display = 'block';
          } else {
            hoyoVideoControl.style.display = 'none';
          }
        }
      } catch (e) { /* ignore */ }
    } catch (e) { /* ignore */ }
  }

  // Optional: actively probe URLs to handle 404/redirects
  async function validateCircleUrls() {
    const rightList = getCachedBackgrounds(rightBgKey) || [];
    // Helper that resolves to boolean load success
    function probe(url) {
      return new Promise(res => {
        if (!url) return res(false);
        const img = new Image();
        let done = false;
        const t = setTimeout(() => { if (!done) { done = true; res(false); } }, 4000);
        img.onload = () => { if (!done) { done = true; clearTimeout(t); res(true); } };
        img.onerror = () => { if (!done) { done = true; clearTimeout(t); res(false); } };
        img.src = url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now();
      });
    }

    const midUrl = rightList[0];
    const rightUrl = rightList[1];
    const [midOk, rightOk] = await Promise.all([probe(midUrl), probe(rightUrl)]);

    // If a URL fails, remove it from cache so updateCircleVisibility hides the circle
    const rightKey = rightBgKey;
    const current = getCachedBackgrounds(rightKey) || [];
    let changed = false;
    if (current[0] && !midOk) { current.splice(0, 1); changed = true; }
    if (current[1] && !rightOk) {
      // If index 0 was removed above, right is now at index 0; ensure we remove the correct one
      const newList = current.filter((_, idx) => (midOk ? idx !== 1 : idx !== 0));
      if (newList.length !== current.length) { changed = true; current.length = 0; current.push(...newList); }
    }
    if (changed) setCachedBackgrounds(rightKey, current);

    updateCircleVisibility();
  }

  // Kick initial visibility and then validate URLs one time at startup
  updateCircleVisibility();
  try {
    if (!window.__hoyoplayValidated) {
      window.__hoyoplayValidated = true;
      validateCircleUrls().catch(() => {});
    }
  } catch (e) {}
  try { window._hoyoplayValidateCircles = validateCircleUrls; } catch (e) {}

  // Expose a hook so refresh routines can trigger visibility recalculation
  try { window._hoyoplayUpdateCircles = updateCircleVisibility; } catch (e) {}

  // --- Video overlay + control (for left circle) -----------------
  let hoyoVideoOverlay = null;
  let hoyoVideo = null;
  let hoyoVideoControl = null;
  let hoyoVideoPlaying = false;
  const HOYO_VIDEO_SRC = 'https://raw.githubusercontent.com/GID0317/Cultivation-HoYoPlay-Theme/refs/heads/main/Background/video1.webm';
  // Foreground image shown on top of video (matches HoYoPlay behavior)
  let hoyoVideoOverlayImg = null;
  const HOYO_OVERLAY_IMG_SRC = 'https://raw.githubusercontent.com/GID0317/Cultivation-HoYoPlay-Theme/refs/heads/main/Background/overlay1.webp';

  function ensureVideoElements() {
    if (hoyoVideoOverlay) return;
    const app = document.querySelector('.App') || document.body;

    hoyoVideoOverlay = document.createElement('div');
    hoyoVideoOverlay.id = 'hoyoplay-video-overlay';
    Object.assign(hoyoVideoOverlay.style, {
      position: 'absolute', top: '0', left: '0', right: '0', bottom: '0',
      width: '100%', height: '100%', zIndex: '0', pointerEvents: 'none', overflow: 'hidden',
      opacity: '0', transition: 'opacity 0.22s cubic-bezier(.4,0,.2,1)'
    });

    hoyoVideo = document.createElement('video');
    hoyoVideo.id = 'hoyoplay-video';
    hoyoVideo.src = HOYO_VIDEO_SRC;
    hoyoVideo.muted = true;
    hoyoVideo.loop = true;
    hoyoVideo.preload = 'auto';
  // Enhance compatibility
  try { hoyoVideo.setAttribute('playsinline', ''); hoyoVideo.setAttribute('webkit-playsinline', ''); } catch (e) {}
  try { hoyoVideo.crossOrigin = 'anonymous'; } catch (e) {}
    Object.assign(hoyoVideo.style, { width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' });
    hoyoVideoOverlay.appendChild(hoyoVideo);

    // Add foreground image above the video
    try { if (typeof prefetchImage === 'function') prefetchImage(HOYO_OVERLAY_IMG_SRC); } catch (e) {}
    hoyoVideoOverlayImg = document.createElement('img');
    hoyoVideoOverlayImg.id = 'hoyoplay-video-overlay-img';
    hoyoVideoOverlayImg.src = HOYO_OVERLAY_IMG_SRC;
    Object.assign(hoyoVideoOverlayImg.style, {
      position: 'absolute', top: '0', left: '0', right: '0', bottom: '0',
      width: '100%', height: '100%', objectFit: 'cover',
      pointerEvents: 'none', userSelect: 'none',
      opacity: '0', transition: 'opacity 0.22s cubic-bezier(.4,0,.2,1)'
    });
    // Append after video to ensure it paints above
    hoyoVideoOverlay.appendChild(hoyoVideoOverlayImg);

  if (app.firstChild) app.insertBefore(hoyoVideoOverlay, app.firstChild); else app.appendChild(hoyoVideoOverlay);
  // Ensure the app is a positioning context for absolute children
  try {
    const cs = window.getComputedStyle(app);
    if (cs.position === 'static') app.style.position = 'relative';
  } catch (e) { /* ignore */ }

    // Elevate key UI so it stays above the overlay (including BottomSection/footer)
    try {
      // Base elevation for common UI
      const baseSelectors = [
        '#title', '#settingsBtn', '#minBtn', '#closeBtn', '#serverLaunch', '#officialPlay',
        '.TopButton', '.Menu', '#leftBar'
      ];
      baseSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
          if (!el.style.zIndex || isNaN(parseInt(el.style.zIndex, 10))) el.style.zIndex = '2';
        });
      });

      // Ensure News stack above Bottom for interactions
      const newsSelectors = ['.NewsSection', '#newsContainer', '#newsTabsContainer', '#newsContent', '#customNewsButton'];
      newsSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
          el.style.zIndex = '3';
        });
      });

      // Push Bottom/footer lower so it won't block News
      const bottomSelectors = ['.BottomSection', '#BottomSection', '#bottomSection', '.Footer', '#footer'];
      bottomSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
          el.style.zIndex = '1';
        });
      });

      // Prepare Mods containers with higher stacking (reinforced when active)
      document.querySelectorAll('.Mods, .Menu.ModMenu, #menuContainer.ModMenu').forEach(el => {
        if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
        el.style.zIndex = '1000';
      });
    } catch (e) { /* ignore */ }

    // Control button placed near Version Highlights button
    hoyoVideoControl = document.createElement('button');
    hoyoVideoControl.id = 'hoyoplay-video-control';
    // Use class-based styling defined in CSS
    hoyoVideoControl.className = 'hoyoplay-video-control hidden';
  // inner icon element using Segoe Fluent glyphs (play/pause)
  const icon = document.createElement('span');
  icon.className = 'hp-icon';
  // Play glyph: \uF5B0, Pause glyph: \uF8AE (Segoe Fluent / MDL2 glyphs)
  icon.textContent = '\uF5B0';
  hoyoVideoControl.appendChild(icon);
  // Append control under the app root so absolute positioning is relative to it
  app.appendChild(hoyoVideoControl);

    function positionControl() {
      const appEl = document.querySelector('.App') || document.body;
      const ref = document.getElementById('customNewsButton');
      const appRect = appEl.getBoundingClientRect();
      if (ref) {
        const r = ref.getBoundingClientRect();
        // Keep vertical centering with the button, but fix left to requested value
        const topPx = (r.top - appRect.top) + (r.height - 40) / 2;
        const leftPx = 255.662;
        hoyoVideoControl.style.top = topPx + 'px';
        hoyoVideoControl.style.left = leftPx + 'px';
        hoyoVideoControl.style.right = '';
      } else {
        // Fallback: pin to top-right inside the app
        hoyoVideoControl.style.top = '12px';
        hoyoVideoControl.style.right = '12px';
        hoyoVideoControl.style.left = '';
      }
    }
    positionControl();
    window.addEventListener('resize', positionControl);

    hoyoVideoControl.addEventListener('click', () => {
      if (!hoyoVideo) return;
      if (hoyoVideoPlaying) {
        // Pause video and fall back to image1 (left circle)
        hoyoVideo.pause();
        try { hoyoVideo.currentTime = 0; } catch (e) {}
        hoyoVideoPlaying = false;
        try {
          // Use image1 specifically (left circle's fallback image)
          const url = getCachedUrlByIndex(leftBgKey, 0) || getCachedUrlByIndex(rightBgKey, 0) || getCachedUrlByIndex(rightBgKey, 1);
          if (url) setCustomBackground(url);
        } catch (e) {}
        // Reflect selection to the left circle and hide only overlay (keep control visible)
        try { updateCircles(0); } catch (e) {}
        try { showVideoOverlay(false, { hideControl: false }); } catch (e) {}
        if (hoyoVideoControl) {
          const ic = hoyoVideoControl.querySelector('.hp-icon');
          if (ic) { ic.textContent = '\uF5B0'; }
        }
      } else {
        // Resume: fade overlay in then play
        try { showVideoOverlay(true); } catch (e) {}
        try { hoyoVideo.currentTime = 0; } catch (e) {}
        hoyoVideo.play().catch(() => {});
        hoyoVideoPlaying = true;
        if (hoyoVideoControl) {
          const ic = hoyoVideoControl.querySelector('.hp-icon');
          if (ic) { ic.textContent = '\uF8AE'; }
        }
      }
    });
  }

  function showVideoOverlay(show, opts = {}) {
    if (!hoyoVideoOverlay || !hoyoVideoControl) ensureVideoElements();
    if (!hoyoVideoOverlay) return;
    const hideControl = !!opts.hideControl;
    // Helper: reflect playing state on the document for CSS hooks
    const setPlayingClass = (on) => {
      try { document.body.classList.toggle('hoyoplay-video-playing', !!on); } catch (_) {}
    };
    if (show) {
      hoyoVideoOverlay.style.opacity = '1';
      if (hoyoVideoControl) hoyoVideoControl.style.display = 'block';
      if (hoyoVideoOverlayImg) hoyoVideoOverlayImg.style.opacity = '1';
      setPlayingClass(true);
    } else {
      if (hoyoVideo) { try { hoyoVideo.pause(); } catch (e) {} }
      if (hoyoVideo) { try { hoyoVideo.currentTime = 0; } catch (e) {} }
      hoyoVideoPlaying = false;
      if (hoyoVideoOverlay) hoyoVideoOverlay.style.opacity = '0';
      if (hoyoVideoOverlayImg) hoyoVideoOverlayImg.style.opacity = '0';
      setPlayingClass(false);
      if (hoyoVideoControl) {
        if (hideControl) {
          hoyoVideoControl.style.display = 'none';
        } else {
          hoyoVideoControl.style.display = 'block';
        }
        // Ensure the icon shows the Play glyph instead of plain text
        const ic = hoyoVideoControl.querySelector('.hp-icon');
        if (ic) {
          ic.textContent = '\uF5B0'; // Play glyph
          ic.classList.remove('pause');
          ic.classList.add('play');
        }
      }
    }
  }

  // Prepare video UI for default-left selection: show control (paused), hide overlay with fade
  try {
    ensureVideoElements();
    if (hoyoVideoControl) {
      hoyoVideoControl.classList.remove('hidden');
      const ic = hoyoVideoControl.querySelector('.hp-icon');
      if (ic) { ic.classList.remove('pause'); ic.classList.add('play'); }
    }
    if (hoyoVideoOverlay) hoyoVideoOverlay.style.opacity = '0';
    hoyoVideoPlaying = false;
  } catch (e) {}

// Selection logic + background change on hover
// Map circle hover to index 0/1/2 (left/mid/right). Try left key first, then right as fallback.
leftCircle.addEventListener('mouseenter', () => {
  if (isUiOverlayActive()) return; // disabled when Mods/menu overlays are active
  updateCircles(0);
  const url = getCachedUrlByIndex(leftBgKey, 0) || getCachedUrlByIndex(rightBgKey, 0);
  if (url) setCustomBackground(url);
  // On left: keep control visible; overlay shown only if currently playing
  if (typeof hoyoVideoPlaying !== 'undefined' && hoyoVideoPlaying) {
    showVideoOverlay(true);
  } else {
    showVideoOverlay(false, { hideControl: false });
  }
});
midCircle.addEventListener('mouseenter', () => {
  if (isUiOverlayActive()) return; // disabled when Mods/menu overlays are active
  updateCircles(1);
  // Middle circle should use image2 (right key index 0)
  const url = getCachedUrlByIndex(rightBgKey, 0) || getCachedUrlByIndex(leftBgKey, 0);
  if (url) setCustomBackground(url);
  showVideoOverlay(false, { hideControl: true });
});
rightCircle.addEventListener('mouseenter', () => {
  if (isUiOverlayActive()) return; // disabled when Mods/menu overlays are active
  updateCircles(2);
  // Right circle should use image3 (right key index 1)
  const url = getCachedUrlByIndex(rightBgKey, 1) || getCachedUrlByIndex(rightBgKey, 0) || getCachedUrlByIndex(leftBgKey, 0);
  if (url) setCustomBackground(url);
  showVideoOverlay(false, { hideControl: true });
});

  // Show/hide overlay and shadow on mouse movement near top center
  let isVisible = false;
  document.addEventListener('mousemove', function(e) {
    if (isUiOverlayActive()) {
      // Force hide when Mods is open
      overlay.style.top = '0px';
      overlay.style.opacity = '0';
      shadowBg.style.opacity = '0';
      isVisible = false;
      return;
    }
    const y = e.clientY;
    const x = e.clientX;
    const winW = window.innerWidth;
    // Only show if mouse is near top (e.g. < 80px) and near center (within 60px of center)
    if (y < 80 && Math.abs(x - winW/2) < 60) {
      if (!isVisible) {
        overlay.style.top = '30px';
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

  // Watch for Mods appearing/disappearing (throttled)
  let __modsScheduled = null;
  const scheduleModsUpdate = () => {
    if (__modsScheduled) return;
    __modsScheduled = requestAnimationFrame(() => {
      __modsScheduled = null;
      try { updateModsState(); } catch (_) {}
    });
  };
  const modsObserver = new MutationObserver(() => scheduleModsUpdate());
  modsObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
  // Initial state
  updateModsState();

  // Re-layout backdrop panels on resize; only when visible
  window.addEventListener('resize', () => {
    try {
      if (dialogBackdrop && dialogBackdrop.style.display !== 'none') {
        layoutBackdropPanels();
      }
    } catch (e) {}
  });

  // --- Tab navigation management -----------------------------------------
  function setTabDisabled(el, disabled) {
    if (!el) return;
    try {
      if (disabled) {
        if (!el.hasAttribute('data-prev-tabindex')) {
          el.setAttribute('data-prev-tabindex', el.getAttribute('tabindex') ?? '');
        }
        el.setAttribute('tabindex', '-1');
      } else {
        if (el.hasAttribute('data-prev-tabindex')) {
          const prev = el.getAttribute('data-prev-tabindex');
          if (prev === '' || prev === null) {
            el.removeAttribute('tabindex');
          } else {
            el.setAttribute('tabindex', prev);
          }
          el.removeAttribute('data-prev-tabindex');
        } else if (el.getAttribute('tabindex') === '-1') {
          // If we set it earlier but no prev recorded, just remove
          el.removeAttribute('tabindex');
        }
      }
    } catch (_) {}
  }

  function getFocusableDescendants(root) {
    if (!root) return [];
    const selector = [
      'a[href]',
      'area[href]',
      'button',
      'input',
      'select',
      'textarea',
      'iframe',
      'summary',
      // Elements explicitly tabbable
      '[tabindex]:not([tabindex="-1"])',
      // Contenteditable regions
      '[contenteditable]',
      '[contenteditable="true"]',
      // Common ARIA interactive roles (we’ll force tabindex off even if missing)
      '[role="button"]', '[role="link"]', '[role="checkbox"]', '[role="radio"]', '[role="switch"]',
      '[role="tab"]', '[role="menuitem"]', '[role="option"]', '[role="combobox"]',
      '[role="textbox"]', '[role="searchbox"]'
    ].join(',');
    return Array.from(root.querySelectorAll(selector));
  }

  function setGroupTabDisabled(root, disabled) {
    const nodes = Array.isArray(root) ? root : [root];
    nodes.forEach(r => {
      if (!r) return;
      setTabDisabled(r, disabled);
      getFocusableDescendants(r).forEach(el => setTabDisabled(el, disabled));
    });
  }

  function updateTabStops(state = {}) {
    // Re-evaluate modsActive defensively in case caller is stale
    const { modsActive: modsActiveArg = undefined } = state;
    const modsActive = typeof modsActiveArg === 'boolean' ? modsActiveArg : isModsActive();
    // Main page: always disable these from tab order
    try {
      const newsBtn = document.getElementById('customNewsButton');
      const videoBtn = document.getElementById('hoyoplay-video-control');
  if (newsBtn) setTabDisabled(newsBtn, true);
  if (videoBtn) setTabDisabled(videoBtn, true);

  // Also disable main page IP/Port inputs from tab order
  const ip = document.getElementById('ip');
  const port = document.getElementById('port');
  if (ip) setTabDisabled(ip, true);
  if (port) setTabDisabled(port, true);

      // Disable News content regardless of DOM variant/casing
      const newsRoots = Array.from(document.querySelectorAll([
        '#newsContent',
        '.NewsContent',
        '.newsContent',
        '#newsContainer',
        '.NewsSection'
      ].join(',')));
      if (newsRoots.length) {
        setGroupTabDisabled(newsRoots, true);
        // Also force-disable typical table nodes inside News to avoid tbody/tr/td being tabbable
        newsRoots.forEach(root => {
          const tableNodes = root.querySelectorAll('table, tbody, thead, tfoot, tr, th, td');
          tableNodes.forEach(node => setTabDisabled(node, true));
        });
      }
    } catch (_) {}

    // Mods page: when active, disable search and mod list from tab nav; restore when not
    try {
      // Identify likely Mods roots (for scoping) and target areas (search + lists)
  const modsRoots = Array.from(document.querySelectorAll('.Mods, .mods, .Menu.ModMenu, .menu.modmenu, #menuContainer.ModMenu, #menuContainer.modmenu, #menuContainer .Mods, #menuContainer .mods'));
      // Helper: check containment within any Mods root
      const withinAnyRoot = (el) => {
        if (!el) return false;
        if (!modsRoots.length) return true; // fallback: if we couldn't find a root, allow global match
        return modsRoots.some(r => r.contains(el));
      };

      // Search fields can vary; cover common patterns
      const searchCandidates = Array.from(document.querySelectorAll([
        'input[type="search"]',
        'input[type="text"]',
        '.TextInput',
        '.SearchInput',
        '[role="searchbox"]',
        'input[placeholder*="search" i]'
      ].join(','))).filter(withinAnyRoot);

      // Mod list containers (cover a few variants)
      const listCandidates = Array.from(document.querySelectorAll(
        '.ModList, .modlist, .ModListInner, .modlistinner, .ModDownloadList, #ModList, .Mods .List, .ModsList'
      )).filter(withinAnyRoot);

      const targets = [...searchCandidates, ...listCandidates];
      if (targets.length) setGroupTabDisabled(targets, !!modsActive);
      // When leaving Mods, restore any items we disabled
      if (!modsActive && targets.length) targets.forEach(t => setGroupTabDisabled(t, false));
    } catch (_) {}
  }

  // Apply tab stop rules initially as well
  try { updateTabStops({ modsActive: isModsActive() }); } catch (e) {}

  // Re-apply tab disabling for IP/Port and News when DOM changes dynamically
  try {
    const reapplyTabDisables = () => {
      try { updateTabStops({}); } catch (_) {}
    };
    const tabObserver = new MutationObserver(reapplyTabDisables);
    tabObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
  } catch (_) {}
})();

// Fast cross-fade state for wallpaper-only transitions
let __BG_FADE_STATE = { overlay: null, timer: null, current: null, duration: 180 };

function setCustomBackground(url) {
  const appElement = document.querySelector('.App');
  if (!appElement) return;

  // Skip if same URL as already applied
  if (__BG_FADE_STATE.current && __BG_FADE_STATE.current === url) return;

  // Create or get the fade overlay
  let fadeOverlay = __BG_FADE_STATE.overlay || document.getElementById('bg-fade-overlay');
  if (!fadeOverlay) {
    fadeOverlay = document.createElement('div');
    fadeOverlay.id = 'bg-fade-overlay';
    fadeOverlay.style.position = 'absolute';
    fadeOverlay.style.top = '0';
    fadeOverlay.style.left = '0';
    fadeOverlay.style.right = '0';
    fadeOverlay.style.bottom = '0';
    fadeOverlay.style.width = '100%';
    fadeOverlay.style.height = '100%';
    // Place overlay before other children so they paint above it
    fadeOverlay.style.zIndex = '0';
    fadeOverlay.style.pointerEvents = 'none';
    fadeOverlay.style.transition = 'opacity 0.22s cubic-bezier(.4,0,.2,1)';
    fadeOverlay.style.willChange = 'opacity';
    fadeOverlay.style.opacity = '0';
    fadeOverlay.style.backgroundSize = 'cover';
    fadeOverlay.style.backgroundPosition = 'center';
    fadeOverlay.style.backgroundRepeat = 'no-repeat';
    // Ensure .App is a positioning context and insert overlay first so other content stays above
    appElement.style.position = 'relative';
    if (appElement.firstChild) {
      appElement.insertBefore(fadeOverlay, appElement.firstChild);
    } else {
      appElement.appendChild(fadeOverlay);
    }
    __BG_FADE_STATE.overlay = fadeOverlay;
  }

  // Ensure key UI elements render above the overlay (targeted, non-invasive)
  try {
    const elevateSelectors = [
      '#title',
      '#settingsBtn',
      '#minBtn',
      '#closeBtn',
      '#serverLaunch',
      '#officialPlay',
      '.TopButton',
      '.Menu',
      '.Mods',
      '.NewsSection',
      '#newsContainer',
      '#newsTabsContainer',
      '#newsContent',
      '#customNewsButton',
      '#leftBar'
    ];
    elevateSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (window.getComputedStyle(el).position === 'static') {
          el.style.position = 'relative';
        }
        // A small positive z-index keeps these above the overlay (z=0)
        if (!el.style.zIndex || parseInt(el.style.zIndex, 10) <= 0 || isNaN(parseInt(el.style.zIndex, 10))) {
          el.style.zIndex = '2';
        }
      });
    });
  } catch (e) { /* ignore */ }

  // Preload image, then cross-fade quickly
  const img = new Image();
  const apply = () => {
    // Cancel any running timer
    if (__BG_FADE_STATE.timer) {
      clearTimeout(__BG_FADE_STATE.timer);
      __BG_FADE_STATE.timer = null;
    }
    fadeOverlay.style.backgroundImage = `url("${url}")`;
    // Fade in overlay quickly
    requestAnimationFrame(() => {
      // Crossfade: keep old background visible; fade in the new image on the overlay
      fadeOverlay.style.opacity = '1';
    });
    __BG_FADE_STATE.timer = setTimeout(() => {
      appElement.style.background = `url("${url}") center/cover no-repeat fixed`;
      fadeOverlay.style.opacity = '0';
      __BG_FADE_STATE.current = url;
      __BG_FADE_STATE.timer = null;
    }, __BG_FADE_STATE.duration);
  };
  img.onload = apply;
  img.onerror = apply; // even if it errors, attempt to set; browser may still cache/render
  img.src = url;
}

// Make it available globally for console testing
window.setCustomBackground = setCustomBackground;

// --- HoYoPlay background cache & prefetch helpers ----------------------
const HOYO_CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

function setCachedBackgrounds(key, urls) {
  const payload = { ts: Date.now(), urls };
  try { localStorage.setItem(`hoyoplay-cache-${key}`, JSON.stringify(payload)); } catch (e) { console.warn('Failed to set hoyoplay cache', e); }
}

function getCachedBackgrounds(key) {
  try {
    const raw = localStorage.getItem(`hoyoplay-cache-${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.ts || !parsed.urls) return null;
    if (Date.now() - parsed.ts > HOYO_CACHE_TTL) return null;
    return parsed.urls;
  } catch (e) { console.warn('Failed to read hoyoplay cache', e); return null; }
}

function getCachedBackgroundUrl(key) {
  const list = getCachedBackgrounds(key);
  if (!list || !list.length) return null;
  return list[0];
}

function prefetchImage(url) {
  try {
    const i = new Image();
    i.src = url;
  } catch (e) { /* ignore */ }
}

// Minimal fetcher that tries to load an array of example backgrounds
// (Replace with real API fetch via a proxy if you can run one).
async function refreshHoYoPlayCache(key, exampleUrls) {
  if (!key || !exampleUrls || !exampleUrls.length) return null;
  // Try to validate reachable URL by preloading first reachable
  const reachable = [];
  for (const u of exampleUrls) {
    // Simple attempt: create Image and wait for load/error with timeout
    const p = new Promise((res) => {
      const img = new Image();
      let done = false;
      const t = setTimeout(() => { if (!done) { done = true; res(null); } }, 3000);
      img.onload = () => { if (!done) { done = true; clearTimeout(t); res(u); } };
      img.onerror = () => { if (!done) { done = true; clearTimeout(t); res(null); } };
      img.src = u;
    });
    const ok = await p;
    if (ok) reachable.push(ok);
  }

  if (reachable.length) {
    setCachedBackgrounds(key, reachable);
    // Prefetch first two
    prefetchImage(reachable[0]);
    if (reachable[1]) prefetchImage(reachable[1]);
    return reachable;
  }
  return null;
}

// Console helper to refresh caches for selector usage
window.hoyoplayRefresh = async function() {
  console.log('[hoyoplayRefresh] Using GitHub-hosted placeholder mapping: Left=image1, Mid=image2, Right=image3');

  // Mapping:
  // - Left key (index 0): image1 (used with video overlay)
  // - Right key (index 0): image2 (middle circle)
  // - Right key (index 1): image3 (right circle)
  const leftExamples = [
    'https://raw.githubusercontent.com/GID0317/Cultivation-HoYoPlay-Theme/refs/heads/main/Background/image1.webp'
  ];
  const rightExamples = [
    'https://raw.githubusercontent.com/GID0317/Cultivation-HoYoPlay-Theme/refs/heads/main/Background/image2.webp',
    'https://raw.githubusercontent.com/GID0317/Cultivation-HoYoPlay-Theme/refs/heads/main/Background/image3.webp'
  ];

  const l = await refreshHoYoPlayCache('left-default', leftExamples);
  const r = await refreshHoYoPlayCache('right-default', rightExamples);
  console.log('[hoyoplayRefresh] fallback-only done', { left: !!l, right: !!r });
  try { if (window && typeof window._hoyoplayUpdateCircles === 'function') window._hoyoplayUpdateCircles(); } catch (e) {}
  return { left: l, right: r };
};


// Ensure the cache is populated on launcher/theme startup
function _runHoyoplayRefreshOnStartup() {
  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.hoyoplayRefresh().catch(()=>{});
      });
    } else {
      // DOM already ready
      window.hoyoplayRefresh().catch(()=>{});
    }
  } catch (e) { /* ignore */ }
}

_runHoyoplayRefreshOnStartup();


// Also check periodically in case menu is recreated
//setInterval(injectCustomOptionSection, 1000);

// Auto-apply cached background after refresh (prefer left-default image1, then right)
async function _applyCachedBackgroundOnStartup() {
  try {
    const res = await window.hoyoplayRefresh();
    // res.left/res.right are arrays returned by refreshHoYoPlayCache
    const left = res && res.left && res.left[0];
    const right = res && res.right && res.right[0];
    const toApply = left || right;
    if (toApply) {
      // small delay to ensure .App exists
      setTimeout(() => {
        try { window.setCustomBackground(toApply); } catch (e) {}
        try {
          // keep control visible on startup in left-selected state
          if (typeof ensureVideoElements === 'function') ensureVideoElements();
          if (typeof updateCircles === 'function') updateCircles(0);
          try { if (window && typeof window._hoyoplayUpdateCircles === 'function') window._hoyoplayUpdateCircles(); } catch (e) {}
          if (typeof showVideoOverlay === 'function' && window) {
            // hide overlay but show control
            const btn = document.getElementById('hoyoplay-video-control');
            if (btn) btn.style.display = 'block';
            const ov = document.getElementById('hoyoplay-video-overlay');
            if (ov) ov.style.opacity = '0';
          }
        } catch (e) {}
      }, 180);
    }
  } catch (e) { /* ignore */ }
}

_applyCachedBackgroundOnStartup();
