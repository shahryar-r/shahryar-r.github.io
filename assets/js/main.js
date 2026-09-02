(function ($) {
  var $window = $(window),
    $body = $("body"),
    $wrapper = $("#wrapper"),
    $header = $("#header"),
    $nav = $("#nav"),
    $main = $("#main"),
    $intro = $("#intro"),
    $navPanelToggle,
    $navPanel,
    $navPanelInner;

  // Breakpoints.
  breakpoints({
    default: ["1681px", null],
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"],
  });

  /**
   * Applies parallax scrolling to an element's background image.
   * @return {jQuery} jQuery object.
   */
  $.fn._parallax = function (intensity) {
    var $window = $(window),
      $this = $(this);

    if (this.length == 0 || intensity === 0) return $this;

    if (this.length > 1) {
      for (var i = 0; i < this.length; i++) $(this[i])._parallax(intensity);

      return $this;
    }

    if (!intensity) intensity = 0.25;

    $this.each(function () {
      var $t = $(this),
        $bg = $('<div class="bg"></div>').appendTo($t),
        on,
        off;

      on = function () {
        $bg.removeClass("fixed").css("transform", "matrix(1,0,0,1,0,0)");

        $window.on("scroll._parallax", function () {
          var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

          $bg.css("transform", "matrix(1,0,0,1,0," + pos * intensity + ")");
        });
      };

      off = function () {
        $bg.addClass("fixed").css("transform", "none");

        $window.off("scroll._parallax");
      };

      // Disable parallax on ..
      if (
        browser.name == "ie" || // IE
        browser.name == "edge" || // Edge
        window.devicePixelRatio > 1 || // Retina/HiDPI (= poor performance)
        browser.mobile
      )
        // Mobile devices
        off();
      // Enable everywhere else.
      else {
        // breakpoints.on('>large', on);
        // breakpoints.on('<=large', off);
        off();
      }
    });

    $window
      .off("load._parallax resize._parallax")
      .on("load._parallax resize._parallax", function () {
        $window.trigger("scroll");
      });

    return $(this);
  };

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Scrolly.
  $(".scrolly").scrolly();

  // Background.
  $wrapper._parallax(1);

  // Nav Panel.

  // Toggle.
  $navPanelToggle = $(
    '<a href="#navPanel" id="navPanelToggle">Menu</a>',
  ).appendTo($wrapper);

  // Change toggle styling once we've scrolled past the intro.
  $intro.scrollex({
    bottom: "10%",
    enter: function () {
      $navPanelToggle.removeClass("alt");
    },
    leave: function () {
      $navPanelToggle.addClass("alt");
    },
  });

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("#navPanel .sublinks li.active").forEach((li) => {
      li.closest("ul.sublinks").parentElement.classList.add("open");
    });
    document.querySelectorAll(".submenu-toggle").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        const li = this.parentElement;

        document
          .querySelectorAll("#navPanel .links li.open")
          .forEach((item) => {
            if (item !== li) {
              item.classList.remove("open");
            }
          });

        li.classList.toggle("open");
      });
    });
  });

  // Panel.
  $navPanel = $(
    '<div id="navPanel">' +
      "<nav>" +
      "</nav>" +
      '<a href="#navPanel" class="close"></a>' +
      "</div>",
  )
    .appendTo($body)
    .panel({
      delay: 500,
      hideOnClick: true,
      hideOnSwipe: true,
      resetScroll: true,
      resetForms: true,
      side: "right",
      target: $body,
      visibleClass: "is-navPanel-visible",
    });

  // Get inner.
  $navPanelInner = $navPanel.children("nav");
  $nav.children().appendTo($navPanelInner);

  // Hack: Disable transitions on WP.
  if (browser.os == "wp" && browser.osVersion < 10)
    $navPanel.css("transition", "none");

  document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    if (!loginBtn) return;
    loginBtn.addEventListener("click", () => {
      const entered = document.getElementById("pw").value;
      const requiredPassword = loginBtn.dataset.password;
      const targetPage = loginBtn.dataset.target;

      if (entered === requiredPassword) {
        window.location.href = targetPage;
      } else {
        alert("Wrong password!");
      }
    });
  });

  // Intro.
  var $intro = $("#intro");

  if ($intro.length > 0) {
    // Hack: Fix flex min-height on IE.
    if (browser.name == "ie") {
      $window
        .on("resize.ie-intro-fix", function () {
          var h = $intro.height();

          if (h > $window.height()) $intro.css("height", "auto");
          else $intro.css("height", h);
        })
        .trigger("resize.ie-intro-fix");
    }

    // Hide intro on scroll (> small).
    breakpoints.on(">small", function () {
      $main.unscrollex();

      $main.scrollex({
        mode: "bottom",
        top: "25vh",
        bottom: "-50vh",
        enter: function () {
          $intro.addClass("hidden");
        },
        leave: function () {
          $intro.removeClass("hidden");
        },
      });
    });

    // Hide intro on scroll (<= small).
    breakpoints.on("<=small", function () {
      $main.unscrollex();

      $main.scrollex({
        mode: "middle",
        top: "15vh",
        bottom: "-15vh",
        enter: function () {
          $intro.addClass("hidden");
        },
        leave: function () {
          $intro.removeClass("hidden");
        },
      });
    });
  }

  // document.addEventListener("DOMContentLoaded", function () {
  //   document
  //     .querySelectorAll("#main > .posts-layout > .posts-wrapper > .posts > article .introduction button.title")
  //     .forEach(function (title) {
  //       title.addEventListener("click", function () {
  //         var article = title.closest("article");

  //         if (article) {
  //           article.classList.toggle("open");
  //         }
  //       });
  //     });
  // });

  // (function () {
  //   const layout = document.querySelector(".posts-layout");
  //   const list = layout && layout.querySelector(".posts");
  //   const detail = layout && layout.querySelector(".post-detail");
  //   if (!layout || !list || !detail) return;

  //   const articles = Array.from(list.querySelectorAll("article"));

  //   // Remember where each article's post-content originally lives, so we
  //   // can always find it again regardless of where it's currently sitting.
  //   articles.forEach((article) => {
  //     article._postContent = article.querySelector(".post-content");
  //   });

  //   const desktopQuery = window.matchMedia("(min-width: 981px)");
  //   const isDesktop = () => desktopQuery.matches;

  //   function homeAllContent() {
  //     articles.forEach((article) => {
  //       const content = article._postContent;
  //       if (content && content.parentElement !== article) {
  //         article.appendChild(content);
  //       }
  //     });
  //   }

  //   function render() {
  //     const open = articles.find((a) => a.classList.contains("open"));

  //     if (isDesktop()) {
  //       articles.forEach((article) => {
  //         const content = article._postContent;
  //         if (!content) return;
  //         if (article === open) {
  //           if (content.parentElement !== detail) {
  //             detail.innerHTML = "";

  //             const introduction = article.querySelector(".introduction");

  //             if (introduction) {
  //               const rightIntroduction = document.createElement("div");
  //               rightIntroduction.className = "introduction";

  //               const titleText = introduction.querySelector(".title-text");

  //               if (titleText) {
  //                 const title = document.createElement("div");
  //                 title.className = "title-text";
  //                 title.textContent = titleText.textContent.trim();

  //                 rightIntroduction.appendChild(title);
  //               }

  //               detail.appendChild(rightIntroduction);
  //             }

  //             detail.appendChild(content);
  //           }
  //         } else if (content.parentElement === detail) {
  //           article.appendChild(content);
  //         }
  //       });
  //     } else {
  //       homeAllContent();
  //     }
  //   }

  //   function selectArticle(article) {
  //     articles.forEach((a) => a.classList.remove("open"));
  //     article.classList.add("open");
  //     render();
  //     if (isDesktop()) {
  //       detail.scrollTop = 0;
  //     }
  //   }

  //   articles.forEach((article) => {
  //     const trigger = article.querySelector(".introduction");
  //     if (trigger) {
  //       trigger.addEventListener("click", () => selectArticle(article));
  //     }
  //   });

  //   // Re-run when crossing the desktop/mobile breakpoint so content ends
  //   // up in the right place either way.
  //   desktopQuery.addEventListener("change", render);

  //   // Default: open the first post.
  //   if (articles[0]) {
  //     articles[0].classList.add("open");
  //   }
  //   render();
  // })();

  (function () {
    const layout = document.querySelector(".posts-layout");
    const list = layout && layout.querySelector(".posts");
    const detail = layout && layout.querySelector(".post-detail");

    if (!layout || !list || !detail) return;

    const articles = Array.from(list.querySelectorAll("article"));

    articles.forEach((article) => {
      article._postContent = article.querySelector(".post-content");
    });

    const desktopQuery = window.matchMedia("(min-width: 981px)");

    function isDesktop() {
      return desktopQuery.matches;
    }

    function homeAllContent() {
      articles.forEach((article) => {
        const content = article._postContent;

        if (content && content.parentElement !== article) {
          article.appendChild(content);
        }
      });
    }

    function renderDesktop() {
      const open = articles.find((article) =>
        article.classList.contains("open"),
      );

      if (!open) {
        detail.innerHTML = "";
        return;
      }

      articles.forEach((article) => {
        const content = article._postContent;

        if (!content) return;

        if (article === open) {
          if (content.parentElement !== detail) {
            detail.innerHTML = "";

            const introduction = article.querySelector(".introduction");

            if (introduction) {
              const rightIntroduction = document.createElement("div");
              rightIntroduction.className = "introduction";

              const titleText = introduction.querySelector(".title-text");

              if (titleText) {
                const title = document.createElement("div");
                title.className = "title-text";
                title.textContent = titleText.textContent.trim();

                rightIntroduction.appendChild(title);
              }

              detail.appendChild(rightIntroduction);
            }

            detail.appendChild(content);
          }
        } else if (content.parentElement === detail) {
          article.appendChild(content);
        }
      });
    }

    function render() {
      if (isDesktop()) {
        renderDesktop();
      } else {
        homeAllContent();
      }
    }

    function mobileClick(article) {
      article.classList.toggle("open");
    }

    function desktopClick(article) {
      articles.forEach((a) => {
        a.classList.remove("open");
      });

      article.classList.add("open");

      renderDesktop();

      detail.scrollTop = 0;
    }

    articles.forEach((article) => {
      const trigger = article.querySelector(".introduction");

      if (!trigger) return;

      trigger.addEventListener("click", () => {
        if (isDesktop()) {
          desktopClick(article);
        } else {
          mobileClick(article);
        }
      });
    });

    desktopQuery.addEventListener("change", () => {
      if (isDesktop()) {
        articles.forEach((article) => {
          article.classList.remove("open");
        });

        if (articles[0]) {
          articles[0].classList.add("open");
        }

        renderDesktop();
      } else {
        homeAllContent();

        articles.forEach((article) => {
          article.classList.remove("open");
        });

        detail.innerHTML = "";
      }
    });

    // Initial state
    if (isDesktop()) {
      if (articles[0]) {
        articles[0].classList.add("open");
      }

      renderDesktop();
    } else {
      homeAllContent();
    }
  })();
})(jQuery);
