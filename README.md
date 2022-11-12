# ShareMoney

![top](https://user-images.githubusercontent.com/87213148/191237048-291c6372-b7c5-45f2-823a-d7a6a7feb1f8.png)
<br>

## アプリ概要

URL ▶ <a href="https://share-mny.com/" target="_blank" rel="noopener noreferrer">https://share-mny.com/</a>
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

### 1. 新規ユーザー登録 & ログインページ

- メールアドレスでの登録以外にも Google 認証も可能です
- 試使用としてゲストログインも可能です

<img src="https://user-images.githubusercontent.com/87213148/191641911-df2d817e-3695-4f6b-a441-3facae314483.png" width="600px">

<br>
<br>

### 2. プロフィール登録 & 変更ページ

- プロフィールの登録・変更を行うことが可能です
- 登録した内容は他のユーザーから閲覧されます

<img src="https://user-images.githubusercontent.com/87213148/191242802-0caf547e-b775-4b14-9490-8bc28e6a303b.png" width="600px">

<br>
<br>

### 3. レコメンド & お気に入りページ

- あなたへおすすめのユーザーを表示します
- 人気の投稿がランキング形式で表示します

<img src="https://user-images.githubusercontent.com/87213148/201472441-727e40a6-9c36-4c68-b8d0-a7912ca3dd70.png" width="600px">

<br>
<br>

### 4. MY ページ

- 登録した家計簿を表示します
- 登録した家計簿の履歴を表示します

<img src="https://user-images.githubusercontent.com/87213148/201472481-10cce16d-5b6c-4c2f-a966-8bff523824d2.png" width="600px">

<br>
<br>

### 5. 投稿家計簿一覧 & 投稿家計簿検索ページ

- 投稿した家計簿を一覧で表示します
- ユーザー名・年収・職業・世帯構成で検索することが可能です

<img src="https://user-images.githubusercontent.com/87213148/201472465-020f53d0-df5a-4049-b75c-57efd27eccd7.png" width="600px">

<br>
<br>

### 6. 家計簿投稿 ＆　編集ページ

- 各支出を詳細に投稿することが可能です
- 支出・収入をタブによって切り替えて投稿可能です

<img src="https://user-images.githubusercontent.com/87213148/201472520-6b43b2a9-67fa-4892-b2d1-14f41e2ec062.png" width="600px">

<br>
<br>

### 7. 投稿家計簿詳細ページ

- 投稿に紐づいたアイテムを表示します
- 「コメント」をつけることが可能です

<img src="https://user-images.githubusercontent.com/87213148/201472405-613dbdde-7c81-4984-bab7-d5f6ca9cec66.png" width="600px">

<br>
<br>

### 8. 保存済み家計簿表示ページ

- 別ユーザの保存した家計簿を表示します
- 別ユーザからは閲覧不可となります

<img src="https://user-images.githubusercontent.com/87213148/201472665-1d328b6a-7652-4538-9622-d731b10501fd.png" width="600px">

<br>
<br>

## 使用技術について

### フロントエンド

- 言語: JavaScript/TypeScript 4.7.4
- フレームワーク: React.js(ReduxToolKit) 17.0.2
- UI ライブラリ: TailwindCSS 2.2

### バックエンド

- 言語: PHP 7.4
- フレームワーク: Laravel 8.83.23
- DB: MySQL 5.7

### インフラ

- Docker/Docker-Compose
- CircleCi
- AWS(Route53, CloudFront, S3, ACM, VPC, ALB, ECS, Fargate, ECR, RDS)

<br>
<br>

## インフラ構成図

<img width="638" alt="構成図" src="https://user-images.githubusercontent.com/87213148/193205719-19da2de8-806a-49a3-99fb-69c4c07de5fa.png">

<br>
<br>

## ER 図

<img width="638" alt="ER図" src="https://user-images.githubusercontent.com/87213148/201473070-a07a4964-94ed-4a62-8964-8854506cbd92.png">
