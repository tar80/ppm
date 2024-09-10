# ppx-plugin-manager

TORO氏作のファイル操作ツール集Paper Plane xUIのプラグイン(設定集)を
設定・管理するためのプラグインマネージャー(β版)です。

## 動作環境

- UNICODE版、64bit版のPPxが対象。MultiByte版は動作対象外となります。  
その他の条件として、

  - PPxScriptModule、KeyModule、MessageModule、TextModule、WindowModuleの導入
  - 正規表現ライブラリbregonig.dllの導入
  - gitのインストール

  が必要になります。

### ToDo

- プラグインの新仕様への対応
- バグ取り

## PLUGINS

新仕様対応状況

- [x] [ppm-adjacentdir](https://github.com/tar80/ppm-adjacentdir) 隣接するディレクトリへ移動
- [x] [ppm-comment](https://github.com/tar80/ppm-comment) コメント回りの設定
- [x] [ppm-comppath](https://github.com/tar80/ppm-comppath) パス補完一行編集
- [x] [ppm-edit](https://github.com/tar80/ppm-edit) PPeや一行編集のキー設定などいろいろ
- [x] [ppm-etp](https://github.com/tar80/ppm-etp) Everything Search Moduleの設定サポート
- [x] [ppm-fileoperation](https://github.com/tar80/ppm-fileoperation) ファイル操作全般
- [x] [ppm-grep](https://github.com/tar80/ppm-grep) grepの結果を指定した方法で出力
- [x] [ppm-iconicfont](https://github.com/tar80/ppm-iconicfont) 拡張子アイコン絵文字設定のサポート
- [x] [ppm-listfile](https://github.com/tar80/ppm-listfile) リストファイルの操作を補強
- [x] [ppm-misc](https://github.com/tar80/ppm-misc) 細々としたカスタマイズの詰め合わせ
- [ ] [ppm-rclone](https://github.com/tar80/ppm-rclone) オンラインストレージを仮想ドライブとして展開
- [x] [ppm-theme](https://github.com/tar80/ppm-theme) mbadolato/iTerm2-Color-Schemesから配色設定を参照
- [x] [ppm-translate](https://github.com/tar80/ppm-translate) 日本語/英語の相互翻訳
- [x] [ppm-switchmenu](https://github.com/tar80/ppm-switchmenu) 入れ替え可能なプリセットメニュー
- [ ] [ppm-view](https://github.com/tar80/ppm-view) PPv設定集
- [x] [ppm-vilikekeys](https://github.com/tar80/ppm-vilikekeys) viキーバインドをエミュレート
