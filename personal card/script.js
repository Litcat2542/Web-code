/* =====================================================================
   个人名片交互脚本
   - 点击 / 键盘切换卡片正反面
   - 点击邮箱一键复制
   ===================================================================== */
(function () {
  "use strict";

  const card = document.getElementById("businessCard");

  /* ---------- 翻转状态 ---------- */
  function flip() {
    card.classList.toggle("flipped");
  }

  function flipFront() {
    card.classList.remove("flipped");
  }

  /* 点击卡片翻转（忽略点击链接/按钮本身） */
  card.addEventListener("click", function (e) {
    const interactive = e.target.closest("a, button");
    if (interactive) return; // 交给链接自身处理
    flip();
  });

  /* 键盘操作：Space / Enter 翻转（卡片聚焦时），Esc 全局返回正面 */
  card.addEventListener("keydown", function (e) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      flip();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") flipFront();
  });

  /* 视口缩小时自动回到正面，避免背面被截断 */
  window.addEventListener("resize", function () {
    if (window.innerWidth <= 540) flipFront();
  });

  /* ---------- 邮箱一键复制 ---------- */
  const copyLinks = document.querySelectorAll("a[data-copy]");
  copyLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const text = link.getAttribute("data-copy");

      const done = function () {
        const box = link.textContent;
        link.textContent = "已复制 ✓";
        link.classList.add("copied");
        setTimeout(function () {
          link.textContent = box;
          link.classList.remove("copied");
        }, 1400);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          fallbackCopy(text, done);
        });
      } else {
        fallbackCopy(text, done);
      }
    });
  });

  /* 降级方案：旧浏览器使用 execCommand */
  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch (_) {
      window.prompt("复制失败，请手动复制：", text);
    }
    document.body.removeChild(ta);
  }

  /* ---------- 头像兜底 ---------- */
  const avatarImg = document.querySelector(".avatar-img");
  avatarImg.addEventListener("error", function () {
    // 头像加载失败时，用姓名首字代替
    avatarImg.style.display = "none";
    const fallback = document.createElement("span");
    fallback.className = "avatar-fallback";
    const nameEl = document.querySelector(".name");
    fallback.textContent = nameEl ? nameEl.textContent.trim().charAt(0) : "我";
    document.querySelector(".avatar").appendChild(fallback);
  });
})();