<?php

const REGEX = [
    'DECLARATION' => '~function\s+([^)]+)\(~U',
    'USAGE' => '~(\s)(%func)\b~',
];

const MODULE_DECLARATION = [
    'STARTER' => '_MODULES.push({',
    'ENDER' => '});',
];

$moduleDeclarationEnderLen = strlen(MODULE_DECLARATION['ENDER']);


$libDir = realpath(__DIR__.'/../lib');

$jsFiles = new RegexIterator(
    new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__)),
    '/^.+\.js/i',
    RecursiveRegexIterator::GET_MATCH
);

$functionMap = [];

$files = [];
foreach ($jsFiles as $jsFilesBatch) {
    $jsFile = $jsFilesBatch[0];
    if (in_array(basename($jsFile, '.js'), ['index'])) {
        continue;
    }

    $namespace = basename(dirname($jsFile));
    if ($namespace === 'modules') {
        $namespace = '';
    }

    $files[ $jsFilesBatch[0] ] = [
        'content' => file_get_contents($jsFilesBatch[0]),
        'class' => $namespace.basename($jsFile, '.js'),
        'rootPath' => $namespace ? '../..' : '..',
    ];
}

foreach ($files as $jsFile => $fileProps) {
    $code = file_get_contents($jsFile);

    preg_match_all(REGEX['DECLARATION'], $code, $catches, PREG_PATTERN_ORDER);

    if (basename($jsFile) === 'Common.js') {
        $catches[1] = [
            'minimizePanel_add',
            'minimizePanel_addItem',
            'minimizePanel_openItem',
            'minimizePanel_alert',
            'loadFeatures',
            'processEvent',
            'getElements',
            'checkNewGiveawayInput',
            'loadNewGiveawayFeatures',
            'addNoCvGames',
            'endless_load',
            'saveComment',
            'getFeatures',
            'checkBusy',
            'checkVersion',
            'setMouseEvent',
            'createHeadingButton',
            'showPatreonNotice',
            'checkNewVersion',
            'parseMarkdown',
            'addGiveawayToStorage',
            'generateHeaderMenuItem',
            'reorderButtons',
            'repositionPopups',
            'setSetting',
            'getSetting',
            'getOldValues',
            'getFeaturePath',
            'getFeatureSetting',
            'toggleHeaderMenu',
            'getFeatureTooltip',
            'getFeatureName',
            'getFeatureNumber',
            'getFeatureNumber_2',
            'getUser',
            'saveUser',
            'checkUsernameChange',
            'addUser',
            'getUsername',
            'getSteamId',
            'saveUsers',
            'deleteUserValues',
            'getUserId',
            'checkSync',
            'setSync',
            'setAutoSync',
            'cancelSync',
            'sync',
            'syncWhitelistBlacklist',
            'syncGames',
            'getGameNames',
            'lockAndSaveGiveaways',
            'lockAndSaveDiscussions',
            'lockAndSaveGroups',
            'lookForPopups',
            'getWonGames',
            'saveAndSortContent',
            'observeChange',
            'observeNumChange',
            'checkMissingDiscussions',
            'loadMenu',
            'openPathsPopup',
            'addPath',
            'removePath',
            'validatePathRegex',
            'savePaths',
            'dismissNewOption',
            'getSMFeature',
            'addGcCategoryPanel',
            'readHrAudioFile',
            'saveHrFile',
            'setSmSource',
            'getSmSource',
            'saveSmSource',
            'addGwcrMenuPanel',
            'addGwcColorSetting',
            'addGcRatingPanel',
            'addGcRatingColorSetting',
            'addGcMenuPanel',
            'addGcColorSetting',
            'addGcAltMenuPanel',
            'addGcAltSetting',
            'addColorObserver',
            'setSMManageFilteredGiveaways',
            'loadGfGiveaways',
            'openManageUserTagsPopup',
            'filterUserTags',
            'openManageGameTagsPopup',
            'filterGameTags',
            'openManageGroupTagsPopup',
            'filterGroupTags',
            'setSMRecentUsernameChanges',
            'updateWhitelistBlacklist',
            'updateHiddenGames',
            'checkBackup',
            'loadDataManagement',
            'loadDataCleaner',
            'manageData',
            'downloadZip',
            'getZip',
            'readZip',
            'downloadFile',
            'getDataSizes',
            'loadImportFile',
            'readImportFile',
            'confirmDataDeletion',
            'checkDropboxComplete',
            'checkGoogleDriveComplete',
            'checkOneDriveComplete',
            'createLock',
            'checkLock',
            'lockAndSaveGames',
            'setThemeVersion',
            'resetColor',
            'resetOrder',
            'setSMManageFilteredUsers',
            'multiChoice',
            'exportSettings',
            'selectSwitches',
            'addStyle',
            'setTheme',
            'checkThemeTime',
            'request',
            'hideGame',
            'unhideGame',
            'requestGroupInvite',
            'checkUpdate',
            'draggable_set',
            'draggable_start',
            'draggable_enter',
            'draggable_end',
            'draggable_setTrash',
            'setCountdown',
            'round',
            'getTextNodesIn',
            'observeStickyChanges',
            'observeHeaders',
            'addSentinels',
            'setClearButton',
            'toggleClearButton',
            'clearInput',
            'fixEmojis',
            'fixEmoji',
            'getEmojiHtml',
            'getEmojiUnicode',
            'triggerOnEnter',
            'getChildByClassName',
            'escapeMarkdown',
            'escapeHtml',
            'removeDuplicateNotes',
            'capitalizeFirstLetter',
            'getTimestamp',
            'getRemainingTime',
            'getTimeSince',
            'setLocalValue',
            'getLocalValue',
            'delLocalValue',
            'validateValue',
            'closeHeaderMenu',
            'setSiblingsOpacity',
            'setHoverOpacity',
            'createUuid',
            'timeout',
            'createTooltip',
            'createOptions',
            'createResults',
            'goToComment',
            'sortContent',
            'rot',
            'buildGiveaway',
            'copyValue',
            'getParameters',
            'setMissingDiscussion',
            'filterSm',
            'unfadeSmFeatures',
            'filterSmFeature',
            'unhideSmFeature',
            'escapeRegExp',
            'getThemeUrl',
            'openThemePopup',
            'generateThemeUrl',
            'createMenuSection',
            'createSMButtons',
            'triggerSetOnEnter',
            'formatTags',
            'animateScroll',
            'reverseComments',
            'createAlert',
            'createConfirmation',
            'createFadeMessage',
            'getDataMenu',
            'openSmallWindow',
            'convertBytes',
            'getThemeCss',
            'loadChangelog',
            'createElements',
            'buildElements',
            'setEsgst',
        ];
    }

    foreach ($catches[1] as $function) {
        $funcInfo = [
            'file' => $jsFile,
            'usageRegex' => str_replace('%func', $function, REGEX['USAGE']),
        ];

        $funcInfo['objectName'] = lcfirst($fileProps['class']);

        if ($funcInfo['objectName'] === $function) {
            continue;
        }

        if (!isset($functionMap[$function])) {
            $functionMap[$function] = [];
        }

        $functionMap[$function][] = $funcInfo;
    }
}

