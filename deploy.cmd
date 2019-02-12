7z.exe a build\garbage-day.zip .\node_modules\ .\src .\package.json
aws lambda update-function-code --profile default --function-name garbage-day --zip-file fileb://./build/garbage-day.zip
