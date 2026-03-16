# MCP (Model Context Protocol) ガイド

## MCP とは

**Model Context Protocol (MCP)** は、AI アプリケーションと外部システムを接続するためのオープンソース標準プロトコルです。

USB-C が電子機器の接続を標準化したように、MCP は AI アプリケーションが外部のデータソース・ツール・サービスにアクセスするための統一的なインターフェースを提供します。

### なぜ MCP が必要か

従来、AI アプリケーションが外部システムと連携するには個別のインテグレーションが必要でした。MCP により：

- **統一的な接続方式** - サーバーごとに異なる API 実装が不要
- **エコシステムの共有** - 一度作った MCP サーバーは Claude、ChatGPT、Copilot、Gemini 等どの AI ツールからも利用可能
- **セキュアなアクセス** - 認証・権限管理が標準化されている

### アーキテクチャ

MCP はクライアント・サーバーモデルで構成されます。

```
┌──────────────────────────────────────────────┐
│        MCP Host（AI アプリケーション）          │
│    Claude Code / Claude Desktop / VS Code     │
│                                               │
│  ┌────────────┬────────────┬────────────┐    │
│  │ MCP Client │ MCP Client │ MCP Client │    │
│  └─────┬──────┴─────┬──────┴─────┬──────┘    │
└────────┼────────────┼────────────┼────────────┘
         │            │            │
  MCP Protocol   MCP Protocol  MCP Protocol
         │            │            │
┌────────┴───┐ ┌──────┴────┐ ┌────┴──────┐
│ MCP Server │ │MCP Server │ │MCP Server │
│  (Local)   │ │ (Local)   │ │ (Remote)  │
│ファイル操作 │ │ DB接続    │ │ API連携   │
└────────────┘ └───────────┘ └───────────┘
```

| コンポーネント | 役割 |
|-------------|------|
| **Host** | AI アプリケーション本体。MCP Client を管理する |
| **Client** | 各 MCP Server との接続を維持し、ホストにコンテキストを提供する |
| **Server** | 外部システムへのアクセスを提供するプログラム |

### MCP サーバーが提供する3つの要素

| 要素 | 説明 | 例 |
|-----|------|-----|
| **Tools** | AI が実行可能な関数 | ファイル操作、API 呼び出し、DB クエリ |
| **Resources** | コンテキスト情報を提供するデータソース | ファイル内容、DB レコード、API レスポンス |
| **Prompts** | 再利用可能なインタラクションテンプレート | システムプロンプト、few-shot 例 |

### トランスポート方式

| 方式 | 通信先 | 特徴 | 用途 |
|-----|-------|------|------|
| **stdio** | ローカル | サブプロセスとして起動。ネットワーク不要で最速 | ファイル操作、Git、ローカル DB |
| **HTTP** | リモート | HTTP POST で通信。複数クライアント対応 | クラウド API、SaaS 連携 |
| **SSE** | リモート | Server-Sent Events（非推奨、HTTP に移行中） | レガシー連携 |

---

## 本プロジェクトの MCP 設定

### 設定ファイル

MCP サーバーの設定はプロジェクトルートの `.mcp.json` に定義しています。
Claude Code はプロジェクトルート直下の `.mcp.json` のみを認識するため、このファイルは移動できません。

### 導入済み MCP サーバー

#### 1. Serena（セマンティックコード解析）

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

#### 2. Context7（リアルタイムドキュメント取得）

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

### 接続確認

```bash
# MCP サーバーの接続状態を確認
claude mcp list
```

### MCP サーバーの追加

新しい MCP サーバーを追加する場合は、プロジェクトルートの `.mcp.json` を編集するか、CLI で追加します。

```bash
# HTTP サーバーの追加（プロジェクトスコープ）
claude mcp add --transport http --scope project <name> <url>

# stdio サーバーの追加
claude mcp add --transport stdio --scope project <name> -- <command> <args...>
```

### トラブルシューティング

