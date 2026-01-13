naver辞書の検索候補APIで、単語から単語IDを参照
https://ac-dict.naver.com/koja/ac?n_katahira=0&st=11&r_lt=11&q=[ここに単語]

例:https://ac-dict.naver.com/koja/ac?n_katahira=0&st=11&r_lt=11&q=%EA%B0%90%EC%82%AC ←감사
リターン:
// 20260109233727
// https://ac-dict.naver.com/koja/ac?n_katahira=0&st=11&r_lt=11&q=%EA%B0%90%EC%82%AC

{
  "query": [
    "감사"
  ],
  "items": [
    [
      [
        [
          "감사"
        ],
        [
          ""
        ],
        [
          ""
        ],
        [
          "かんしゃ【感謝】"
        ],
        [
          "d80cd41e6223411b97c8b2ee0974ce2b"
        ],
        [
          "koja"
        ]
      ],
      [
        （同じ構造）
      ]

    ]
  ]
}


このように配列で格納されています。さて、配列のitem内の数分、このIDから以下のAPIを参照してください

```
//감수하다で行ったもの がさっきのID
fetch(
  "https://korean.dict.naver.com/api3/koja/search?query=%EA%B0%90%EC%88%98%ED%95%98%EB%8B%A4&m=mobile&shouldSearchVlive=true&hid=176797066104610140",
  {
    method: "GET",
    credentials: "include", // ← Cookie を送る（超重要）
    headers: {
      "accept": "*/*",
      "accept-language": "ja,en;q=0.9,ko;q=0.6",
      "user-agent": navigator.userAgent,
      "referer": "https://korean.dict.naver.com/kojadict/",
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty"
    }
  }
)
.then(res => res.json())
.then(data => {
  console.log("レスポンス:", data);
})
.catch(err => {
  console.error("fetch error:", err);
});
```
この結果をapiresultexample.jsonに記しました。
私がここで取ってきてほしいのは,example.itemsの中身の配列で、
- expExample1
- expExample2
- expEntry
を配列mapで取ってきてほしいです。

最終的に返すのは、
/api/dic?word=[単語] でGETする形にします
[
    {
        word: //ここに韓国語単語,
        mean: //意味,
    },
    ....繰り返す
]

これを最初のAPIの単語の数だけ行ってください

例文に関しては
/api/exp?word=[単語]でお願いします