/*$files = [
    '/home/inside/projects/js/ESGST/src/modules/Users/SentWonRatio.js' => $files['/home/inside/projects/js/ESGST/src/modules/Users/SentWonRatio.js'],
];

$functionMap = [
    'swr_add' => $functionMap['swr_add'],
];*/

$filesFixes = [];

$libs = [
    'jsUtils' =>[
        'functions' => [
            'compareTypes',
            'formatDate',
            'isNumber',
            'isObject',
            'isSet',
            'isString',
            'isValidDate',
            'parseHtml',
            'sortArray',
        ],
        'name' => 'utils',
    ],
    'parsedown' => [
        'functions' => [
            'setBreaksEnabled',
            'setMarkupEscaped',
            'setUrlsLinked',
        ],
    ],
];

foreach ($libs as &$lib) {
    foreach ($lib['functions'] as &$libFunction) {
        $libFunction = str_replace('%func', $libFunction, REGEX['USAGE']);
    }
    unset($libFunction);
}
unset($lib);

$filePrepends = [];

foreach ($files as $jsFile => &$fileProps) {
    $filesFixes[$jsFile] = [
        '~\b(esgst[.\[])~' => 'this.$1',
    ];

    $fileFixes =& $filesFixes[$jsFile];

    foreach ($functionMap as $function => $funcInfos) {
        if (count($funcInfos) > 1) {
            echo "Ambiguosly `{$jsFile}/{$function}`\n";
            continue;
        }

        list($funcInfo) = $funcInfos;

        if (!preg_match($funcInfo['usageRegex'], $fileProps['content'])) {
            continue;
        }

        $objectLink = $jsFile === $funcInfo['file']
            ? 'this'
            : "this.esgst.modules.{$funcInfo['objectName']}"
        ;

        $fileFixes[$funcInfo['usageRegex']] = "$1{$objectLink}.$2";

        /*if ($objectLink !== 'this') {
            if (!isset($fileFixes['imports'])) {
                $fileFixes['imports'] = [];
            }

            $fileFixes['imports'][$funcInfo['class']] = true;
        }*/
    }

    $fileFixes += [
        '~(function\s+)this\.~' => '$1',
        '~\bfunction\s+~' => '',
        '~async\s+~' => 'async ',
        '~let this\.~' => 'let ',
        '~const this\.~' => 'const ',
    ];

    foreach ($libs as $libName => $lib) {
        $variableName = isset($lib['name']) ? $lib['name'] : $libName;
        $libMatched = false;
        foreach ($lib['functions'] as $libFunction) {
            if (!preg_match($libFunction, $fileProps['content'])) {
                continue;
            }

            $libMatched = true;
            $fileFixes[$libFunction] = "$1{$variableName}.$2";
        }

        if ($libMatched) {
            if (!isset($filePrepends[$jsFile])) {
                $filePrepends[$jsFile] = [];
            }

            $filePrepends[$jsFile][] = 'import {'.$variableName.'}'." from '{$fileProps['rootPath']}/lib/{$libName}'";
        }
    }
}
unset($fileProps);

