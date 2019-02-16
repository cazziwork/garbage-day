7z.exe a build\target.zip .\node_modules\ .\src .\package.json
aws lambda update-function-code --profile copipa777 --function-name alexa-garbage-day --zip-file fileb://./build/target.zip
