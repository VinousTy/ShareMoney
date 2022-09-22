# ShareMoney

![top](https://user-images.githubusercontent.com/87213148/191237048-291c6372-b7c5-45f2-823a-d7a6a7feb1f8.png)
<br>

## アプリ概要

URL ▶
<br>
<br>

### 家計簿を共有し、お金に対する不安を軽減するサービスです。

他家計簿をシェア・共有することが可能のため、同職種や同じような世帯構成などのユーザーの家計管理術を参考にできます。
<br>
<br>
<br>

## サービスを作った背景

就職をきっかけに初めての一人暮らしを始めた際に、以下のような悩みがありました。

- 周囲の同年代は毎月どの程度貯金しているのだろうか
- 自分の支出の構成比は周囲と比較して偏りはないか
- 職種によって支出に変化はあるのか

このような"原体験"からサービスを開発しました。
<br>
<br>
<br>

## 各種機能について

### 1. 新規ユーザー登録　　& ログインページ

- メールアドレスでの登録以外にも Google 認証も可能です
- 試使用としてゲストログインも可能です

<img src="https://user-images.githubusercontent.com/87213148/191641911-df2d817e-3695-4f6b-a441-3facae314483.png" width="600px">

<br>
<br>

### 2. プロフィール登録　　& 変更ページ

- プロフィールの登録・変更を行うことが可能です
- 登録した内容は他のユーザーから閲覧されます

<img src="https://user-images.githubusercontent.com/87213148/191242802-0caf547e-b775-4b14-9490-8bc28e6a303b.png" width="600px">

<br>
<br>

### 3. レコメンド　　& お気に入りページ

- あなたへおすすめのユーザーを表示します
- 人気の投稿がランキング形式で表示します

<img src="https://user-images.githubusercontent.com/87213148/191399264-76e32cdb-0f8b-47c5-b578-6947d8caa856.png" width="600px">

<br>
<br>

### 4. MY ページ

- 登録した家計簿を表示します
- 登録した家計簿の履歴を表示します

<img src="https://user-images.githubusercontent.com/87213148/191389386-6307e18d-10f4-420d-9cac-3e38538a3821.png" width="600px">

<br>
<br>

### 5. 投稿家計簿一覧　　& 投稿家計簿検索ページ

- 投稿した家計簿を一覧で表示します
- ユーザー名・年収・職業・世帯構成で検索することが可能です

<img src="https://user-images.githubusercontent.com/87213148/191399461-6dcc1b4f-2f08-4e93-abe4-aa250a59c6d1.png" width="600px">

<br>
<br>

### 6. 家計簿投稿　＆　編集ページ

- 各支出を詳細に投稿することが可能です
- 支出・収入をタブによって切り替えて投稿可能です

<img src="https://user-images.githubusercontent.com/87213148/191399686-689e3faa-4558-47a5-bdf9-044a3a3d210a.png" width="600px">

<br>
<br>

### 7. 投稿家計簿詳細ページ

- 投稿に紐づいたアイテムを表示します
- 「コメント」をつけることが可能です

<img src="https://user-images.githubusercontent.com/87213148/191457888-43992592-70f2-4efc-9a66-440c78c9de73.png" width="600px">

<br>
<br>

### 8. 保存済み家計簿表示ページ

- 別ユーザの保存した家計簿を表示します
- 別ユーザからは閲覧不可となります

<img src="https://user-images.githubusercontent.com/87213148/191479210-9bf119d2-f2d8-4678-9c29-3b0eb566b9b8.png" width="600px">

<br>
<br>

## 使用技術について

### フロントエンド

- 言語: JavaScript/TypeScript
- フレームワーク: React.js(ReduxToolKit)
- UI ライブラリ: TailwindCSS

### バックエンド

- 言語: PHP
- フレームワーク: Laravel
- DB: MySQL

### インフラ

- Docker/Docker-Compose
- AWS

## ER 図

<img width="638" alt="ER図" src="https://user-images.githubusercontent.com/87213148/191644199-cec3207c-ff7d-4285-af97-22f38dc99a9f.png">
