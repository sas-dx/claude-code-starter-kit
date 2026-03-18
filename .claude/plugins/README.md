# Plugins（プラグイン）ガイド

## Plugins とは

Plugins は、Claude Code の機能拡張（Skills、Agents、Hooks、MCP サーバー等）を**1つのパッケージにまとめて配布・共有できる仕組み**です。

### 身近な例えで理解する

ブラウザの「拡張機能」で例えると：

- **`.claude/` ディレクトリの設定** = ブラウザの設定を手動で変更する。そのブラウザでしか使えない
- **Plugins** = Chrome ウェブストアから拡張機能をインストールする。誰でもワンクリックで同じ機能が使える。アップデートも自動

Claude Code も同じです。`.claude/` に直接書いた Skills や Hooks はそのプロジェクトでしか使えませんが、Plugin にすれば **チームメンバーや他のプロジェクトに簡単に配布**できます。

## なぜ Plugins が必要なのか

### 1. `.claude/` の設定との使い分け

| | `.claude/` 直接配置 | Plugins |
|--|-------------------|---------|
| **スコープ** | そのプロジェクトのみ | 複数プロジェクトで共有可能 |
| **スキル名** | `/hello` | `/plugin-name:hello`（名前空間で衝突防止） |
| **配布** | 手動コピー | マーケットプレイスからインストール |
| **向いている場面** | 個人用、プロジェクト固有、実験段階 | チーム共有、コミュニティ配布、バージョン管理 |

**まず `.claude/` で試して、共有したくなったら Plugin に変換する**のが推奨の流れです。

### 2. 名前空間で衝突を防ぐ

複数のプラグインが同じ名前のスキルを持っていても、`/plugin-a:deploy` と `/plugin-b:deploy` のように名前空間で区別されるため衝突しません。

### 3. バージョン管理と更新

`plugin.json` にバージョンを記載することで、セマンティックバージョニングによる管理ができます。更新も `/plugin install` で簡単です。

## Plugin の構成

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json        # マニフェスト（必須）
├── commands/               # カスタムコマンド
│   └── hello.md
├── skills/                 # スキル
│   └── code-review/
│       └── SKILL.md
├── agents/                 # サブエージェント
│   └── reviewer.md
├── hooks/                  # フック
│   └── hooks.json
├── .mcp.json               # MCP サーバー設定
├── .lsp.json               # LSP サーバー設定
├── settings.json           # デフォルト設定
└── README.md               # プラグイン説明
```

**重要:** `commands/`, `skills/`, `agents/` 等は**プラグインルート直下**に配置する。`.claude-plugin/` の中に入れない。

## plugin.json（マニフェスト）

```json
{
  "name": "my-plugin",
  "description": "プラグインの説明",
  "version": "1.0.0",
  "author": {
    "name": "作者名"
  }
}
```

| フィールド | 必須 | 説明 |
|-----------|:----:|------|
| `name` | ✅ | プラグイン名。スキルの名前空間になる |
| `description` | ✅ | プラグインマネージャーに表示される説明 |
| `version` | ✅ | セマンティックバージョニング（`1.0.0`） |
| `author` | - | 作者情報 |
| `homepage` | - | プラグインのホームページ URL |
| `repository` | - | ソースコードのリポジトリ URL |
| `license` | - | ライセンス |

## ローカルでのテスト

```bash
# プラグインを読み込んでClaude Codeを起動
claude --plugin-dir ./my-plugin

# 変更を反映（再起動不要）
/reload-plugins

# スキルのテスト（名前空間付き）
/my-plugin:hello
```

## `.claude/` からの変換手順

既に `.claude/` に Skills や Hooks がある場合、以下の手順で Plugin に変換できます。

```bash
# 1. プラグインディレクトリを作成
mkdir -p my-plugin/.claude-plugin

# 2. マニフェストを作成
echo '{"name":"my-plugin","description":"説明","version":"1.0.0"}' > my-plugin/.claude-plugin/plugin.json

# 3. 既存ファイルをコピー
cp -r .claude/commands my-plugin/
cp -r .claude/skills my-plugin/
cp -r .claude/agents my-plugin/

# 4. テスト
claude --plugin-dir ./my-plugin
```

## 配布方法

- **チーム内**: リポジトリにプラグインディレクトリをコミット
- **マーケットプレイス**: `/plugin install` で他のユーザーがインストール可能
- **公式マーケットプレイス**: [claude.ai/settings/plugins/submit](https://claude.ai/settings/plugins/submit) から申請

## サンプルプラグイン

本ディレクトリの `sample-plugin/` に最小構成のサンプルプラグインがあります。これはあくまでも**構成の参考例**です。

```
sample-plugin/
├── .claude-plugin/
│   └── plugin.json          # マニフェスト
└── skills/
    └── hello/
        └── SKILL.md         # サンプルスキル
```
