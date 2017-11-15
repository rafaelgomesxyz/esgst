// Javascript version of https://github.com/erusev/parsedown made specifically for SteamGifts

Parsedown = (function() {
    // functions taken from http://locutus.io/
    
    function rtrim(string, charList) {
        charList = !charList ? ` \\s\u00A0` : `${charList}`.replace(/([[\]().?/*{}+$^:])/g, `\\$1`);
        return `${string}`.replace(new RegExp(`[${charList}]+$`, `g`), ``);
    }

    function trim(string, charList) {
        let i, n, whiteSpace;
        string += ``;
        whiteSpace = ` \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000`;
        if (charList) {
            whiteSpace = `${charList}`.replace(/([[\]().?/*{}+$^:])/g, `$1`);
        }
        for (i = 0, n = string.length; i < n; ++i) {
            if (whiteSpace.indexOf(string.charAt(i)) === -1) {
                string = string.substring(i);
                break
            }
        }
        for (i = string.length - 1; i > -1; --i) {
            if (whiteSpace.indexOf(string.charAt(i)) === -1) {
                string = string.substring(0, i + 1)
                break
            }
        }
        return whiteSpace.indexOf(string.charAt(0)) === -1 ? string : ``;
    }

    function strlen(string) {
        string = `${string}`;
        getWholeChar = (string, i) => {
            let code, next, prev;
            code = string.charCodeAt(i);
            next = prev = ``;
            if (code >= 0xD800 && code <= 0xDBFF) {
                if (string.length <= i + 1) {
                    throw new Error(`High surrogate without following low surrogate`);
                }
                next = string.charCodeAt(i + 1);
                if (next < 0xDC00 || next > 0xDFFF) {
                    throw new Error(`High surrogate without following low surrogate`);
                }
                return string.charAt(i) + string.charAt(i + 1);
            } else if (code >= 0xDC00 && code <= 0xDFFF) {
                if (i === 0) {
                    throw new Error(`Low surrogate without preceding high surrogate`);
                }
                prev = string.charCodeAt(i - 1);
                if (prev < 0xD800 || prev > 0xDBFF) {
                    throw new Error(`Low surrogate without preceding high surrogate`);
                }
                return false;
            }
            return string.charAt(i);
        };
        let i, length;
        length = 0;
        for (i = 0, n = string.length; i < n; ++i) {
            if ((getWholeChar(string, i)) === false) {
                continue
            }
            length += 1;
        }
        return length;
    }

    function strpbrk(string, charList) {
        let i, n;
        for (i = 0, n = string.length; i < n; ++i) {
            if (charList.indexOf(string.charAt(i)) >= 0) {
                return string.slice(i);
            }
        }
        return false;
    }

    let methods, variables;
    variables = {
        blockTypes: {
            [`#`]: [`Header`],
            [`*`]: [`Rule`, `List`],
            [`+`]: [`List`],
            [`-`]: [`SetextHeader`, `Table`, `Rule`, `List`],
            [`0`]: [`List`],
            [`1`]: [`List`],
            [`2`]: [`List`],
            [`3`]: [`List`],
            [`4`]: [`List`],
            [`5`]: [`List`],
            [`6`]: [`List`],
            [`7`]: [`List`],
            [`8`]: [`List`],
            [`9`]: [`List`],
            [`:`]: [`Table`],
            [`<`]: [`Comment`, `Markup`],
            [`=`]: [`SetextHeader`],
            [`>`]: [`Quote`],
            [`[`]: [`Reference`],
            [`_`]: [`Rule`],
            [`\``]: [`FencedCode`],
            [`|`]: [`Table`],
            [`~`]: [`FencedCode`]
        },
        breaksEnabled: false,
        definitionData: {},
        emRegex: {
            [`*`]: /^[*]((?:\\\\\*|[^*]|[*][*][^*]+?[*][*])+?)[*](?![*])/,
            [`_`]: /^_((?:\\\\_|[^_]|__[^_]*__)+?)_(?!_)\b/u
        },
        inlineMarkerList: `!"*_&[:<>\`~\\`,
        inlineTypes: {
            [`"`]: [`SpecialCharacter`],
            [`!`]: [`Image`],
            [`&`]: [`SpecialCharacter`],
            [`*`]: [`Emphasis`],
            [`:`]: [`Url`],
            [`<`]: [`UrlTag`, `EmailTag`, `Markup`, `SpecialCharacter`],
            [`>`]: [`SpecialCharacter`],
            [`[`]: [`Link`],
            [`_`]: [`Emphasis`],
            [`\``]: [`Code`],
            [`~`]: [`Strikethrough`],
            [`\\`]: [`EscapeSequence`],
        },
        markupEscaped: false,
        regexHtmlAttribute: `[a-zA-Z_:][\w:.-]*(?:\s*=\s*(?:[^"\'=<>\`\s]+|"[^"]*"|\'[^\']*\'))?`,
        specialCharacters: [`\\`, `\``, `*`, `_`, `{`, `}`, `[`, `]`, `(`, `)`, `>`, `#`, `+`, `-`, `.`, `!`, `|`],
        strongRegex: {
            [`*`]: /^[*]{2}((?:\\\\\*|[^*]|[*][^*]*[*])+?)[*]{2}(?![*])/,
            [`_`]: /^__((?:\\\\_|[^_]|_[^_]*_)+?)__(?!_)/u
        },
        textLevelElements: [
            `a`, `br`, `bdo`, `abbr`, `blink`, `nextid`, `acronym`, `basefont`,
            `b`, `em`, `big`, `cite`, `small`, `spacer`, `listing`,
            `i`, `rp`, `del`, `code`,          `strike`, `marquee`,
            `q`, `rt`, `ins`, `font`,          `strong`,
            `s`, `tt`, `kbd`, `mark`,
            `u`, `xm`, `sub`, `nobr`,
                       `sup`, `ruby`,
                       `var`, `span`,
                       `wbr`, `time`
        ],
        unmarkedBlockTypes: [`Code`],
        urlsLinked: true,
        voidElements: [`area`, `base`, `br`, `col`, `command`, `embed`, `hr`, `img`, `input`, `link`, `meta`, `param`, `source`]
    };
    methods = {
        lines: lines => {
            let block, blocks, blockType, blockTypes, currentBlock, i, j, indent, line, marker, markup, n1, n2, parts, text;
            currentBlock = null;            
            blocks = [];
            main: for (i = 0, n1 = lines.length; i < n1; ++i) {
                line = lines[i];
                if (rtrim(line) === ``) {
                    if (methods.isSet(currentBlock)) {
                        currentBlock.interrupted = true;
                    }
                    continue;
                }
                if (line.indexOf(`\t`) > -1) {
                    parts = line.split(`\t`);
                    line = parts.shift();
                    parts.forEach(part => {
                        line += `${` `.repeat(4 - line.length % 4)}${part}`; // original method: mb_strlen with UTF-8
                    });
                }
                indent = 0;
                while (methods.isSet(line[indent]) && line[indent] === ` `) {
                    indent += 1;
                }
                text = indent > 0 ? line.slice(indent) : line;
                line = {
                    body: line,
                    indent: indent,
                    text: text
                };
                if (methods.isSet(currentBlock) && methods.isSet(currentBlock.continuable)) {
                    block = methods[`block${currentBlock.type}Continue`](line, currentBlock);
                    if (methods.isSet(block)) {
                        currentBlock = block;
                        continue;
                    } else if (methods.isBlockCompletable(currentBlock.type)) {
                        currentBlock = methods[`block${currentBlock.type}Complete`](currentBlock);
                    }
                }
                marker = text[0];
                blockTypes = variables.unmarkedBlockTypes.slice(0);
                if (methods.isSet(variables.blockTypes[marker])) {
                    variables.blockTypes[marker].forEach(blockType => {
                        blockTypes.push(blockType);
                    });
                }
                for (j = 0, n2 = blockTypes.length; j < n2; ++j) {
                    blockType = blockTypes[j];
                    block = methods[`block${blockType}`](line, currentBlock);
                    if (methods.isSet(block)) {
                        block.type = blockType;
                        if (!methods.isSet(block.identified)) {
                            blocks.push(currentBlock);
                            block.identified = true;
                        }
                        if (methods.isBlockContinuable(blockType)) {
                            block.continuable = true;
                        }
                        currentBlock = block;
                        continue main;
                    }
                }
                if (methods.isSet(currentBlock) && !methods.isSet(currentBlock.type) && !methods.isSet(currentBlock.interrupted)) {
                    currentBlock.element.text += `\n${text}`;
                } else {
                    blocks.push(currentBlock);
                    currentBlock = methods.paragraph(line);
                    currentBlock.identified = true;
                }
            }
            if (methods.isSet(currentBlock) && methods.isSet(currentBlock.continuable) && methods.isBlockCompletable(currentBlock.type)) {
                currentBlock = methods[`block${currentBlock.type}Complete`](currentBlock);
            }
            blocks.push(currentBlock);
            blocks.shift();
            markup = ``;
            for (i = 0, n1 = blocks.length; i < n1; ++i) {
                block = blocks[i];
                if (methods.isSet(block.hidden)) {
                    continue;
                }
                markup += `\n${methods.isSet(block.markup) ? block.markup : methods.element(block.element)}`;
            }
            markup += `\n`;
            return markup;
        },
        isBlockContinuable: type => {
            return typeof methods[`block${type}Continue`] !== `undefined`;
        },
        isBlockCompletable: type => {
            return typeof methods[`block${type}Complete`] !== `undefined`;
        },
        isSet: element => {
            return typeof element !== `undefined` && element !== null;
        },
        blockCode: (line, block = null) => {
            if (methods.isSet(block) && !methods.isSet(block.type) && !methods.isSet(block.interrupted)) {
                return;
            }
            if (line.indent >= 4) {
                return {
                    element: {
                        handler: `element`,
                        name: `pre`,
                        text: {
                            name: `code`,
                            text: line.body.slice(4)
                        }
                    }
                };
            }
        },
        blockCodeContinue: (line, block) => {
            if (line.indent >= 4) {
                if (methods.isSet(block.interrupted)) {
                    block.element.text.text += `\n`;
                    delete block.interrupted;
                }
                block.element.text.text += `\n${line.body.slice(4)}`;
                return block;
            }
        },
        blockCodeComplete: block => {
            block.element.text.text = block.element.text.text.replace(/</g, `&lt;`).replace(/>/g, `&gt;`);
            return block;
        },
        blockComment: line => {
            if (variables.markupEscaped) {
                return;
            }
            if (methods.isSet(line.text[3]) && line.text[3] === `-` && line.text[2] === `-` && line.text[1] === `!`) {
                let block = {
                    markup: line.body
                };
                if (line.text.match(/-->$/)) {
                    block.closed = true;
                }
                return block;
            }
        },
        blockCommentContinue: (line, block) => {
            if (methods.isSet(block.closed)) {
                return;
            }
            block.markup += `\n${line.body}`;
            if (line.text.match(/-->$/)) {
                block.closed = true;
            }
            return block;
        },
        blockFencedCode: line => {
            let matches = line.text.match(new RegExp(`^[${line.text[0]}]{3,}[ ]*([\w-]+)?[ ]*$`));
            if (matches) {
                let element = {
                    name: `code`,
                    text: ``
                };
                if (methods.isSet(matches[1])) {
                    element.attributes = {
                        class: `language-${matches[1]}`
                    };
                }
                return {
                    char: line.text[0],
                    element: {
                        handler: `element`,
                        name: `pre`,
                        text: element
                    }
                };
            }
        },
        blockFencedCodeContinue: (line, block) => {
            if (methods.isSet(block.complete)) {
                return;
            }
            if (methods.isSet(block.interrupted)) {
                block.element.text.text += `\n`;
                delete block.interrupted;
            }
            if (line.text.match(new RegExp(`^${block.char}{3,}[ ]*$`))) {
                block.element.text.text = block.element.text.text.slice(1);
                block.complete = true;
                return block;
            }
            block.element.text.text += `\n${line.body}`;
            return block;
        },
        blockFencedCodeComplete: block => {
            block.element.text.text = block.element.text.text.replace(/</g, `&lt;`).replace(/>/g, `&gt;`);
            return block;
        },
        blockHeader: line => {
            if (methods.isSet(line.text[1])) {
                let level = 1;
                while (methods.isSet(line.text[level]) && line.text[level] === `#`) {
                    level += 1;
                }
                if (level > 6) {
                    return;
                }
                return {
                    element: {
                        handler: `line`,
                        name: `h${Math.min(6, level)}`,
                        text: trim(line.text, `# `)
                    }
                };
            }
        },
        blockList: line => {
            let matches, name, pattern;
            [name, pattern] = line.text[0] <= `-` ? [`ul`, `[*+-]`] : [`ol`, `[0-9]+[.]`];
            matches = line.text.match(new RegExp(`^(${pattern}[ ]+)(.*)`));
            if (matches) {
                let block = {
                    element: {
                        handler: `elements`,
                        name: name
                    },
                    indent: line.indent,
                    pattern: pattern
                };
                if (name === `ol`) {
                    let listStart = matches[0].slice(0, matches[0].indexOf(`.`));
                    if (listStart !== `1`) {
                        block.element.attributes = {
                            start: listStart
                        };
                    }
                }
                block.li = {                    
                    handler: `li`,
                    name: `li`,
                    text: [matches[2]]
                };
                block.element.text = [block.li]; // original attribution: []= &
                return block;
            }
        },
        blockListContinue: (line, block) => {
            let matches = line.text.match(new RegExp(`^${block.pattern}(?:[ ]+(.*)|$)`));
            if (block.indent === line.indent && matches) {
                if (methods.isSet(block.interrupted)) {
                    block.li.text.push(``);
                    delete block.interrupted;
                }
                delete block.li;
                block.li = {
                    handler: `li`,
                    name: `li`,
                    text: [methods.isSet(matches[1]) ? matches[1] : ``]
                };
                block.element.text.push(block.li);
                return block;
            }
            if (line.text[0] === `[` && methods.blockReference(line)) {
                return block;
            }
            if (!methods.isSet(block.interrupted)) {
                block.li.text.push(line.body.replace(/^[ ]{0,4}/, ``));
                return block;
            }
            if (line.indent > 0) {
                block.li.text.push(``);
                block.li.text.push(line.body.replace(/^[ ]{0,4}/, ``));
                delete block.interrupted;
                return block;
            }
        },
        blockQuote: line => {
            let matches = line.text.match(/^>[ ]?(.*)/);
            if (matches) {
                return {
                    element: {
                        handler: `lines`,
                        name: `blockquote`,
                        text: [matches[1]]
                    }
                };
            }
        },
        blockQuoteContinue: (line, block) => {
            let matches = line.text.match(/^>[ ]?(.*)/);
            if (line.text[0] === `>` && matches) {
                if (methods.isSet(block.interrupted)) {
                    block.element.text.push(``);
                    delete block.interrupted;
                }
                block.element.text.push(matches[1]);
                return block;
            }
            if (!methods.isSet(block.interrupted)) {
                block.element.text.push(line.text);
                return block;
            }
        },
        blockRule: line => {
            if (line.text.match(new RegExp(`^([${line.text[0]}])([ ]*\\1){2,}[ ]*$`))) {
                return {
                    element: {
                        name: `hr`
                    }
                };
            }
        },
        blockSetextHeader: (line, block = null) => {
            if (!methods.isSet(block) || methods.isSet(block.type) || methods.isSet(block.interrupted)) {
                return;
            }
            if (rtrim(line.text, line.text[0]) === ``) {
                block.element.name = line.text[0] === `=` ? `h1` : `h2`;
                return block;
            }
        },
        blockMarkup: line => {
            if (variables.markupEscaped) {
                return;
            }
            let matches = line.text.match(new RegExp(`^<(\w*)(?:[ ]*${variables.regexHtmlAttribute})*[ ]*(\/)?>`));
            if (matches) {
                if (variables.textLevelElements.indexOf(matches[1].toLowerCase()) > -1) {
                    return;
                }
                let block, remainder;
                block = {
                    depth: 0,
                    markup: line.text,
                    name: matches[1]
                };
                remainder = line.text.slice(strlen(matches[0]));
                if (trim(remainder) === ``) {
                    if (methods.isSet(matches[2]) || variables.voidElements.indexOf(matches[1]) > -1) {
                        block.closed = true;
                        block.void = true;
                    }
                } else {
                    if (methods.isSet(matches[2]) || variables.voidElements.indexOf(matches[1]) > -1) {
                        return;
                    }
                    if (remainder.match(new RegExp(`<\/${matches[1]}>[ ]*$`, `i`))) {
                        block.closed = true;
                    }
                }
                return block;
            }
        },
        blockMarkupContinue: (line, block) => {
            if (methods.isSet(block.closed)) {
                return;
            }
            if (line.text.match(new RegExp(`^<${block.name}(?:[ ]*${variables.regexHtmlAttribute})*[ ]*>`, `i`))) {
                block.depth += 1;
            }
            let matches = line.text.match(new RegExp(`(.*?)<\/${block.name}>[ ]*$`, `i`));
            if (matches) {
                if (block.depth > 0) {
                    block.depth -= 1;
                } else {
                    block.closed = true;
                }
            }
            if (methods.isSet(block.interrupted)) {
                block.markup += `\n`;
                delete block.interrupted;
            }
            block.markup += `\n${line.body}`;
            return block;
        },
        blockReference: line=> {
            let matches = line.text.match(/^\[(.+?)\]:[ ]*<?(\S+?)>?(?:[ ]+["\'(](.+)["\')])?[ ]*$/);
            if (matches) {
                let data = {
                    title: null,
                    url: matches[2]
                };
                if (methods.isSet(matches[3])) {
                    data.title = matches[3];
                }
                variables.definitionData.Reference[matches[1].toLowerCase()] = data;
                return {
                    hidden: true
                };
            }
        },
        blockTable: (line, block = null) => {
            if (!methods.isSet(block) || methods.isSet(block.type) || methods.isSet(block.interrupted)) {
                return;
            }
            if (block.element.text.indexOf(`|`) > -1 && rtrim(line.text, ` -:|`) === ``) {
                let alignment, alignments, dividerCell, dividerCells, headerCell, headerCells, headerElement, headerElements, i, n;
                alignments = [];
                dividerCells = trim(trim(line.text), `|`).split(`|`);
                for (i = 0, n = dividerCells.length; i < n; ++i) {
                    dividerCell = trim(dividerCells[i]);
                    if (dividerCell === ``) {
                        continue;
                    }
                    alignment = null;
                    if (dividerCell[0] === `:`) {
                        alignment = `left`;
                    }
                    if (dividerCell.slice(-1) === `:`) {
                        alignment = alignment === `left` ? `center` : `right`;
                    }
                    alignments.push(alignment);
                }
                headerElements = [];
                headerCells = trim(trim(block.element.text), `|`).split(`|`);
                for (i = 0, n = headerCells.length; i < n; ++i) {
                    headerCell = trim(headerCells[i]);
                    headerElement = {
                        handler: `line`,
                        name: `th`,
                        text: headerCell
                    };
                    if (methods.isSet(alignments[i])) {
                        alignment = alignments[i];
                        headerElement.attributes = {
                            style: `text-align: ${alignment};`
                        };
                    }
                    headerElements.push(headerElement);
                }
                block = {
                    alignments: alignments,
                    element: {
                        handler: `elements`,
                        name: `table`,
                        text: []
                    },
                    identified: true
                };
                block.element.text.push({
                    handler: `elements`,
                    name: `thead`,
                    text: []
                });
                block.element.text.push({
                    handler: `elements`,
                    name: `tbody`,
                    text: []
                });
                block.element.text[0].text.push({
                    handler: `elements`,
                    name: `tr`,
                    text: headerElements,
                });
                return block;
            }
        },
        blockTableContinue: (line, block) => {
            if (methods.isSet(block.interrupted)) {
                return;
            }
            if (line.text[0] === `|` || line.text.indexOf(`|`) > -1) {
                let element, elements, i, matches, n;
                elements = [];
                matches = trim(trim(line.text), `|`).match(/(?:(\\\\[|])|[^|`]|`[^`]+`|`)+/g);
                for (i = 0, n = matches.length; i < n; ++i) {
                    element = {
                        handler: `line`,
                        name: `td`,
                        text: trim(matches[i])
                    };
                    if (methods.isSet(block.alignments[i])) {
                        element.attributes = {
                            style: `text-align: ${block.alignments[i]};`
                        };
                    }
                    elements.push(element);
                }
                element = {
                    handler: `elements`,
                    name: `tr`,
                    text: elements,
                };
                block.element.text[1].text.push(element);
                return block;
            }
        },
        paragraph: line => {
            return {
                element: {
                    handler: `line`,
                    name: `p`,
                    text: line.text
                }
            };
        },
        line: text => {
            let excerpt, i, inline, inlineType, marker, markerPosition, markup, n;
            markup = ``;
            main: while (excerpt = strpbrk(text, variables.inlineMarkerList)) {
                marker = excerpt[0];
                markerPosition = text.indexOf(marker);
                excerpt = {
                    context: text,
                    text: excerpt
                };
                for (i = 0, n = variables.inlineTypes[marker].length; i < n; ++i) {
                    inlineType = variables.inlineTypes[marker][i];
                    inline = methods[`inline${inlineType}`](excerpt);
                    if (!methods.isSet(inline)) {
                        continue;
                    }
                    if (methods.isSet(inline.position) && inline.position > markerPosition) {
                        continue;
                    }
                    if (!methods.isSet(inline.position)) {
                        inline.position = markerPosition;
                    }
                    markup += `${methods.unmarkedText(text.slice(0, inline.position))}${methods.isSet(inline.markup) ? inline.markup : methods.element(inline.element)}`;
                    text = text.slice(inline.position + inline.extent);
                    continue main;
                }
                markup += methods.unmarkedText(text.slice(0, markerPosition + 1));
                text = text.slice(markerPosition + 1);
            }
            markup += methods.unmarkedText(text);
            return markup;
        },
        inlineCode: excerpt => {
            let marker, matches;
            marker = excerpt.text[0];
            matches = excerpt.text.match(new RegExp(`^(${marker}+)[ ]*(.+?)[ ]*(${marker})?\\1`, `s`)); // original regex: /^('.$marker.'+)[ ]*(.+?)[ ]*(?<!'.$marker.')\1(?!'.$marker.')/s
            if (matches && !matches[3]) {
                return {                    
                    element: {
                        name: `code`,
                        text: matches[2].replace(/</g, `&lt;`).replace(/>/g, `&gt;`).replace(/[ ]*\n/, ``)
                    },
                    extent: strlen(matches[0])
                };
            }
        },
        inlineEmailTag: excerpt => {
            let matches = excerpt.text.match(/^<((mailto:)?\S+?@\S+?)>/i);
            if (excerpt.text.indexOf(`>`) > -1 && matches) {
                let url = matches[1];
                if (!methods.isSet(matches[2])) {
                    url = `mailto:${url}`;
                }
                return {
                    element: {
                        name: `a`,
                        text: matches[1],
                        attributes: {
                            href: url
                        }
                    },
                    extent: strlen(matches[0])
                };
            }
        },
        inlineEmphasis: excerpt => {
            if (!methods.isSet(excerpt.text[1])) {
                return;
            }
            let emphasis, marker, matches;
            marker = excerpt.text[0];
            if (excerpt.text[1] === marker && (matches = excerpt.text.match(variables.strongRegex[marker]))) {
                emphasis = `strong`;
            } else if (matches = excerpt.text.match(variables.emRegex[marker])) {
                emphasis = `em`;
            } else {
                return;
            }
            return {
                element: {
                    handler: `line`,
                    name: emphasis,
                    text: matches[1]
                },
                extent: strlen(matches[0])
            };
        },
        inlineEscapeSequence: excerpt => {
            if (methods.isSet(excerpt.text[1]) && variables.specialCharacters.indexOf(excerpt.text[1]) > -1) {
                return {
                    extent: 2,
                    markup: excerpt.text[1]
                };
            }
        },
        inlineImage: excerpt => {
            if (!methods.isSet(excerpt.text[1]) || excerpt.text[1] !== `[`) {
                return;
            }
            excerpt.text = excerpt.text.slice(1);
            let inline, link;
            link = methods.inlineLink(excerpt);
            if (!methods.isSet(link)) {
                return;
            }
            inline = {
                element: {
                    attributes: {
                        src: link.element.attributes.href,
                        alt: link.element.text,
                        title: link.element.text
                    },
                    name: `img`
                },
                extent: link.extent + 1
            };
            let key;
            for (key in link.element.attributes) {
                if (link.element.attributes[key]) {
                    inline.element.attributes[key] = link.element.attributes[key];
                }
            }
            delete inline.element.attributes.href;
            return inline;
        },
        inlineLink: excerpt => {
            let element, extent, matches, remainder;
            element = {
                attributes: {
                    href: null,
                    title: null
                },
                handler: `line`,
                name: `a`,
                text: null
            };
            extent = 0;
            remainder = excerpt.text;
            matches = remainder.match(/\[(?:(.*\[)*)(.*?)\]/); // original regex: /\[((?:[^][]++|(?R))*+)\]/
            if (matches) {
                element.text = matches[2];
                extent += strlen(matches[2]) + 2;
                remainder = remainder.slice(extent);
            } else {
                return;
            }
            matches = remainder.match(/^\(\s*([^\s]+?)\s*\)/); // original regex: /^[(]\s*+((?:[^ ()]++|[(][^ )]+[)])++)(?:[ ]+("[^"]*"|\'[^\']*\'))?\s*[)]/
            if (matches) {
                element.attributes.href = matches[1];
                if (methods.isSet(matches[2])) {
                    element.attributes.title = matches[2].slice(1, - 1);
                }
                extent += strlen(matches[0]);
            } else {
                matches = remainder.match(/^\s*\[(.*?)\]/);
                let definition;
                if (matches) {
                    definition = (strlen(matches[1]) ? matches[1] : element.text).toLowerCase();
                    extent += strlen(matches[0]);
                } else {
                    definition = element.text.toLowerCase();
                }
                if (!methods.isSet(variables.definitionData.Reference[definition])) {
                    return;
                }
                definition = variables.definitionData.Reference[definition];
                element.attributes.href = definition.url;
                element.attributes.title = definition.title;
            }
            element.attributes.href = element.attributes.href.replace(/&/g, `&amp;`).replace(/</g, `&lt;`);
            return {
                element: element,
                extent: extent
            };
        },
        inlineMarkup: excerpt => {
            if (variables.markupEscaped || excerpt.text.indexOf(`>`) < 0) {
                return;
            }
            let matches = excerpt.text.match(/^<\/\w*[ ]*>/);
            if (excerpt.text[1] === `/` && matches) {
                return {
                    extent: strlen(matches[0]),
                    markup: matches[0],
                };
            }
            matches = excerpt.text.match(/^<!---?[^>-](?:-?[^-])*-->/);
            if (excerpt.text[1] === `!` && matches) {
                return {
                    extent: strlen(matches[0]),
                    markup: matches[0],
                };
            }
            matches = excerpt.text.match(new RegExp(`^<\w*(?:[ ]*${variables.regexHtmlAttribute})*[ ]*\/?>`));
            if (excerpt.text[1] !== ` ` && matches) {
                return {
                    extent: strlen(matches[0]),
                    markup: matches[0],
                };
            }
        },
        inlineSpecialCharacter: excerpt => {
            if (excerpt.text[0] === `&` && !excerpt.text.match(/^&#?\w+;/)) {
                return {
                    extent: 1,
                    markup: `&amp;`
                };
            }
            let specialCharacter = {
                [`>`]: `gt`,
                [`<`]: `lt`,
                [`"`]: `quot`
            };
            if (methods.isSet(specialCharacter[excerpt.text[0]])) {
                return {
                    extent: 1,
                    markup: `&${specialCharacter[excerpt.text[0]]};`
                };
            }
        },
        inlineStrikethrough: excerpt => {
            if (!methods.isSet(excerpt.text[1])) {
                return;
            }
            let matches, name, text;
            if ((matches = excerpt.text.match(/^~([^~]+?)(~+)/)) && matches[2].length === 1) {
                name = `span`;
                text = matches[1];
            } else if ((matches = excerpt.text.match(/^~~([^~]+?)(~+)/)) && matches[2].length === 2) {
                name = `del`,
                text = matches[1];
            } else if (matches = excerpt.text.match(/^~~~([^~]+?)(~+)/)) {
                switch (matches[2].length) {
                    case 3:
                        name = `span`;
                        text = `~~${matches[1]}~~`;
                        break;
                    case 4:
                        name = `del`;
                        text = `~${matches[1]}~~`;
                        break;
                    default:
                        break;
                }
            }
            if (name) {
                switch (name) {
                    case `del`:
                        return {
                            element: {
                                handler: `line`,
                                name: `del`,
                                text: text
                            },
                            extent: strlen(matches[0])
                        };
                    case `span`:
                        return {
                            element: {
                                attributes: {
                                    class: `spoiler`
                                },
                                handler: `line`,
                                name: `span`,
                                text: text
                            },
                            extent: strlen(matches[0])
                        };
                }
            } else {
                return;
            }
        },
        inlineUrl: excerpt => {
            if (variables.urlsLinked !== true || ! methods.isSet(excerpt.text[2]) || excerpt.text[2] !== `/`) {
                return;
            }
            let match = /\bhttps?:[\/]{2}[^\s<]+\b\/*/uig.exec(excerpt.context);
            if (match) {
                return {
                    element: {
                        attributes: {
                            href: match[0]
                        },
                        name: `a`,
                        text: match[0]
                    },
                    extent: strlen(match[0]),
                    position: match.index
                };
            }
        },
        inlineUrlTag: excerpt => {
            let matches = excerpt.text.match(/^<(\w+:\/{2}[^ >]+)>/i);
            if (excerpt.text.indexOf(`>`) > -1 && matches) {
                let url = matches[1].replace(/&/g, `&amp;`).replace(/</g, `&lt;`);
                return {
                    element: {
                        name: `a`,
                        text: url,
                        attributes: {
                            href: url
                        }
                    },
                    extent: strlen(matches[0])
                };
            }
        },
        unmarkedText: text => {
            if (!text) {
                return ``;
            }
            if (variables.breaksEnabled) {
                return text.replace(/[ ]*\n/g, `<br />\n`);
            } else {
                return text.replace(/(?:[ ][ ]+|[ ]*\\\\)\n/g, `<br />\n`).replace(/\s\n/g, `\n`);
            }
        },
        element: element => {
            let markup = `<${element.name}`;
            if (methods.isSet(element.attributes)) {
                let key, value;
                for (key in element.attributes) {
                    value = element.attributes[key];
                    if (value === null) {
                        continue;
                    }
                    markup += ` ${key}="${value}"`;
                }
            }
            if (methods.isSet(element.text)) {
                markup += `>`;
                if (methods.isSet(element.handler)) {
                    markup += methods[element.handler](element.text);
                } else {
                    markup += element.text;
                }
                markup += `</${element.name}>`;
            } else {
                markup += ` />`;
            }
            return markup;
        },
        elements: elements => {
            let markup = ``;
            elements.forEach(element => {
                markup += `\n${methods.element(element)}`;
            });
            markup += `\n`;
            return markup;
        },
        li: lines => {
            let markup, trimmedMarkup;
            markup = methods.lines(lines);
            trimmedMarkup = trim(markup);
            if (lines.indexOf(``) < 0 && trimmedMarkup.slice(0, 3) === `<p>`) {
                markup = trimmedMarkup.slice(3);
                i = markup.indexOf(`</p>`);
                markup = `${markup.slice(0, i)}${markup.slice(i + 4)}`;
            }
            return markup;
        }
    };

    class Parsedown {
        text(text) {
            variables.definitionData = {
                Reference: {}
            };
            let markup = methods.lines(trim(text.replace(/\r\n|\r/g, `\n`), `\n`).split(`\n`));
            markup = trim(markup, `\n`);
            return markup;
        }
        setBreaksEnabled(breaksEnabled) {
            variables.breaksEnabled = breaksEnabled;
            return this;
        }
        setMarkupEscaped(markupEscaped) {
            variables.markupEscaped = markupEscaped;
            return this;
        }
        setUrlsLinked(urlsLinked) {
            variables.urlsLinked = urlsLinked;
            return this;
        }
    }

    return Parsedown;
})();