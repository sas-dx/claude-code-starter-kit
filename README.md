# Claude Code Starter Kit

Claude Code の導入を検討しているチームや個人に向けたスターターキットです。
Skills、カスタムコマンド、サブエージェント、エージェントチームなど、Claude Code の主要機能をすぐに導入・使用できるテンプレートとサンプルを提供します。

## 目次

- [前提条件](#前提条件)
- [セットアップ](#セットアップ)
- [リポジトリ構成](#リポジトリ構成)
- [主要機能](#主要機能)
- [カスタマイズガイド](#カスタマイズガイド)
- [一番大切なこと](#一番大切なこと)
- [参考リンク](#参考リンク)

## 前提条件

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) がインストール済みであること
- Node.js 18 以上
- Git

```bash
# Claude Code のインストール
npm install -g @anthropic-ai/claude-code

# インストール確認
claude --version
```

## セットアップ

```bash
git clone https://github.com/sas-dx/claude-code-starter-kit.git
cd claude-code-starter-kit
claude
```

起動後、CLAUDE.md が自動的に読み込まれ、プロジェクト固有の指示が適用されます。

## リポジトリ構成（暫定）

> **Note:** 以下は想定構成です。各ファイルは今後順次作成・更新していきます。

```
claude-code-starter-kit/
├── README.md
├── .mcp.json                        # MCP サーバー設定（チーム共有）
└── .claude/
    ├── CLAUDE.md                    # プロジェクト指示書（メイン）
    ├── README.md                    # CLAUDE.md の書き方ガイド
    ├── settings.json                # プロジェクト設定（チーム共有）
    ├── commands/                    # カスタムコマンド
    ├── skills/                      # スキル
    ├── agents/                      # サブエージェント
    ├── rules/                       # プロジェクトルール
    ├── hooks/                       # フックスクリプト
    ├── mcp/                         # MCP ガイド
    ├── agent-teams/                 # Agent Teams ガイド
    ├── settings/                    # Settings ガイド
    └── keybindings/                 # Keybindings ガイド
```

各ディレクトリには README.md とサンプルファイルが含まれています。詳細は各ディレクトリを参照してください。

## 主要機能

### CLAUDE.md（プロジェクト指示書）

セッション開始時に自動で読み込まれる「業務マニュアル」です。毎回プロジェクトの説明をしなくても、ルール通りに動いてくれます。

- チーム全員が同じルールで作業できる
- AI の暴走（勝手な DB 削除等）を防げる
- `/init` コマンドで自動生成可能

> 詳細: [.claude/README.md](.claude/README.md)

---

### Rules（ルール）

`.claude/rules/` に配置する簡潔なルールファイルです。CLAUDE.md の詳細版として機能し、パス別ルール（特定ファイル操作時のみ適用）にも対応しています。

**提供しているルール:**

| ファイル | 内容 |
|---------|------|
| `git-workflow.md` | ブランチ命名、コミットメッセージ、PR 作成 |
| `coding-standards.md` | DRY/YAGNI、命名規則、エラー処理 |
| `testing.md` | TDD、テストコード不可侵性（パス別ルール） |
| `security.md` | 禁止事項、セキュリティチェックリスト |
| `review-process.md` | レビュー観点、指摘レベル分類 |

> 詳細: [.claude/rules/README.md](.claude/rules/README.md)

---

### Custom Commands（カスタムコマンド）

よく行う作業を `/コマンド名` の一言で実行できる仕組みです。

**提供しているコマンド:**

| コマンド | 用途 |
|---------|------|
| `/code-review` | コード品質・セキュリティの包括的レビュー |
| `/dev-issue` | Issue ベースの実装〜PR 作成まで一括実行 |
| `/dev-issue-team` | Agent Teams による並列実装 |
| `/fix-pr-review` | PR レビュー指摘の修正・完了報告 |
| `/resolve-conflict` | Git コンフリクトの分析・解決 |

> 詳細: [.claude/commands/README.md](.claude/commands/README.md)

---

### Skills（スキル）

カスタムコマンドの上位互換です。`/skill-name` での手動呼び出しに加え、Claude が状況に応じて自動的に使うこともできます。テンプレートやスクリプトの同梱、サブエージェントでの隔離実行にも対応。

**提供しているスキル:**

| スキル | 用途 | 自動呼び出し |
|-------|------|:----------:|
| `/gen-doc` | ソースコードからドキュメント自動生成 | - |
| `/pr-summary` | PR 差分を分析してサマリー作成 | - |
| `/explain-code` | コードの仕組みを図解と例え話で解説 | ✅ |
| `/fix-issue` | Issue に基づいて実装〜PR 作成 | - |
| `/scaffold-feature` | 機能ディレクトリの雛形を一括生成 | - |

> 詳細: [.claude/skills/README.md](.claude/skills/README.md)

---

### Sub-agents（サブエージェント）

特定タスクに特化した AI アシスタントです。隔離コンテキストで独立して動作し、Claude が必要に応じて自動的に委譲します。

**提供しているエージェント:**

| エージェント | 役割 |
|------------|------|
| `code-reviewer` | コード品質の包括的レビュー |
| `security-reviewer` | セキュリティ脆弱性の検出・対策 |
| `pr-fix-implementer` | PR レビュー指摘の修正実装 |
| `conflict-resolver` | Git コンフリクトの分析・解決 |
| `rules-coder` | ルール準拠の TDD 実装 |

> 詳細: [.claude/agents/README.md](.claude/agents/README.md)

---

### Agent Teams（エージェントチーム）

複数の Claude Code インスタンスが並列で協調作業を行う実験的機能です。チームメイト同士が直接メッセージをやり取りし、共有タスクリストで自律的に協調します。

- PR の並列レビュー（セキュリティ / パフォーマンス / テスト）
- 複数仮説の並列デバッグ
- フロントエンド・バックエンド・テストの同時開発

> 詳細: [.claude/agent-teams/README.md](.claude/agent-teams/README.md)

---

### Hooks（フック）

ツール実行前後に自動実行されるシェルスクリプトです。CLAUDE.md のルールが「従おうとする指示」なのに対し、Hooks は「仕組みで強制する」ガードレールです。

- 危険なコマンドの確実なブロック（`rm -rf` 等）
- ファイル編集後の自動フォーマット
- セッション開始時の環境セットアップ

> 詳細: [.claude/hooks/README.md](.claude/hooks/README.md)

---

### MCP Servers

AI に外部サービス（GitHub、DB、Slack 等）へのアクセスを提供する仕組みです。

**導入済みサーバー:**

| サーバー | 用途 |
|---------|------|
| [Serena](https://github.com/oraios/serena) | セマンティックコード解析 |
| [Context7](https://github.com/upstash/context7) | 最新ドキュメントのリアルタイム取得 |

> 詳細: [.claude/mcp/README.md](.claude/mcp/README.md)

---

### Settings（設定）

Claude Code の動作・権限・フック・環境変数を制御する設定ファイルです。

```
優先度: 管理者ポリシー > ユーザー設定 > プロジェクト設定 > ローカル設定
```

> 詳細: [.claude/settings/README.md](.claude/settings/README.md)

---

### Keybindings（キーバインド）

キーボードショートカットのカスタマイズ。`/keybindings` で設定ファイルを開けます。

> 詳細: [.claude/keybindings/README.md](.claude/keybindings/README.md)

## カスタマイズガイド

### 1. プロジェクトに合わせた CLAUDE.md の作成

```bash
claude /init    # 自動生成してからカスタマイズ
```

### 2. 機能の追加

`/scaffold-feature` スキルで雛形を一括生成できます。

```bash
/scaffold-feature command deploy       # カスタムコマンドの雛形
/scaffold-feature agent test-runner    # サブエージェントの雛形
/scaffold-feature skill my-workflow    # スキルの雛形
/scaffold-feature rule api-design      # ルールの雛形
/scaffold-feature hook block-rm        # フックスクリプトの雛形
```

### 3. MCP サーバーの追加

```bash
claude mcp add --transport http --scope project <name> <url>
```

## 一番大切なこと

AI 駆動開発はまだ**黎明期**です。Claude Code をはじめとする AI ツールは日々進化しており、今後も新機能が登場し、より洗練されていくことが予想されます。

このスターターキットも完成形ではありません。大切なのは以下のサイクルを回し続けることです。

```
調べる → 試す → 良かったものを共有する → プロジェクトに組み込む
```

1. **調べる** - 時間があるときに公式ドキュメントやリリースノート、コミュニティの事例を確認する
2. **試す** - 新しい機能や方法論を実際に使ってみる。うまくいかなくても経験になる
3. **共有する** - 良かったものはチームや他の案件に横展開する。スキル・ルール・エージェントとして形式知化する
4. **組み込む** - 自分が所属するプロジェクトやリポジトリを、より AI 駆動開発に適した環境に整備する

ツールに詳しい1人の天才が全てを整備するのではなく、**チーム全員が少しずつ改善を積み重ねる**ことで、プロジェクト全体の開発体験が向上していきます。このリポジトリの CLAUDE.md、Rules、Skills、Agents、Commands は全て、そのための土台です。

## 参考リンク

| リソース | URL |
|---------|-----|
| Claude Code 公式ドキュメント | https://docs.anthropic.com/en/docs/claude-code |
| Claude Code ウェブドキュメント | https://code.claude.com/docs/en/ |
| Claude Code GitHub | https://github.com/anthropics/claude-code |
| MCP (Model Context Protocol) | https://modelcontextprotocol.io/ |

## ライセンス

MIT License
