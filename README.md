## デプロイ手順

`7z.exe a build\garbage-day.zip .\node_modules\ .\src .\package.json`

`aws lambda update-function-code --profile <aws_profile> --function-name <function_name> --zip-file fileb://./build/garbage-day.zip`

## ローカルDynamoDB 起動

`java -Djava.library.path=.\local-dynamo\DynamoDBLocal_lib -jar .\local-dynamo\DynamoDBLocal.jar -sharedDb`