| 症状 | 対処法 |
|-----|--------|
| `Failed to connect` | `command` の絶対パスが正しいか確認。`which uvx` や `which npx` で確認 |
| `Needs authentication` | `claude mcp` でサーバーに接続後、認証フローを完了する |
| サーバーが認識されない | `.mcp.json` がプロジェクトルート直下にあるか確認 |

---

## 世の中の主要な MCP サーバー

### 公式リファレンスサーバー

[github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) で提供されている公式実装です。

| サーバー | 用途 |
|---------|------|
| **Filesystem** | ファイルの読み書き・検索（アクセス制御付き） |
| **Git** | Git リポジトリの読み取り・検索・操作 |
| **Fetch** | Web コンテンツの取得・変換 |
| **Memory** | ナレッジグラフベースの永続メモリ |
| **Sequential Thinking** | 思考の連鎖による動的な問題解決 |

### エンタープライズ・主要プラットフォーム

| サーバー | 提供元 | 用途 |
|---------|-------|------|
| [GitHub MCP](https://github.com/github/github-mcp-server) | GitHub | リポジトリ操作、Issue/PR 管理、コード解析 |
| [Microsoft MCP](https://github.com/microsoft/mcp) | Microsoft | Azure サービス、Microsoft 365 連携 |
| Google Calendar / Gmail | Google | カレンダー・メール連携 |
| Slack MCP | Slack | メッセージ作成、チャンネル要約、ワークスペース操作 |
| Notion MCP | Notion | ページ・データベースの読み書き |

### データベース

| サーバー | 用途 |
|---------|------|
| **Supabase** | スキーマ設計、マイグレーション、認証管理、TypeScript 型生成 |
| **PostgreSQL** | PostgreSQL のクエリ・スキーマ操作 |
| **SQLite** | SQLite データベース操作と分析 |
| **Neo4j** | グラフデータベースの Cypher クエリ |
| **Redis** | 自然言語インターフェースによるデータ管理・検索 |
| **MongoDB** | MongoDB のクエリ・データ操作 |
| **ClickHouse** | 大規模データセットの高速分析 |
| **Milvus** | ベクトルデータベース統合 |

### オブザーバビリティ・監視

| サーバー | 用途 |
|---------|------|
| **Datadog** | ログ・トレース・メトリクスへのリアルタイムアクセス |
| **Sentry** | エラートラッキング連携 |
| **Prometheus** | 監視データの統合・分析 |
| **Grafana Loki** | ログ集約・分析 |
| **CloudWatch Logs** | AWS CloudWatch ログの AI 駆動分析 |

### 開発・DevOps ツール

| サーバー | 用途 |
|---------|------|
| **Terraform Cloud** | 自然言語による IaC 操作・プロバイダドキュメント参照 |
| **Testkube** | テストワークフローの実行・監視 |
| **Puppeteer** | Web 自動化・スクレイピング・スクリーンショット |
| **Brave Search** | Brave Search API による Web 検索 |
| **Semgrep** | 静的解析・セキュリティスキャン |

### プロダクティビティ・連携

| サーバー | 用途 |
|---------|------|
| **Google Drive** | Google Docs / Sheets / Slides へのアクセス |
| **Figma** | デザインシステム連携。デザインからコード生成 |
| **Stripe** | 決済連携・管理 |
| **Asana** | プロジェクト管理・タスク追跡 |

### 統合プラットフォーム

| サーバー | 用途 |
|---------|------|
| **Pipedream** | 2,500 以上の API、8,000 以上のプリビルトツールへのアクセス |
| **MetaMCP** | GUI ベースの MCP 接続管理ミドルウェア |

---

## 参考リンク

| リソース | URL |
|---------|-----|
| MCP 公式サイト | https://modelcontextprotocol.io/ |
| MCP 仕様 | https://modelcontextprotocol.io/specification/latest |
| 公式サーバーリポジトリ | https://github.com/modelcontextprotocol/servers |
| Awesome MCP Servers | https://github.com/punkpeye/awesome-mcp-servers |
| MCP Inspector（デバッグツール） | https://github.com/modelcontextprotocol/inspector |
| Claude Code MCP ドキュメント | https://code.claude.com/docs/en/mcp |
