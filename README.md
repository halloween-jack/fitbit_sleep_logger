# Fitbit Web APIのトークンを取得するスクリプト

## 使い方

1. [Fitbitアプリの設定を行う](https://dev.fitbit.com/appsFitbit)

    OAuth 2.0 Application TypeはPersonalに設定

2. 環境変数を設定

    ```
    $ cp .env.example .env
    ```

3. ngrokを起動して内部サーバーを公開

    ```
    $ ngrok http --domain=your_custom_domain 3000
    ```

4. 実行してトークン情報を取得

    ```
    $ cd scripts
    $ go run cmd/main.go
    ```

5. 取得したトークン情報をKVに保存

    ```
    $ cd server
    $ npx wrangler kv:key put credentials [token_values] --namespace-id [your-kv-namespace-id]
    ```

6. server/wrangler.tomlを追加

    ```
    name = "your-worker-name"
    compatibility_date = "2024-01-01"
    compatibility_flags = ["nodejs_compat"]

    [triggers]
    crons = ["15 17 * * *"]

    [[kv_namespaces]]
    binding = "FITBIT_SLEEP_LOGGER"
    id = "your-kv-id"
    preview_id = "your-kv-preview-id"

    [[r2_buckets]]
    binding = "FITBIT_SLEEP_LOGGER_BUCKET"
    bucket_name = "your-r2-bucket-name"
    ```

7. デプロイ

    ```
    $ npm run deploy
    ```

8. cloudflareの管理画面でworkerの環境変数をセット

    ```
    CLIENT_ID=
    CLIENT_SECRET=
    ```
