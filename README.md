## デプロイ手順

`7z.exe a build\garbage-day.zip .\node_modules\ .\index.js .\package.json`

`aws lambda update-function-code --profile <aws_profile> --function-name <function_name> --zip-file fileb://./build/garbage-day.zip`
