(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  var form = document.getElementById("intake-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    var data = new FormData(form);
    var payload = {
      _subject: "Lamakko questionnaire from " + (data.get("first") || "website"),
      _template: "table",
      _captcha: "false",
      Name: ((data.get("first") || "") + " " + (data.get("last") || "")).trim(),
      Email: data.get("email") || "",
      "Training for": data.get("goal") || "",
      Timeframe: data.get("timeframe") || "",
      "Training week": data.get("training") || "",
      Sleep: data.get("sleep") || "",
      Weights: data.get("weights") || "",
      Alcohol: data.get("alcohol") || "",
      Focus: data.get("focus") || "",
      "VO2 max": data.get("vo2") || "Not sure"
    };

    fetch("https://formsubmit.co/ajax/nnnic95@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Send failed");
        return response.json();
      })
      .then(function () {
        window.location.href = "thanks.html";
      })
      .catch(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        alert(
          "Could not send just now. Check your internet, then try again. The first time you use this, open nnnic95@gmail.com and confirm the FormSubmit activation email."
        );
      });
  });
})();
