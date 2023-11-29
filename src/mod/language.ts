export const langInstaller = {
  en: {
    abort: 'Aborted',
    failedToMove: 'Failed to move the ppm directory',
    gitspec: 'Specify the directory where git is installed',
    homespec: 'Specify ppm install directory',
    overwrite: 'ppm cache exists. Do you want to overwrite the installation?',
    start: 'Start installing ppm',
    devmode: 'Install in developer mode'
  },
  jp: {
    abort: '中止しました',
    failedToMove: 'ppmディレクトリを移動できませんでした',
    gitspec: 'gitのインストールディレクトリを指定してください',
    homespec: 'ppmのインストールディレクトリを指定してください',
    overwrite: 'ppmのキャッシュが存在します。上書きインストールしますか？',
    start: 'ppmのインストールを開始します',
    devmode: '開発者モードでインストールします'
  }
} as const;

export const langPPmInstall = {
  en: {
    abort: 'Installation aborted.',
    success: 'Installation will de successful.',
    complete: 'Installation completed.',
    beforeEdit: 'Run',
    beforeCompare: 'Default settings updated.',
    afterMsg: 'and set up ppx-plugin-manager!',
    choice: 'Chose an action'
  },
  jp: {
    abort: 'インストールを中止しました',
    success: 'インストール可能です',
    complete: 'インストールが完了しました',
    beforeEdit: '初期設定のため',
    beforeCompare: '初期設定が更新されたため',
    afterMsg: 'を実行してください',
    choice: 'コマンドを選択してください'
  }
} as const;

export const langParser = {
  en: {
    badGrammar: 'Bad grammar found',
    isEarlier: 'is declared even though the section has not started',
    badDeletion: 'You cannot specify a value for the deletion setting',
    doNotDelete: 'Deleting prorerties in the base.cfg is not allowed',
    failedToGet: 'Failed to get installation information for',
    isNotPlugin: ' is not a ppm-plugin repository'
  },
  jp: {
    badGrammar: '書式が間違っています',
    isEarlier: 'の開始が宣言されていません',
    badDeletion: '削除設定には値を指定できません',
    doNotDelete: 'base.cfg内でのプロパティの削除はできません',
    failedToGet: 'インストール情報を取得できません',
    isNotPlugin: 'はppmプラグインではありません'
  }
} as const;

export const langConfiguration = {
  en: {
    notInstalled: 'ppm is not installed'
  },
  jp: {
    notInstalled: 'ppmがインストールされていません'
  }
} as const;

export const langPluginInstall = {
  en: {
    failedClone: 'git clone failed',
    notFound: 'URL does not exist, or is not a ppm-plugin repository',
    couldNotGet: 'Could not get'
  },
  jp: {
    failedClone: 'git clone に失敗しました',
    notFound: '指定したURLが間違っているか、ppmのプラグインではありません',
    couldNotGet: '取得できませんでした'
  }
} as const;

export const langPluginCleanup = {
  en: {
    clean: 'There is nothing to clean',
    askContinue: 'Would you like to clean the following plugins?',
    success: 'Cleaning completed',
    failed: 'Cleaning failed'
  },
  jp: {
    clean: '削除できるプラグインはありません',
    askContinue: 'これらのプラグインを削除しますか？',
    success: '未使用のプラグインを削除しました',
    failed: '削除に失敗しました'
  }
} as const;

export const langRestoreRegister = {
  en: {
    registered: 'Registered *ppmRestore',
    notRegistered: 'Not registered *ppmRestore',
    reg: '*ppmRestore registered',
    unreg: '*ppmRestore unregistered',
    failed: '*ppmRestore registration failed'
  },
  jp: {
    registered: '*ppmRestoreは登録済みです',
    notRegistered: '*ppmRestoreは未登録です',
    reg: '*ppmRestoreを登録しました',
    unreg: '*ppmRestoreを解除しました',
    failed: '*ppmRestoreの登録に失敗しました'
  }
} as const;

export const langRestore = {
  en: {
    notEnoughArgument: 'Not enough arguments',
    notExist: ' is not exists',
    restart: 'Restart PPc'
  },
  jp: {
    notEnoughArgument: '引数が足りません',
    notExist: ' はありません',
    restart: '再起動します'
  }
} as const;

