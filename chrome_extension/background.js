chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: "localhost:3000",
    });
  }
});

// when document ready check localstorage for focusMode and set toggleEnabled
let toggleEnabled = false;
chrome.storage.local.get(
  {
    focusMode: false,
  },
  function (result) {
    console.log("Value currently is " + result.focusMode);
    toggleEnabled = result.focusMode;
  }
);

chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
  console.log(msg);
  if (msg.checked) {
    toggleEnabled = true;
  } else {
    toggleEnabled = false;
  }
});

let amountPaid = 0;
let lastUpdated = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    run(tab);
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!tab.active || !changeInfo.url) return;
  // how to fetch tab url using activeInfo.tabid

  run(tab);
});

function run(tab) {
  console.log(tab.url);

  try {
    var url = new URL(tab.url);
  } catch (e) {
    return;
  }

  var domain = url.hostname;
  const websites = [
    "www.instagram.com",
    "www.youtube.com",
    "www.facebook.com",
    "www.reddit.com",
    "www.tiktok.com",
    "twitter.com",
    "www.snapchat.com",
  ];
  if (websites.includes(domain) && toggleEnabled) {
    //and toggle enabled
    const platform = platformFromDomain(domain);
    makeTransaction(platform).then((success) => {
      if (success) {
        if (lastUpdated) {
          // check if last updated is less than 10 seconds ago
          const now = new Date();
          const diff = now.getTime() - lastUpdated.getTime();
          if (diff < 10000) {
            return;
          }
        }

        lastUpdated = new Date();

        amountPaid += 25;
        chrome.action.setBadgeText({
          text: "$" + (amountPaid / 100).toFixed(2),
        });

        chrome.action.setBadgeBackgroundColor({ color: "green" });
        notifyDonation();
      }
    });
  }
}

function platformFromDomain(domain) {
  switch (domain) {
    case "www.instagram.com":
      return "instagram";
    case "www.youtube.com":
      return "youtube";
    case "www.facebook.com":
      return "facebook";
    case "www.reddit.com":
      return "reddit";
    case "www.tiktok.com":
      return "tiktok";
    case "twitter.com":
      return "twitter";
    case "www.snapchat.com":
      return "snapchat";
    default:
      return "other";
  }
}

function notifyDonation() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.scripting.insertCSS(
      {
        target: { tabId: tabId },
        files: ["./toastify.min.css"],
      },
      () => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            files: ["script.js"],
          },
          () => {}
        );
      }
    );
  });
}

async function makeTransaction(platform) {
  // make transaction
  // if transaction is successful, then toggle enabled

  const res = await fetch("http://localhost:3000/api/user/transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: 25,
      platform,
    }),
  });

  const data = await res.json();

  console.debug(data);
  return data.success;
}
