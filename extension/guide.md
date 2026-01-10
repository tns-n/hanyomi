# 概要
韓国語学習用拡張機能(yomichanのようなもの)

APIガイドは../backend/readme.mdにあります
- 文字を選択すると /api/dic/?word=[選択した文字] が呼び出される

- それをもとに、選択した文字の右下にポップアップが参照される。デザインはpopup.htmlを参照してください。
- word-formにword, meaning-textにmeanが入ります。また、選択した文字に対する結果が複数ある（wordが同じものが複数ある場合のために、その数だけmeaning-entryを繰り返してください。dividerを忘れないこと。

例文機能を呼び出す必要は今はありません。

Reactとnodejsで実装してください