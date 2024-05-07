# Fitbit Web APIのトークンを取得するスクリプト

## 使い方

0. [Fitbitアプリの設定を行う](https://dev.fitbit.com/appsFitbit)

    OAuth 2.0 Application TypeはPersonalに設定

1. 環境変数を設定

    ```
    CLIENT_ID=
    CLIENT_SECRET=
    NGROK_DOMAIN=
    ```

2. ngrokを起動して内部サーバーを公開

    ```
    $ ngrok http --domain=your_custom_domain 3000
    ```

3. 実行

    ```
    $ cd scripts
    $ go run cmd/main.go
    ```
