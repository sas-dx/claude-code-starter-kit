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
     3. ページ内検索 (Ctrl+K / Cmd+K でフォーカス)
     - main-content 内のテキストをハイライト
     ------------------------------------------------------------------------ */

  function initSearch() {
    var searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    var mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    // Ctrl+K / Cmd+K でフォーカス
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
      // Escape でフォーカス解除 & ハイライトクリア
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        clearHighlights(mainContent);
        searchInput.blur();
      }
    });

    // 入力イベントでリアルタイムハイライト
    var debounceTimer = null;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        var query = searchInput.value.trim();
        clearHighlights(mainContent);
        if (query.length >= 2) {
          highlightText(mainContent, query);
        }
      }, 300);
    });
  }

  /** 指定要素内のテキストノードを検索してハイライト */
  function highlightText(root, query) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var nodesToHighlight = [];
    var lowerQuery = query.toLowerCase();

    // まずマッチするテキストノードを収集（DOM 変更前に完了させる）
    while (walker.nextNode()) {
      var node = walker.currentNode;
      // pre, code, script, style 内はスキップ
      var parent = node.parentElement;
      if (parent && (parent.closest('pre') || parent.closest('code') ||
          parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
        continue;
      }
      if (node.nodeValue.toLowerCase().indexOf(lowerQuery) !== -1) {
        nodesToHighlight.push(node);
      }
    }

    // 収集したノードにハイライトを適用
    nodesToHighlight.forEach(function (textNode) {
      var text = textNode.nodeValue;
      var lowerText = text.toLowerCase();
      var index = lowerText.indexOf(lowerQuery);
      if (index === -1) return;

      var fragment = document.createDocumentFragment();
      var lastIndex = 0;

      while (index !== -1) {
        // マッチ前のテキスト
        if (index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
        }
        // ハイライト付きのマッチテキスト
        var mark = document.createElement('mark');
        mark.className = 'search-highlight';
        mark.textContent = text.substring(index, index + query.length);
        fragment.appendChild(mark);

        lastIndex = index + query.length;
        index = lowerText.indexOf(lowerQuery, lastIndex);
      }

      // 残りのテキスト
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }

      textNode.parentNode.replaceChild(fragment, textNode);
    });

    // 最初のハイライトにスクロール
    var firstMatch = root.querySelector('mark.search-highlight');
    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /** ハイライト（mark要素）を全て除去して元のテキストに戻す */
  function clearHighlights(root) {
    var marks = root.querySelectorAll('mark.search-highlight');
    marks.forEach(function (mark) {
      var parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize(); // 隣接するテキストノードを結合
    });
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

    // Mermaid CDN を動的に読み込み
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.onload = function () {
      // テーマ切替時の再レンダリング用に元のテキストを保存
      mermaidBlocks.forEach(function (block) {
        block.setAttribute('data-original', block.textContent);
      });

      // テーマをサイトのテーマに連動
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      mermaid.initialize({
        startOnLoad: true,
        theme: isDark ? 'dark' : 'default',
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
      mermaid.run();
    };
    document.head.appendChild(script);
  }

  /** テーマ切替時に Mermaid のテーマを更新して再レンダリング */
  function updateMermaidTheme(isDark) {
    if (typeof mermaid === 'undefined') return;

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
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

    // 既存の Mermaid SVG をクリアして再レンダリング
    var mermaidBlocks = document.querySelectorAll('.mermaid');
    mermaidBlocks.forEach(function (block) {
      // data-processed 属性を削除して再処理可能にする
      block.removeAttribute('data-processed');
      // Mermaid が生成した SVG を削除し、元のテキストを復元
      var svg = block.querySelector('svg');
      if (svg && block.getAttribute('data-original')) {
        block.innerHTML = block.getAttribute('data-original');
      }
    });

    mermaid.run();
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
