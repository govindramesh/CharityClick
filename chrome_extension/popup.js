// add an event listener to the checkbox with the id focusToggle
document.getElementById("focusToggle").addEventListener("change", function () {
  // if the checkbox is checked, set the background page's focusMode variable to true
  chrome.runtime.sendMessage({ checked: this.checked });

  // save in session storage
  chrome.storage.local.set(
    { focusMode: this.checked ? "true" : "false" },
    function () {}
  );
});

chrome.storage.local.get(
  {
    focusMode: false,
  },
  function (result) {
    if (result.focusMode) {
      // if it is, check the checkbox
      document.getElementById("focusToggle").checked = true;

      var bg = document.getElementById("bg");

      bg.style.backgroundColor = rgb(32, 27, 126);
      chrome.runtime.sendMessage({ checked: true });
    }
  }
);

// check if focus mode is enabled

//if (localStorage.getItem("focusMode") === "true") {
