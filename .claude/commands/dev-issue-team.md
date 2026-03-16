$ARGUMENTS の GitHub Issue 実装を agent-teams を使用して複数エージェントで並列実行してください。

## 絶対原則
- 必ず agent-teams（TeamCreate）を使用してチームを構成し、複数エージェントで並列処理すること
- サブエージェントに y/n 確認は求めず、直接作業を実施して結果を返すよう指示すること
- ブランチを作成する前に、必ずメインブランチ（main または master）に移動して `git pull` を実行し、ソースを最新化すること
- Issue は連携済みのため新規作成不要

## チーム構成

以下の3エージェント構成でチームを作成してください：

### 1. analyzer（Issue 解析・既存実装調査担当）
- **subagent_type**: general-purpose
- **役割**: GitHub Issue の解析と関連する既存実装の調査
- **作業内容**:
  - `gh issue view` で Issue の内容を取得・解析
  - プロジェクト内の既存実装を調査
  - CLAUDE.md や .claude/rules/ のルールを確認
  - 実装すべき内容と影響範囲を整理
  - 調査結果をチームリーダーに報告

### 2. developer（実装担当）
- **subagent_type**: general-purpose
- **役割**: コードの実装
- **作業内容**:
  - analyzer の調査結果を受けて実装を実施
  - CLAUDE.md や .claude/rules/ のルールに準拠
  - テストも合わせて作成
  - 実装完了をチームリーダーに報告

### 3. reviewer（テスト・レビュー・Git 担当）
- **subagent_type**: general-purpose
- **役割**: コードレビュー、テスト実行、Git 操作
- **作業内容**:
  - developer の実装完了後に実施
  - テスト実行
  - コードレビュー（ルール準拠、整合性チェック）
  - Git 操作:
    - ブランチ作成（feature/ または fix/ 形式、Issue 番号含む）
    - コミット（日本語メッセージ）
    - プッシュ
    - プルリクエスト作成（日本語、Issue 連携）

## 実行フロー

```
Phase 1: 解析（単体）
  analyzer → Issue 解析・既存実装調査

Phase 2: 実装（Phase 1 完了後）
  developer → コード実装・テスト作成

Phase 3: レビュー・Git（Phase 2 完了後）
  reviewer → テスト実行・コードレビュー・Git 操作
```

## タスク管理

TaskCreate/TaskUpdate/TaskList を使用してタスクの進捗を管理してください：
1. 各エージェントの作業を TaskCreate で登録
2. 依存関係を addBlockedBy で設定
3. 作業開始時に in_progress、完了時に completed に更新

## 作業指示の共通事項

全エージェントに以下を指示してください：
- y/n 確認は一切不要、直接作業を実施すること
- 作業完了後はチームリーダーに SendMessage で報告すること
- 日本語で回答すること

## あなた（チームリーダー）のタスク

1. TeamCreate でチーム作成
2. TaskCreate でタスク登録・依存関係設定
3. 各 Phase 順にエージェントを起動・調整
4. analyzer の結果を developer に共有
5. 全エージェントの作業完了後、結果サマリーをユーザーに報告
   - 実装・更新されたファイルパスと内容を日本語で要約して説明
6. チーム解散（TeamDelete）

## 使用方法

```
/dev-issue-team <Issue番号>
```

例:
```
/dev-issue-team #42
/dev-issue-team #123
```