foreach ($filesFixes as $fileName => $fileFixes) {
    if (!$fileFixes) {
        continue;
    }

    $fileProps = $files[$fileName];
    $className = $fileProps['class'];

    $content = $fileProps['content'];
    $content = preg_replace(array_keys($fileFixes), array_values($fileFixes), $content);
    $content = str_replace('function this.', 'function ', $content);

    $content = implode("\n", [
        "import Module from '{$fileProps['rootPath']}/class/Module';",
        "",
        "class {$className} extends Module {",
        rtrim($content),
        "}",
        ""
    ]);

    /*$moduleDeclarationStart = strpos($content, MODULE_DECLARATION['STARTER']);
    if ($moduleDeclarationStart !== false) {
        $moduleDeclarationEnd = strpos($content, '});', $moduleDeclarationStart);
        $moduleDeclaration = substr($content, $moduleDeclarationStart, $moduleDeclarationEnd - $moduleDeclarationStart + $moduleDeclarationEnderLen);
        $moduleDeclarationOriginal = $moduleDeclaration;
        $moduleDeclaration = str_replace(MODULE_DECLARATION, '', $moduleDeclaration);
        $moduleDeclaration = rtrim($moduleDeclaration);
        $moduleDeclaration = preg_replace('~^(\s+[a-zA-Z0-9]+)\:~m', '$1 =', $moduleDeclaration);
        $moduleDeclaration = preg_replace('~,$~m', ';', $moduleDeclaration);
        $moduleDeclaration .= ';';

        $content = str_replace($moduleDeclarationOriginal, $moduleDeclaration, $content);
    }*/

    $content = str_replace(MODULE_DECLARATION['STARTER'], 'info = ({', $content);

    if (basename($fileName) === 'Common.js') {
        continue;
    }

    if (isset($filePrepends[$fileName])) {
        $content = implode(PHP_EOL, array_merge($filePrepends[$fileName], [$content]));
    }

    $content .= PHP_EOL."export default {$className};";

    file_put_contents($fileName, $content);
}
