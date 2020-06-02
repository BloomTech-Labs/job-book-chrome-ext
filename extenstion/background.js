chrome.storage.local.get('token', (result) => {
  if (result.token) {
    chrome.contextMenus.create({
      id: 'logout',
      title: 'Logout',
      contexts: ['page'],
      visible: true,
    });
    chrome.contextMenus.create({
      id: 'login',
      title: 'Login',
      contexts: ['page'],
      visible: false,
    });
  } else {
    chrome.contextMenus.create({
      id: 'login',
      title: 'Login',
      contexts: ['page'],
      visible: true,
    });
    chrome.contextMenus.create({
      id: 'logout',
      title: 'Logout',
      contexts: ['page'],
      visible: false,
    });

  }
});

chrome.contextMenus.onClicked.addListener((info) => {

  if (info.menuItemId === 'logout') {
    chrome.storage.local.get('token', (result) => {
      if (result.token) {
        return signOut();
      } else {
        return chrome.contextMenus.update('logout', { visible: false }, () => {
          chrome.contextMenus.update('login', { visible: true })
        });
      }
    });
  }

  if (info.menuItemId === 'login') {
    chrome.storage.local.get('token', (result) => {
      if (!result.token) {
        return login();
      } else {
        return chrome.contextMenus.update('login', { visible: true }, () => {
          chrome.contextMenus.update('logout', { visible: false })
        });
      }
    });
  }
});

let timeout
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getToken') {
    return login();
  }

  if (request.type === 'Error') {
    const notificationOptions = {
      type: 'basic',
      iconUrl: './images/icon48.png',
      title: 'Job Save Error',
      message:
        'There was a problem saving your job post to the database. Please try again later.',
    };
    return chrome.notifications.create(notificationOptions);
  }

  if (request.type === 'tokenSet') {
    chrome.contextMenus.update('logout', { visible: true }, function () {
      chrome.contextMenus.update('login', { visible: false }, function () {
        return timeout
      })
    });
  }

  const timeout =
    setTimeout(() => {
      chrome.contextMenus.update('logout', { visible: false }, function () {
        chrome.contextMenus.update('login', { visible: true }, function () {
          chrome.storage.local.remove('token'), () => {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, { type: "hide" }, () => {
                chrome.storage.local.remove('login')
              })
            })
          }
        })
      })
    }, 3000000)

});

chrome.browserAction.onClicked.addListener(function () {
  chrome.storage.local.get('token', (request) => {
    if (request.token) {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'showForm' }, () => {
          console.log(chrome.runtime.lastError.message)
        })
      })
    } else {
      return login()
    }
  })
});

function login() {
  chrome.storage.local.set({ login: "true" }, () => {
    chrome.tabs.create({ url: 'https://www.savethisjob.com/dashboard' }, () => {
      chrome.tabs.onUpdated.addListener(() => {
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          const tabId = tabs[0].id;
          chrome.tabs.sendMessage(tabId, { type: 'getTokenFromStorage' }, () => {
            console.log(chrome.runtime.lastError.message)
          });
        });
      })
    })
  })
}

function signOut() {
  chrome.storage.local.remove('token', function () {
    chrome.runtime.lastError
    chrome.contextMenus.update('login', { visible: true }, function () {
      chrome.contextMenus.update('logout', { visible: false }, function () {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "hide" })
          clearTimeout(timeout)
          const notificationOptions = {
            type: 'basic',
            iconUrl: './images/icon48.png',
            title: 'Sign-Out Success!',
            message:
              'Your are now logged out',
          };
          chrome.notifications.create(notificationOptions);
          chrome.storage.local.remove('login')
        })
      })
    })
  });
}

chrome.tabs.onActivated.addListener(function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "tabActivated" }, () => {
      console.log(chrome.runtime.lastError)
    })
  })
})

