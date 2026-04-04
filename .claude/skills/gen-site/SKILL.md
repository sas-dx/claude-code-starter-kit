---
name: gen-site
description: リポジトリの .claude/ 配下のマークダウンファイルを読み込み、docs/ 配下に HTML ドキュメントサイトを生成・更新します
---

# ドキュメントサイト生成スキル

このスキルは `.claude/` 配下のマークダウンファイルを読み込み、`docs/` 配下に静的 HTML ドキュメントサイトを生成・更新します。

## 実行手順

### 1. ソースファイルの読み込み

以下のマークダウンファイルを全て読み込む:

- `README.md` (プロジェクトルート)
- `.claude/README.md`
- `.claude/CLAUDE.md`
- `.claude/rules/README.md` + `.claude/rules/*.md`
- `.claude/commands/README.md` + `.claude/commands/*.md`
- `.claude/agents/README.md` + `.claude/agents/*.md`
- `.claude/skills/README.md` + `.claude/skills/*/SKILL.md`
- `.claude/hooks/README.md`
- `.claude/mcp/README.md`
- `.claude/plugins/README.md` + プラグインのサンプルファイル
- `.claude/agent-teams/README.md`
- `.claude/settings/README.md` + `settings.json` + `settings.local.json`
- `.claude/keybindings/README.md`

### 2. 生成対象ファイル

以下のファイルを生成・更新する:

| ファイル | 内容 |
|---------|------|
| `docs/index.html` | トップページ（README.md ベース） |
| `docs/pages/claude-md.html` | CLAUDE.md ガイド |
| `docs/pages/rules.html` | Rules ガイド + 全サンプル |
| `docs/pages/commands.html` | Commands ガイド + 全サンプル |
| `docs/pages/agents.html` | Agents ガイド + 全サンプル |
| `docs/pages/skills.html` | Skills ガイド + 全サンプル |
| `docs/pages/hooks.html` | Hooks ガイド |
| `docs/pages/mcp.html` | MCP ガイド |
| `docs/pages/plugins.html` | Plugins ガイド + サンプル |
| `docs/pages/agent-teams.html` | Agent Teams ガイド |
| `docs/pages/settings.html` | Settings ガイド |
| `docs/pages/keybindings.html` | Keybindings ガイド |
| `docs/css/style.css` | CSS スタイルシート |
| `docs/js/main.js` | JavaScript |

### 3. HTML テンプレート構造

全ページは以下の共通構造を使用:

- `<!DOCTYPE html>` + `<html lang="ja" data-theme="light">`
- ヘッダー: サイトロゴ、検索、テーマ切替、GitHub リンク
- サイドバー: 全ページへのナビゲーション
- メインコンテンツ: マークダウンから変換した HTML
- JavaScript: `docs/js/main.js`

### 4. 共通ナビゲーション

サイドバーには以下のリンクを含める:

- 🏠 ホーム → `index.html`
- **基本設定**: 📋 CLAUDE.md, 📏 Rules, ⚙️ Settings
- **コマンド・スキル**: ⌨️ Commands, 🎯 Skills
- **エージェント**: 🤖 Agents, 👥 Agent Teams
- **拡張・連携**: 🪝 Hooks, 🔌 MCP, 🧩 Plugins
- **その他**: ⌨️ Keybindings

### 5. CSS クラス規約

- `.hero` — トップページのヒーローセクション
- `.feature-grid` + `.feature-card` — 機能カードのグリッド表示
- `.callout.info` / `.callout.warning` / `.callout.tip` / `.callout.danger` — 注意書き
- `.code-header` + `<pre><code>` — ファイル名付きコードブロック
- `.toc` — 目次（JS 自動生成）
- `<table>` — テーブル（標準タグ）

### 6. ページごとの内容方針

- マークダウンの内容は省略せず全量をHTMLに変換
- 各サンプルファイル（ルール、コマンド、エージェント、スキル）は全文をコードブロックで掲載
- 身近な例えや図解を追加して分かりやすく
- ベストプラクティスは `.callout.tip` で追記
- 既存の `docs/css/style.css` と `docs/js/main.js` は内容を維持（CSS/JS の変更が必要な場合のみ更新）

## 注意事項

- `docs/` ディレクトリが存在しない場合は作成する
- 既存のHTMLファイルは上書きする
- マークダウンに新しいファイルが追加された場合はページを追加し、サイドバーのナビゲーションも更新する
- 全ての出力は日本語
