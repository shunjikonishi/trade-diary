## テーブル
- 銘柄
  - 最低限の情報のみ
  - id, 名前, 企業コード, モニターステータス
- トレード履歴
  - キーはシーケンス
  - sbi証券の約定履歴のcsvを読み込めるようにする
  - 日付と銘柄idで時系列に登録
  - insertのみでupdateはなし
- 予想と結果
  - キーは日付+銘柄id
- 取引内容と反省
  - キーは日付

## Not MVP
- ルール
  - キーはシーケンス
  - 履歴も持つ
-

テーブル名: companies
カラム：
- id: sequence. PK
- name: VARCHAR(100) not null
- code: VARCHAR(5) not null
- monitor_status: int not null
- creatd_at: timestamp not null
- updated_at: timestamp not null
