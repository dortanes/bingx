window.addEventListener("DOMContentLoaded", () => {
  if (window.location.href === "https://www.bing.com/") {
    document.body.style.display = "none";
    window.location.href =
      "https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx&wlexpsignin=1";
    return;
  }

  const style = document.createElement("style");
  style.innerHTML = `
    html, body {
      overflow-x: hidden !important;
    }
    
    #b_header {
      display: none !important;
    }
  
    .fade {
      display: none !important;
    }

    #b_content, #b_footer {
      display: none !important;
    }

    .b_wlcmCont {
      display: none;
    }
  `;
  document.querySelector("body").appendChild(style);

  setTimeout(() => {
    document.querySelector(".b_wlcmCont").remove();
  }, 500);
});
