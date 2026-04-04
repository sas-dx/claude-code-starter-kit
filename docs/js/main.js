/* ==========================================================================
   Claude Code Starter Kit - ドキュメントサイト メインスクリプト
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. テーマ切替
     - localStorage で保存/復元
     - data-theme 属性を html 要素に設定
     - OS のカラースキーム設定を初期値として使用
     ------------------------------------------------------------------------ */

  function initTheme() {
    var html = document.documentElement;
    var themeToggle = document.querySelector('.theme-toggle');

    // 保存済みテーマまたは OS 設定から初期テーマを決定
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      html.setAttribute('data-theme', savedTheme);
    } else {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    // テーマ切替ボタンのアイコンを更新
    updateThemeIcon();

    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        var current = html.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon();
        updateMermaidTheme(next === 'dark');
      });
    }

    // OS のカラースキーム変更を監視（手動設定されていない場合のみ追従）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem('theme')) {
        html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        updateThemeIcon();
        updateMermaidTheme(e.matches);
      }
    });
  }

  /** テーマ切替ボタンのアイコンを現在のテーマに合わせて更新 */
  function updateThemeIcon() {
    var themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    // ライトモード: 月アイコン（ダークに切替）、ダークモード: 太陽アイコン（ライトに切替）
    themeToggle.textContent = isDark ? '\u2600' : '\u263D';
    themeToggle.setAttribute('aria-label', isDark ? 'ライトモードに切替' : 'ダークモードに切替');
  }

  /* ------------------------------------------------------------------------
     2. サイドバー
     - ハンバーガーメニューでモバイルサイドバー開閉
     - overlay クリックで閉じる
     - 現在のページのリンクに .active クラスを付与
     ------------------------------------------------------------------------ */

  function initSidebar() {
    var menuToggle = document.querySelector('.menu-toggle');
    var sidebar = document.querySelector('.sidebar');
    var overlay = document.querySelector('.overlay');

    // モバイルメニューの開閉
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('open');
        if (overlay) {
          overlay.classList.toggle('show');
        }
      });
    }

    // オーバーレイクリックでサイドバーを閉じる
    if (overlay) {
      overlay.addEventListener('click', function () {
        if (sidebar) sidebar.classList.remove('open');
        overlay.classList.remove('show');
      });
    }

    // 現在のページに対応するナビゲーションリンクをアクティブにする
    highlightCurrentPage();
  }

  /** URL パスからサイドバーの該当リンクに .active クラスを付与 */
  function highlightCurrentPage() {
    var currentPath = window.location.pathname;
    var navLinks = document.querySelectorAll('.sidebar-nav li a');

    navLinks.forEach(function (link) {
      // リンクの href と現在のパスを比較
      var linkPath = link.getAttribute('href');
      if (!linkPath) return;

      // 相対パスを絶対パスに変換して比較
      var resolvedPath = new URL(linkPath, window.location.origin).pathname;

      if (resolvedPath === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. サイト全文検索 (Ctrl+K / Cmd+K でフォーカス)
     - search-index.json を遅延読み込み
     - 全ページのタイトル・本文を横断検索
     - ドロップダウンで結果表示、クリックでページ遷移
     ------------------------------------------------------------------------ */

  var searchIndex = null; // 遅延読み込みされるインデックス
  var searchDropdown = null; // 検索結果ドロップダウン要素

  function initSearch() {
    var searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    // ドロップダウン要素を作成
    searchDropdown = document.createElement('div');
    searchDropdown.className = 'search-dropdown';
    searchInput.parentElement.appendChild(searchDropdown);

    // Ctrl+K / Cmd+K でフォーカス
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === 'Escape') {
        searchInput.value = '';
        hideSearchDropdown();
        searchInput.blur();
      }
    });

    // 入力イベントで全文検索
    var debounceTimer = null;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        var query = searchInput.value.trim();
        if (query.length >= 2) {
          performSearch(query);
        } else {
          hideSearchDropdown();
        }
      }, 300);
    });

    // フォーカスが外れたらドロップダウンを閉じる（少し遅延させてクリックを拾う）
    searchInput.addEventListener('blur', function () {
      setTimeout(hideSearchDropdown, 200);
    });

    // フォーカス時に入力値があれば再検索
    searchInput.addEventListener('focus', function () {
      var query = searchInput.value.trim();
      if (query.length >= 2) {
        performSearch(query);
      }
    });

    // キーボードナビゲーション（上下キーで結果を選択、Enter で遷移）
    searchInput.addEventListener('keydown', function (e) {
      if (!searchDropdown || searchDropdown.style.display === 'none') return;
      var items = searchDropdown.querySelectorAll('.search-result-item');
      var activeItem = searchDropdown.querySelector('.search-result-item.active');
      var activeIndex = -1;

      items.forEach(function (item, i) {
        if (item === activeItem) activeIndex = i;
      });

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = activeIndex + 1 < items.length ? activeIndex + 1 : 0;
        items.forEach(function (item) { item.classList.remove('active'); });
        items[next].classList.add('active');
        items[next].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = activeIndex - 1 >= 0 ? activeIndex - 1 : items.length - 1;
        items.forEach(function (item) { item.classList.remove('active'); });
        items[prev].classList.add('active');
        items[prev].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeItem) {
          window.location.href = activeItem.getAttribute('data-url');
        } else if (items.length > 0) {
          window.location.href = items[0].getAttribute('data-url');
        }
      }
    });
  }

  /** 検索インデックスを読み込んで全文検索を実行 */
  function performSearch(query) {
    if (searchIndex) {
      showSearchResults(query);
      return;
    }
    // インデックスを遅延読み込み
    var basePath = getBasePath();
    fetch(basePath + 'search-index.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        searchIndex = data;
        showSearchResults(query);
      })
      .catch(function () {
        console.error('検索インデックスの読み込みに失敗しました');
      });
  }

  /** index.html からの相対パスか pages/ からの相対パスかを判定 */
  function getBasePath() {
    var path = window.location.pathname;
    if (path.indexOf('/pages/') !== -1) {
      return '../';
    }
    return './';
  }

  /** 検索結果をドロップダウンに表示 */
  function showSearchResults(query) {
    if (!searchIndex || !searchDropdown) return;

    var lowerQuery = query.toLowerCase();
    var results = [];

    searchIndex.forEach(function (page) {
      var titleMatch = page.title.toLowerCase().indexOf(lowerQuery) !== -1;
      var contentMatch = page.content.toLowerCase().indexOf(lowerQuery) !== -1;

      if (titleMatch || contentMatch) {
        // スコア計算: タイトル一致は高スコア、本文は出現回数で加算
        var score = 0;
        if (titleMatch) score += 100;
        var contentLower = page.content.toLowerCase();
        var pos = contentLower.indexOf(lowerQuery);
        while (pos !== -1) {
          score += 1;
          pos = contentLower.indexOf(lowerQuery, pos + 1);
        }

        // マッチ箇所周辺のテキスト抽出（抜粋）
        var excerpt = '';
        var idx = contentLower.indexOf(lowerQuery);
        if (idx !== -1) {
          var start = Math.max(0, idx - 40);
          var end = Math.min(page.content.length, idx + query.length + 80);
          excerpt = (start > 0 ? '...' : '') +
                    page.content.substring(start, end) +
                    (end < page.content.length ? '...' : '');
        }

        results.push({
          title: page.title,
          url: page.url,
          description: page.description,
          excerpt: excerpt,
          score: score
        });
      }
    });

    // スコア順にソート
    results.sort(function (a, b) { return b.score - a.score; });

    // 最大10件表示
    results = results.slice(0, 10);

    if (results.length === 0) {
      searchDropdown.innerHTML = '<div class="search-no-results">「' + escapeHtml(query) + '」に一致する結果はありません</div>';
      searchDropdown.style.display = 'block';
      return;
    }

    var basePath = getBasePath();
    var html = results.map(function (r) {
      var highlightedTitle = highlightMatch(r.title, query);
      var highlightedExcerpt = highlightMatch(r.excerpt, query);
      return '<a class="search-result-item" data-url="' + basePath + r.url + '" href="' + basePath + r.url + '">' +
             '<div class="search-result-title">' + highlightedTitle + '</div>' +
             '<div class="search-result-excerpt">' + highlightedExcerpt + '</div>' +
             '</a>';
    }).join('');

    searchDropdown.innerHTML = html;
    searchDropdown.style.display = 'block';
  }

  /** テキスト中のクエリ文字列をハイライト表示（HTML化） */
  function highlightMatch(text, query) {
    if (!text) return '';
    var escaped = escapeHtml(text);
    var lowerText = escaped.toLowerCase();
    var lowerQuery = query.toLowerCase();
    var result = '';
    var lastIndex = 0;
    var idx = lowerText.indexOf(lowerQuery);

    while (idx !== -1) {
      result += escaped.substring(lastIndex, idx);
      result += '<mark>' + escaped.substring(idx, idx + query.length) + '</mark>';
      lastIndex = idx + query.length;
      idx = lowerText.indexOf(lowerQuery, lastIndex);
    }
    result += escaped.substring(lastIndex);
    return result;
  }

  /** HTML エスケープ */
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  /** ドロップダウンを非表示にする */
  function hideSearchDropdown() {
    if (searchDropdown) {
      searchDropdown.style.display = 'none';
    }
  }

  /* ------------------------------------------------------------------------
     4. コードブロックのコピーボタン
     - 全ての pre 要素にコピーボタンを動的に追加
     - クリックでクリップボードにコピー
     - 「コピー済み!」フィードバック表示
     ------------------------------------------------------------------------ */

  function initCopyButtons() {
    var preElements = document.querySelectorAll('pre');

    preElements.forEach(function (pre) {
      // 既にコピーボタンがある場合はスキップ
      if (pre.querySelector('.copy-btn')) return;

      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'コードをコピー');

      btn.addEventListener('click', function () {
        // pre 内のコードテキストを取得
        var code = pre.querySelector('code');
        var text = code ? code.textContent : pre.textContent;

        copyToClipboard(text).then(function () {
          btn.textContent = '\u2713 \u30b3\u30d4\u30fc\u6e08\u307f!';
          btn.classList.add('copied');

          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        }).catch(function () {
          // フォールバック: 古いブラウザ向け
          btn.textContent = '\u2716 \u5931\u6557';
          setTimeout(function () {
            btn.textContent = 'Copy';
          }, 2000);
        });
      });

      pre.appendChild(btn);
    });
  }

  /** クリップボードにテキストをコピー（Clipboard API フォールバック付き） */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    // フォールバック: textarea を使った古い方法
    return new Promise(function (resolve, reject) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand('copy');
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. 目次の自動生成
     - main-content 内の h2, h3 要素から TOC を生成
     - .toc 要素が存在する場合に自動挿入
     ------------------------------------------------------------------------ */

  function initTableOfContents() {
    var toc = document.querySelector('.toc');
    if (!toc) return;

    var mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    var headings = mainContent.querySelectorAll('h2, h3');
    if (headings.length === 0) return;

    // 目次タイトル
    var title = toc.querySelector('.toc-title');
    if (!title) {
      title = document.createElement('div');
      title.className = 'toc-title';
      title.textContent = '\u76ee\u6b21';
      toc.appendChild(title);
    }

    // 目次リストを生成
    var ul = document.createElement('ul');

    headings.forEach(function (heading, index) {
      // 見出しに ID がなければ自動付与
      if (!heading.id) {
        heading.id = 'heading-' + index;
      }

      var li = document.createElement('li');
      li.className = heading.tagName === 'H3' ? 'toc-h3' : 'toc-h2';

      var a = document.createElement('a');
      a.href = '#' + heading.id;
      a.textContent = heading.textContent;
      a.setAttribute('data-target', heading.id);

      li.appendChild(a);
      ul.appendChild(li);
    });

    toc.appendChild(ul);
  }

  /* ------------------------------------------------------------------------
     6. スムーズスクロール
     - アンカーリンクのクリックでスムーズにスクロール
     ------------------------------------------------------------------------ */

  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href').substring(1);
      if (!targetId) return;

      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      // ヘッダーの高さ分オフセット
      var headerHeight = 60;
      var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // URL のハッシュを更新（履歴に追加せず置換）
      history.replaceState(null, '', '#' + targetId);
    });
  }

  /* ------------------------------------------------------------------------
     7. スクロールスパイ
     - スクロール位置に応じて目次のアクティブ項目を更新
     ------------------------------------------------------------------------ */

  function initScrollSpy() {
    var toc = document.querySelector('.toc');
    if (!toc) return;

    var tocLinks = toc.querySelectorAll('a[data-target]');
    if (tocLinks.length === 0) return;

    var headerHeight = 60;
    var scrollOffset = headerHeight + 32;

    // スクロールイベントをスロットル処理
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateActiveSection(tocLinks, scrollOffset);
          ticking = false;
        });
        ticking = true;
      }
    });

    // 初期状態を設定
    updateActiveSection(tocLinks, scrollOffset);
  }

  /** スクロール位置に基づいて目次のアクティブ項目を更新 */
  function updateActiveSection(tocLinks, scrollOffset) {
    var currentActive = null;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 全ての見出しをチェックし、スクロール位置を超えた最後の見出しをアクティブに
    tocLinks.forEach(function (link) {
      var targetId = link.getAttribute('data-target');
      var target = document.getElementById(targetId);
      if (!target) return;

      if (target.offsetTop <= scrollTop + scrollOffset) {
        currentActive = link;
      }
    });

    // アクティブクラスを更新
    tocLinks.forEach(function (link) {
      link.classList.remove('active');
    });

    if (currentActive) {
      currentActive.classList.add('active');
    }
  }

  /* ------------------------------------------------------------------------
     8. Mermaid.js サポート
     - ページ内に .mermaid 要素がある場合のみ CDN を動的に読み込み
     - サイトのテーマ（ライト/ダーク）と連動
     - テーマ切替時に Mermaid の再レンダリングを実行
     ------------------------------------------------------------------------ */

  /** Mermaid.js の初期化（.mermaid 要素がある場合のみ CDN を読み込む） */
  function initMermaid() {
    var mermaidBlocks = document.querySelectorAll('.mermaid');
    if (mermaidBlocks.length === 0) return;

    // テーマ切替時の再レンダリング用に元のテキストを保存（CDN 読み込み前に実施）
    mermaidBlocks.forEach(function (block) {
      block.setAttribute('data-original', block.textContent.trim());
    });

    // Mermaid CDN を動的に読み込み
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';
    script.onload = function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      // startOnLoad: false — DOMContentLoaded 後の動的読み込みのため手動で run() する
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", sans-serif',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        },
        sequence: {
          useMaxWidth: true
        }
      });
      mermaid.run({ querySelector: '.mermaid' });
    };
    script.onerror = function () {
      console.error('Mermaid CDN の読み込みに失敗しました');
    };
    document.head.appendChild(script);
  }

  /** テーマ切替時に Mermaid のテーマを更新して再レンダリング */
  function updateMermaidTheme(isDark) {
    if (typeof mermaid === 'undefined') return;

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", sans-serif',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      sequence: {
        useMaxWidth: true
      }
    });

    // 既存の Mermaid SVG をクリアし、元のテキストを復元して再レンダリング
    var mermaidBlocks = document.querySelectorAll('.mermaid');
    mermaidBlocks.forEach(function (block) {
      block.removeAttribute('data-processed');
      var original = block.getAttribute('data-original');
      if (original) {
        block.innerHTML = '';
        block.textContent = original;
      }
    });

    mermaid.run({ querySelector: '.mermaid' });
  }

  /* ------------------------------------------------------------------------
     初期化
     ------------------------------------------------------------------------ */

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initSidebar();
    initSearch();
    initCopyButtons();
    initTableOfContents();
    initSmoothScroll();
    initScrollSpy();
    initMermaid();
  });

})();