export const langPluginRegister = {
  en: {
    notRegistered: ' is not registerd.',
    failedOverride: 'Failed to update S_ppm#sources',
    failedPluginList: 'Failed to update the pluginlist',
    failedCompList: 'Failed to update the plugin CompList',
    cannotUndo: 'There are no configuration files to undo',
    undo: 'Undo completed. Please restart PPx',
    completed: 'Exit with ESC key'
  },
  jp: {
    notRegistered: ' は未登録です',
    failedOverride: 'S_ppm#sourcesを更新できませんでした',
    failedPluginList: 'プラグインリストを更新できませんでした',
    failedCompList: 'プラグイン補完リストを更新できませんでした',
    cannotUndo: 'アンドゥ対象の設定ファイルはありません',
    undo: 'アンドゥが完了しました。PPxを再起動してください',
    completed: 'ESCキーで終了します'
  }
} as const;

export const langPluginUpdate = {
  en: {
    detached: 'Branch is detached',
    failedToGet: 'Failed to get branch',
    noUpdates: 'No updates',
    updates: 'Update has been completed'
  },
  jp: {
    detached: 'ブランチはデタッチ状態です',
    failedToGet: 'ブランチの取得に失敗しました',
    noUpdates: '更新はありません',
    updates: '更新が完了しました'
  }
} as const;

export const langManageConfig = {
  en: {
    emptyCfgdir: '"S_ppm#user:cfgdir" value is invalid.',
    desc: 'Please mark entries you want to read\\nIf you close PPc with anything other than ""ESC"", there will be no selection.',
    save: 'Save selected entries',
    cancel: 'Cancel',
    success: 'Saved'
  },
  jp: {
    emptyCfgdir: 'S_ppm#user:cfgdir の値が不正です',
    desc: '読み込みたい順番にマークしてください\\n""ESC""以外で終了すると指定なしになります',
    save: '選択したエントリを保存',
    cancel: '中止',
    success: '保存しました'
  }
} as const;

export const langCommand = {
  en: {
    nameSpec: 'Specify the source',
    shiftEnter: '([Support Dialog]: shift + enter)',
    invalidCmd: 'An invalid command was specified',
    invalidName: 'is invalid',
    cannotUnset: ' cannot be unset',
    pluginInstall: 'Start installing plugins',
    pluginUpdate: 'Update plugin',
    pluginRegister: 'Update plugin settings',
    loadCfg: 'Specify the file to load',
    open: '/edit  Specify file',
    opendiff: '/compare  Specify the file to compare',
    finish: 'completed',
    updateTrial: '&Trial'
  },
  jp: {
    nameSpec: 'プラグインを指定',
    shiftEnter: '([補助ダイアログ]: shit + enter)',
    invalidCmd: '無効なコマンドが指定されました',
    invalidName: 'を取得できませんでした',
    cannotUnset: ' は解除できません',
    pluginInstall: 'プラグインのインストールを開始します',
    pluginUpdate: 'プラグインを更新します',
    pluginRegister: 'プラグイン設定を更新します',
    loadCfg: '読み込むファイルを指定',
    open: '/edit  ファイルを指定',
    opendiff: '/compare  比較するファイルを指定',
    finish: '完了',
    updateTrial: '試行(&T)'
  }
} as const;

export const langUninstaller = {
  en: {
    notRegistered: 'Not installed',
    start: 'Start uninstalling ppm',
    finish: 'Uninstallation completed. Restart PPc'
  },
  jp: {
    notRegistered: 'インストールされていません',
    start: 'ppmのアンインストールを開始します',
    finish: 'アンインストールが完了しました。PPcを再起動します'
  }
} as const;

export const langLogViewer = {
  en: {
    notExist: 'No data'
  },
  jp: {
    notExist: 'ログはありません'
  }
} as const;

export const langViewerAction = {
  en: {
    couldNotGet: 'Could not get',
    notFind: 'Could not find plugin name',
    customize: 'Do you want to edit the configuration file?'
  },
  jp: {
    couldNotGet: '取得できませんでした',
    notFind: 'プラグイン名が見つかりませんでした',
    customize: '設定ファイルを編集しますか?'
  }
} as const;
