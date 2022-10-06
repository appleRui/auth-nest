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
docker compose up -d --build
```

### 動作内容
[✓] Email & Passwordで認証

[✓] JWT認証

[✓] 各ルートで認証ガードが行われる(ミドルウェア・認証ガード)

[✓] ユーザーの作成

[　] ログインのたびに、一時的なトークン(refresh_token)の発行

[　] Authenticationとrefresh_tokenの2つで認証を行う
