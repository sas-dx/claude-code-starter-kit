# MCP (Model Context Protocol) ガイド

## MCP とは

### ひとことで言うと

**MCP (Model Context Protocol)** は、**AI に「手足」を与える仕組み**です。

普段 Claude Code に質問すると、AI は自分の知識だけで回答します。しかし実際の業務では「GitHub の PR を見てほしい」「データベースを確認してほしい」「Slack にメッセージを送ってほしい」といった、外部サービスと連携する作業が多くあります。

MCP を使うと、AI がこれらの外部サービスに直接アクセスして作業できるようになります。

### 身近な例えで理解する

スマートフォンの「アプリ」をイメージしてください。

- スマホ本体 = **AI（Claude Code）**
- アプリ = **MCP サーバー**
- App Store = **MCP エコシステム**

スマホは本体だけでも電話やカメラが使えますが、アプリをインストールすると地図、決済、SNS など様々なことができるようになります。同じように、Claude Code も MCP サーバーを追加することで、GitHub 操作やデータベース接続など様々な外部サービスと連携できるようになります。

さらに、1つのアプリが iPhone でも Android でも使えるように、1つの MCP サーバーは Claude でも ChatGPT でも Copilot でも使えます。これが「標準プロトコル」であることの大きなメリットです。

### MCP がない場合とある場合

```
【MCP がない場合】
  あなた → Claude に質問 → Claude は自分の知識だけで回答
  あなた → 自分で GitHub を開いて確認 → 結果を Claude にコピペ → また質問...

【MCP がある場合】
  あなた → Claude に質問 → Claude が GitHub MCP 経由で直接 PR を確認 → 回答
```

### 仕組み（もう少し詳しく）

MCP は3つの登場人物で成り立っています。

```
┌──────────────────────────────────────────────┐
│          Host（AI アプリケーション）             │
│      Claude Code / VS Code / ChatGPT          │
│                                               │
│  ┌────────────┬────────────┬────────────┐    │
│  │   Client   │   Client   │   Client   │    │
│  │ (GitHub用) │  (DB用)    │ (Slack用)  │    │
│  └─────┬──────┴─────┬──────┴─────┬──────┘    │
└────────┼────────────┼────────────┼────────────┘
         │            │            │
      接続           接続         接続
         │            │            │
┌────────┴───┐ ┌──────┴────┐ ┌────┴──────┐
│ MCP Server │ │MCP Server │ │MCP Server │
│  GitHub    │ │PostgreSQL │ │  Slack    │
└────────────┘ └───────────┘ └───────────┘
```

| 登場人物 | 何をするか | 身近な例え |
|---------|----------|----------|
| **Host** | AI アプリ本体。Client を管理する | スマホ本体 |
| **Client** | 各 Server との接続を維持する | アプリの通信部分 |
| **Server** | 外部サービスへのアクセスを提供する | インストールしたアプリ |

### MCP サーバーが AI に提供するもの

| 提供するもの | 何ができるか | 具体例 |
|------------|-----------|-------|
| **Tools（ツール）** | AI が実行できる「操作」 | ファイルを作成する、PR を作る、メッセージを送る |
| **Resources（リソース）** | AI が読み取れる「データ」 | ファイルの中身、DB のレコード、API のレスポンス |
| **Prompts（プロンプト）** | 定型の「指示テンプレート」 | コードレビュー用のプロンプト、分析用のテンプレート |

### 接続方式

| 方式 | 接続先 | イメージ | 主な用途 |
|-----|-------|---------|---------|
| **stdio** | 自分の PC 内 | PC にインストールしたアプリを直接起動 | ファイル操作、Git、ローカル DB |
| **HTTP** | インターネット経由 | Web サービスに接続 | クラウド API、SaaS 連携 |
| **SSE** | インターネット経由 | （旧方式。HTTP に移行中） | レガシー連携 |

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
