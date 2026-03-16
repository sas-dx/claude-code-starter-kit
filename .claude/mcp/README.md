# MCP Servers 設定ガイド

本プロジェクトで使用している MCP (Model Context Protocol) サーバーの詳細です。

## 設定ファイル

MCP サーバーの設定はプロジェクトルートの `.mcp.json` に定義しています。
Claude Code はプロジェクトルート直下の `.mcp.json` のみを認識するため、このファイルは移動できません。

## 導入済み MCP サーバー

### 1. Serena（セマンティックコード解析）

| 項目 | 内容 |
|-----|------|
| リポジトリ | https://github.com/oraios/serena |
| トランスポート | stdio |
| 前提条件 | `uv` パッケージマネージャー |
| ライセンス | OSS（無料） |

**機能:**
- セマンティックなコード解析・検索
- シンボルレベルでのコード編集
- 複数言語対応
- IDE ライクなコードナビゲーション

**前提条件のインストール:**

```bash
# uv のインストール（Linux/macOS）
curl -LsSf https://astral.sh/uv/install.sh | sh

# インストール確認
uvx --version
```

> **Note:** `.mcp.json` 内の `command` フィールドは `uvx` の絶対パスを指定しています。
> 環境に合わせてパスを変更してください（例: `/home/<user>/.local/bin/uvx`）。

### 2. Context7（リアルタイムドキュメント取得）

| 項目 | 内容 |
|-----|------|
| リポジトリ | https://github.com/upstash/context7 |
| トランスポート | stdio |
| 前提条件 | Node.js / npm |
| ライセンス | OSS（無料） |

**機能:**
- 最新のライブラリ・フレームワークのドキュメントをリアルタイム取得
- バージョン固有のコード例を提供
- Claude の知識カットオフを補完し、最新の API 仕様に基づいたコード生成を支援

**使い方:**

プロンプトに `use context7` を含めると、Claude が最新ドキュメントを取得してからコードを生成します。

```text
FastAPI で非同期エンドポイントを作成して use context7
```

## 接続確認

```bash
# MCP サーバーの接続状態を確認
claude mcp list
```

## MCP サーバーの追加

新しい MCP サーバーを追加する場合は、プロジェクトルートの `.mcp.json` を編集するか、CLI で追加します。

```bash
# CLI で追加（プロジェクトスコープ）
claude mcp add --transport http --scope project <name> <url>

# stdio サーバーの追加
claude mcp add --transport stdio --scope project <name> -- <command> <args...>
```

## トラブルシューティング

| 症状 | 対処法 |
|-----|--------|
| `Failed to connect` | `command` の絶対パスが正しいか確認。`which uvx` や `which npx` で確認 |
| `Needs authentication` | `claude mcp` でサーバーに接続後、認証フローを完了する |
| サーバーが認識されない | `.mcp.json` がプロジェクトルート直下にあるか確認 |
