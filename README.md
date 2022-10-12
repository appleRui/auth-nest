<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Docker +  NestJS + TypeORM

Docker + NestJS + Typeorm の開発環境


参考リポジトリ：https://github.com/sig-code/nest-sample


### 起動
```
cp .env.exmaple .env
docker compose up -d --build
```

### 動作内容
[✓] Email & Passwordで認証

[✓] JWT認証

[✓] 各ルートで認証ガードが行われる(ミドルウェア・認証ガード)

[✓] ユーザーの作成

[✓] ログインのたびに、確認トークン(verifyToken)の発行

[✓] AuthenticationとverifyTokenの2つで認証を行う

[✓] MailGridを使用したメール認証

### MailGridライセンス
[ライセンス](https://support.sendgrid.kke.co.jp/hc/ja/articles/205590193?_gl=1*1rcm4yq*_ga*NjExOTUzMzgwLjE2NjU0MDAzODA.*_ga_JL4V7PSVHH*MTY2NTQwMDM3OS4xLjEuMTY2NTQwMDg4Ni4wLjAuMA..&_ga=2.69356825.826743628.1665400380-611953380.1665400380)


