import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popout } from '../../class/Popout';
import { Popup } from '../../class/Popup';
import { EMOJIS } from '../../emojis';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { permissions } from '../../class/Permissions';
import { Logger } from '../../class/Logger';
import { DOM } from '../../class/DOM';

class CommentsCommentFormattingHelper extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				[
					'ul',
					[
						[
							'li',
							[
								`When you click on any text area (in any page) to start writing a comment, a panel is added above it that helps you use SteamGifts' `,
								[
									'a',
									{ href: `https://www.steamgifts.com/about/comment-formatting` },
									'comment formatting',
								],
								'.',
							],
						],
						[
							'li',
							[
								`There is a button (`,
								['i', { class: 'fa fa-paste' }],
								' if enabled and ',
								['i', { class: 'fa fa-paste esgst-faded' }],
								` if disabled) in the panel that allows the feature to automatically format links/images pasted into the text area.`,
							],
						],
						[
							'li',
							[
								`There are also buttons (`,
								['i', { class: 'fa fa-rotate-right' }],
								' to redo and ',
								['i', { class: 'fa fa-rotate-left' }],
								` to undo) in the panel that allow you to redo/undo any formatting added.`,
							],
						],
					],
				],
			],
			features: {
				cfh_bq: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button (`,
										['i', { class: 'fa fa-quote-left' }],
										` ) to the panel that allows you to write text like shown below.`,
									],
								],
							],
						],
						['blockquote', 'Blockquote'],
					],
					name: 'Blockquote',
					sg: true,
					st: true,
				},
				cfh_b: {
					description: [
						[
							'ul',
							[
								[
									'li',
									`Adds a button (B) to the panel that allows you to write text like shown below.`,
								],
							],
						],
						['strong', 'Bold'],
					],
					name: 'Bold',
					sg: true,
					st: true,
				},
				cfh_h1: {
					description: [
						[
							'ul',
							[
								[
									'li',
									`Adds a button (H¹) to the panel that allows you to write text like shown below.`,
								],
							],
						],
						['h1', 'Heading 1'],
					],
					name: 'Heading 1',
					sg: true,
					st: true,
				},
				cfh_h2: {
					description: [
						[
							'ul',
							[
								[
									'li',
									`Adds a button (H²) to the panel that allows you to write text like shown below.`,
								],
							],
						],
						['h2', 'Heading 2'],
					],
					name: 'Heading 2',
					sg: true,
					st: true,
				},
				cfh_h3: {
					description: [
						[
							'ul',
							[
								[
									'li',
									`Adds a button (H³) to the panel that allows you to write text like shown below.`,
								],
							],
						],
						['h3', 'Heading 3'],
					],
					name: 'Heading 3',
					sg: true,
					st: true,
				},
				cfh_ic: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button (`,
										['i', { class: 'fa fa-code' }],
										` ) to the panel that allows you to write text like shown below.`,
									],
								],
							],
						],
						['p', ['Inline ', ['code', 'Code']]],
					],
					name: 'Inline Code',
					sg: true,
					st: true,
				},
				cfh_i: {
					description: [
						[
							'ul',
							[
								[
									'li',
									`Adds a button (I) to the panel that allows you to write text like shown below.`,
								],
							],
						],
						['em', 'Italic'],
					],
					name: 'Italic',
					sg: true,
					st: true,
				},
				cfh_lb: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button (`,
										['i', { class: 'fa fa-minus' }],
										`) to the panel that allows you to write text like shown below.`,
									],
								],
							],
						],
						['p', 'Line'],
						['hr'],
						['p', 'Break'],
					],
					name: 'Line Break',
					sg: true,
					st: true,
				},
				cfh_lc: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button (`,
										['i', { class: 'fa fa-code' }],
										['i', { class: 'fa fa-indent' }],
										`) to the panel that allows you to write text like shown below.`,
									],
								],
							],
						],
						['code', 'Line Code'],
					],
					name: 'Line Code',
					sg: true,
					st: true,
				},
				cfh_ol: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button (`,
										['i', { class: 'fa fa-list-ol' }],
										`) to the panel that allows you to write text like shown below.`,
									],
								],
							],
						],
						[
							'ol',
							[
								['li', 'Ordered'],
								['li', 'List'],
							],
						],
					],
					name: 'Ordered List',
					sg: true,
					st: true,
				},
				cfh_pc: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button (`,
										['i', { class: 'fa fa-code' }],
										['i', { class: 'fa fa-paragraph' }],
										`) to the panel that allows you to write text like shown below.`,
									],
								],
							],
						],
						['pre', [['code', 'Paragraph Code']]],
					],
					name: 'Paragraph Code',
					sg: true,
					st: true,
				},
				cfh_s: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button (`,
										['i', { class: 'fa fa-eye-slash' }],
										`) to the panel that allows you to write text like shown below.`,
									],
								],
							],
						],
						['span', { class: 'spoiler' }, 'Spoiler'],
					],
					name: 'Spoiler',
					sg: true,
					st: true,
				},
				cfh_st: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button (`,
										['i', { class: 'fa fa- strikethrough' }],
										`) to the panel that allows you to write text like shown below.`,
									],
								],
							],
						],
						['del', 'Strikethrough'],
					],
					name: 'Strikethrough',
					sg: true,
					st: true,
				},
				cfh_ul: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button (`,
										['i', { class: 'fa fa-list-ul' }],
										`) to the panel that allows you to write text like shown below.`,
									],
								],
							],
						],
						[
							'ul',
							[
								['li', 'Unordered'],
								['li', 'LIst'],
							],
						],
					],
					name: 'Unordered List',
					sg: true,
					st: true,
				},
				cfh_img: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button(`,
										['i', { class: 'fa fa-image' }],
										`) to the panel that allows you to add images to your comments with an interface where you can enter the title and the URL of the image and let ESGST format it.`,
									],
								],
								[
									'li',
									[
										'You can also upload images from your computer instead of using a URL. The images will be uploaded to ',
										['a', { href: `https://imgur.com` }, 'Imgur'],
										'.',
									],
								],
							],
						],
					],
					name: 'Image',
					sg: true,
					st: true,
				},
				cfh_l: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button(`,
										['i', { class: 'fa fa-globe' }],
										`) to the panel that allows you to add links to your comments with an interface where you can enter the title and the URL of the link and let ESGST format it.`,
									],
								],
							],
						],
					],
					name: 'Link',
					sg: true,
					st: true,
				},
				cfh_t: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button(`,
										['i', { class: 'fa fa-table' }],
										`) to the panel that allows you to add tables to your comments with an interface where you can dynamically add as many rows / columns as you want, align each column however you want, enter the value for each cell and let ESGST format it.`,
									],
								],
							],
						],
					],
					name: 'Table',
					sg: true,
					st: true,
				},
				cfh_e: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button(`,
										['i', { class: 'fa fa-smile-o' }],
										`) to the panel that allows you to add emojis to your comments by selecting them out of a huge list of emojis.`,
									],
								],
							],
						],
					],
					name: 'Emoji',
					sg: true,
					st: true,
				},
				cfh_g: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button(`,
										['i', { class: 'fa fa-star' }],
										`) to the panel that allows you to add encrypted giveaways(see [id=ged] for more details about them) to your comments.`,
									],
								],
							],
						],
					],
					name: 'Giveaway Encrypter',
					sg: true,
					st: true,
				},
				cfh_p: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button(`,
										['i', { class: 'fa fa-eye' }],
										`) to the panel that allows you to preview your comment before submitting it.`,
									],
								],
							],
						],
					],
					features: {
						cfh_p_a: {
							name: 'Automatically preview while typing.',
							sg: true,
							st: true,
						},
					},
					name: 'Preview',
					sg: true,
					st: true,
				},
				cfh_sr: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button(`,
										['i', { class: 'fa fa-floppy-o' }],
										` ) to the panel that allows you to save replies that you frequently use so that you can reuse them later.`,
									],
								],
							],
						],
					],
					name: 'Saved Replies',
					sg: true,
					st: true,
					features: {
						cfh_sr_s: {
							name: 'Use separate storage on SteamTrades.',
							st: true,
						},
					},
				},
				cfh_cf: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button(`,
										['i', { class: 'fa fa-question-circle' }],
										` ) to the panel that links to SteamGifts' `,
										[
											'a',
											{ href: `https://www.steamgifts.com/about/comment-formatting` },
											'comment formatting page',
										],
										'.',
									],
								],
							],
						],
					],
					name: 'Comment Formatting',
					sg: true,
					st: true,
				},
				cfh_ghwsgi: {
					description: [
						[
							'ul',
							[
								[
									'li',
									[
										`Adds a button (`,
										['i', { class: 'fa fa-github' }],
										` ) to the panel that allows you to easily generate links for `,
										[
											'a',
											{
												href: `https://www.steamgifts.com/discussion/fVwFM/github-wiki-steamgifts-integration`,
											},
											'GitHub Wiki SteamGifts Integration',
										],
										'.',
									],
								],
							],
						],
					],
					name: 'GitHub Wiki SteamGifts Integration',
					sg: true,
					st: true,
				},
			},
			id: 'cfh',
			name: 'Comment Formatting Helper',
			sg: true,
			st: true,
			type: 'comments',
		};
	}

	async init() {
		this.savedRepliesId = `savedReplies${Settings.get('cfh_sr_s') ? '_st' : ''}`;
		this.esgst.endlessFeatures.push(this.cfh_setTextAreas.bind(this));
		this.esgst.cfh = {
			backup: [],
			history: [],
			panel: document.createElement('div'),
			preview: document.createElement('div'),
		};
		this.esgst.cfh.panel.className = 'esgst-cfh-panel';
		let items = [
			{
				id: 'cfh_i',
				icons: ['fa-italic'],
				name: 'Italic',
				prefix: '*',
				suffix: '*',
			},
			{
				id: 'cfh_b',
				icons: ['fa-bold'],
				name: 'Bold',
				prefix: '**',
				suffix: '**',
			},
			{
				id: 'cfh_s',
				icons: ['fa-eye-slash'],
				name: 'Spoiler',
				prefix: '~',
				suffix: '~',
			},
			{
				id: 'cfh_st',
				icons: ['fa-strikethrough'],
				name: 'Strikethrough',
				prefix: '~~',
				suffix: '~~',
			},
			{
				id: 'cfh_h1',
				icons: ['fa-header'],
				name: 'Heading 1',
				prefix: '# ',
				text: '1',
			},
			{
				id: 'cfh_h2',
				icons: ['fa-header'],
				name: 'Heading 2',
				prefix: '## ',
				text: '2',
			},
			{
				id: 'cfh_h3',
				icons: ['fa-header'],
				name: 'Heading 3',
				prefix: '### ',
				text: '3',
			},
			{
				id: 'cfh_bq',
				icons: ['fa-quote-left'],
				name: 'Blockquote',
				prefix: '> ',
			},
			{
				id: 'cfh_lb',
				icons: ['fa-minus'],
				name: 'Line Break',
				prefix: '---',
			},
			{
				id: 'cfh_ol',
				icons: ['fa-list-ol'],
				multiline: true,
				name: 'Ordered List',
				prefix: `[n]. `,
			},
			{
				id: 'cfh_ul',
				icons: ['fa-list-ul'],
				multiline: true,
				name: 'Unordered List',
				prefix: '* ',
			},
			{
				id: 'cfh_ic',
				icons: ['fa-code'],
				name: 'Inline Code',
				prefix: '`',
				suffix: '`',
			},
			{
				id: 'cfh_lc',
				icons: ['fa-code', 'fa-indent'],
				name: 'Line Code',
				prefix: '    ',
			},
			{
				id: 'cfh_pc',
				icons: ['fa-code', 'fa-paragraph'],
				name: 'Paragraph Code',
				prefix: '```\n',
				suffix: '\n```',
			},
			{
				id: 'cfh_l',
				icons: ['fa-globe'],
				name: 'Link',
				setPopout: (popout) => {
					let title, url;
					DOM.insert(
						popout.popout,
						'atinner',
						<fragment>
							<div>
								URL:
								<input
									placeholder="http://www.example.com"
									type="text"
									ref={(ref) => (url = ref)}
								/>
							</div>
							<div>
								Title:
								<input placeholder="Cat" type="text" ref={(ref) => (title = ref)} />
							</div>
							<div
								className="form__saving-button btn_action white"
								onclick={async () => {
									await this.cfh_formatLink(title.value, url.value);
									url.value = '';
									title.value = '';
									popout.close();
								}}
							>
								Add
							</div>
						</fragment>
					);
				},
				callback: (popout) => {
					let title, url;
					url = popout.firstElementChild.firstElementChild;
					title = popout.firstElementChild.nextElementSibling.firstElementChild;
					title.value = this.esgst.cfh.textArea.value.slice(
						this.esgst.cfh.textArea.selectionStart,
						this.esgst.cfh.textArea.selectionEnd
					);
					if (url.value && title.value) {
						popout.lastElementChild.click();
					} else if (url.value) {
						title.focus();
					} else {
						url.focus();
					}
				},
			},
			{
				id: 'cfh_img',
				icons: ['fa-image'],
				name: 'Image',
				setPopout: (popout) => {
					let title, url;
					DOM.insert(
						popout.popout,
						'atinner',
						<fragment>
							<div>
								URL:
								<input
									placeholder="http://www.example.com/image.jpg"
									type="text"
									ref={(ref) => (url = ref)}
								/>
								<i
									className="fa fa-upload esgst-clickable"
									title="Upload image to Imgur and use it"
									onclick={async () => {
										if (!(await permissions.contains([['imgur']]))) {
											return;
										}

										Shared.common.multiChoice(
											'grey',
											'fa-user-secret',
											'Anonymously',
											'grey',
											'fa-user',
											'Through Account',
											'How would you like to upload?',
											this.cfh_uploadImage.bind(this, 'Client-ID e25283ef48ab9aa', popout, url),
											async () => {
												await Shared.common.delValue('imgurToken');
												Shared.common.openSmallWindow(
													`https://api.imgur.com/oauth2/authorize?client_id=e25283ef48ab9aa&response_type=token&state=imgur`
												);
												// noinspection JSIgnoredPromiseFromCall
												this.cfh_checkImgur(popout, url);
											}
										);
									}}
								></i>
							</div>
							<div>
								Title:
								<input placeholder="Cat" type="text" ref={(ref) => (title = ref)} />
							</div>
							<div
								className="form__saving-button btn_action white"
								onclick={async () => {
									await this.cfh_formatLink(title.value, url.value, true);
									url.value = '';
									title.value = '';
									popout.close();
								}}
							>
								Add
							</div>
						</fragment>
					);
				},
				callback: (popout) => {
					let title, url;
					url = popout.firstElementChild.firstElementChild;
					title = popout.firstElementChild.nextElementSibling.firstElementChild;
					title.value = this.esgst.cfh.textArea.value.slice(
						this.esgst.cfh.textArea.selectionStart,
						this.esgst.cfh.textArea.selectionEnd
					);
					if (url.value && title.value) {
						popout.lastElementChild.click();
					} else if (url.value) {
						title.focus();
					} else {
						url.focus();
					}
				},
			},
			{
				id: 'cfh_t',
				icons: ['fa-table'],
				name: 'Table',
				setPopup: (popup) => {
					let table;
					DOM.insert(
						popup.scrollable,
						'atinner',
						<fragment>
							<table ref={(ref) => (table = ref)}></table>
							<div
								className="form__saving-button btn_action white"
								onclick={() => this.cfh_insertTableRows(1, table)}
							>
								Insert Row
							</div>
							<div
								className="form__saving-button btn_action white"
								onclick={() => this.cfh_insertTableColumns(1, table)}
							>
								Insert Column
							</div>
							<div
								className="form__saving-button btn_action white"
								onclick={() => {
									let end, i, j, numColumns, numRows, rows, start, value;
									rows = table.rows;
									for (i = 1, numRows = rows.length; i < numRows; ++i) {
										for (j = 1, numColumns = rows[0].cells.length; j < numColumns; ++j) {
											if (!rows[i].cells[j].firstElementChild.value) {
												i = numRows + 1;
												j = numColumns + 1;
											}
										}
									}
									if (
										i <= numRows ||
										(i > numRows &&
											window.confirm(
												'Some cells are empty. This might lead to unexpected results. Are you sure you want to continue?'
											))
									) {
										value = '';
										for (i = 1; i < numRows; ++i) {
											value += '\n';
											for (j = 1; j < numColumns; ++j) {
												value += `${rows[i].cells[j].firstElementChild.value}${
													j < numColumns - 1 ? ' | ' : ''
												}`;
											}
										}
										value = value.replace(/^\n/, '');
										start = this.esgst.cfh.textArea.selectionStart;
										end = this.esgst.cfh.textArea.selectionEnd;
										this.esgst.cfh.textArea.value = `${this.esgst.cfh.textArea.value.slice(
											0,
											start
										)}${value}${this.esgst.cfh.textArea.value.slice(end)}`;
										this.esgst.cfh.textArea.setSelectionRange(
											end + value.length,
											end + value.length
										);
										this.esgst.cfh.textArea.focus();
										popup.close();
									}
								}}
							>
								Add
							</div>
						</fragment>
					);
					this.cfh_insertTableRows(4, table);
					this.cfh_insertTableColumns(2, table);
				},
			},
			{
				id: 'cfh_e',
				icons: ['fa-smile-o'],
				name: 'Emojis',
				setPopout: async (popout) => {
					let emojis, popup;
					DOM.insert(
						popout.popout,
						'atinner',
						<fragment>
							<div className="esgst-cfh-emojis" ref={(ref) => (emojis = ref)}>
								{await this.cfh_getEmojis()}
							</div>
							<div
								className="form__saving-button btn_action white"
								onclick={async () => {
									try {
										let emoji = window.prompt(`Enter the custom emoji:`).trim();
										const codes = [];
										for (let i = 0, n = emoji.length; i < n; i++) {
											codes.push(emoji.codePointAt(i));
										}
										emoji = String.fromCodePoint(...codes);
										this.cfh_setEmoji(
											DOM.insert(
												emojis,
												'beforeend',
												<span data-draggable-id={emoji}>{emoji}</span>
											)
										);
										Shared.common.draggable_set({
											addTrash: true,
											context: emojis,
											id: 'emojis',
											item: {},
										});
										const emojiArray = [];
										for (const element of emojis.children) {
											emojiArray.push(element.getAttribute('data-draggable-id'));
										}
										await Shared.common.setValue('emojis', JSON.stringify(emojiArray));
									} catch (error) {
										window.alert('Invalid emoji!');
										Logger.warning(error.message, error.stack);
									}
								}}
							>
								Add Custom Emoji
							</div>
							<div
								className="form__saving-button btn_action white"
								onclick={async () => {
									if (popup) {
										popup.open(() => {
											popout.popout.classList.add('esgst-hidden');
										});
									} else {
										let emoji, emojis, filter, i;
										popup = new Popup({
											icon: 'fa-smile-o',
											title: `Select emojis:`,
											addScrollable: true,
										});
										popup.getScrollable(
											<fragment>
												<input
													placeholder="Filter emojis..."
													type="text"
													ref={(ref) => (filter = ref)}
												/>
												<div className="esgst-cfh-emojis"></div>
												<div className="esgst-description">
													Simply click on an emoji above to add it to your selection. You can
													re-order emojis in your selection by dragging and dropping them. To remove
													an emoji from your selection, start dragging it and a trash area will
													appear, then drop it there.
												</div>
												<div className="global__image-outer-wrap page_heading_btn esgst-cfh-emojis"></div>
											</fragment>
										);
										emojis = filter.nextElementSibling;
										const savedEmojis = emojis.nextElementSibling.nextElementSibling;
										DOM.insert(
											savedEmojis,
											'atinner',
											<fragment>{await this.cfh_getEmojis()}</fragment>
										);
										const obj = {
											addTrash: true,
											context: savedEmojis,
											id: 'emojis',
											item: {},
										};
										Shared.common.draggable_set(obj);
										for (const emojiData of EMOJIS) {
											DOM.insert(
												emojis,
												'beforeend',
												<span
													data-draggable-id={emojiData.emoji}
													title={emojiData.name}
													onclick={() => {
														DOM.insert(
															savedEmojis,
															'beforeend',
															<span data-draggable-id={emojiData.emoji} title={emojiData.name}>
																{emojiData.emoji}
															</span>
														);
														Shared.common.draggable_set(obj);
													}}
												>
													{emojiData.emoji}
												</span>
											);
										}
										popup.onClose = () => {
											const emojiArray = [];
											for (const element of savedEmojis.children) {
												emojiArray.push(element.getAttribute('data-draggable-id'));
											}
											Shared.common.setValue('emojis', JSON.stringify(emojiArray));
										};
										filter.addEventListener('input', () => {
											if (filter.value) {
												for (i = emojis.children.length - 1; i > -1; --i) {
													emoji = emojis.children[i];
													if (emoji.getAttribute('title').toLowerCase().match(filter.value)) {
														emoji.classList.remove('esgst-hidden');
													} else {
														emoji.classList.add('esgst-hidden');
													}
												}
											} else {
												for (i = emojis.children.length - 1; i > -1; --i) {
													emojis.children[i].classList.remove('esgst-hidden');
												}
											}
										});
										popup.open(() => {
											popout.popout.classList.add('esgst-hidden');
										});
									}
								}}
							>
								Select Emojis
							</div>
						</fragment>
					);
					Shared.common.draggable_set({
						addTrash: true,
						context: emojis,
						id: 'emojis',
						item: {},
					});
					this.cfh_setEmojis(emojis);
				},
				callback: async (popout) => {
					let emojis = popout.firstElementChild;
					DOM.insert(emojis, 'atinner', <fragment>{await this.cfh_getEmojis()}</fragment>);
					Shared.common.draggable_set({
						addTrash: true,
						context: emojis,
						id: 'emojis',
						item: {},
					});
					this.cfh_setEmojis(emojis);
				},
			},
			{
				id: 'cfh_g',
				icons: ['fa-star'],
				name: 'Giveaway Encrypter',
				setPopout: (popout) => {
					let code;
					DOM.insert(
						popout.popout,
						'atinner',
						<fragment>
							Giveaway Code:
							<input placeholder="XXXXX" type="text" ref={(ref) => (code = ref)} />
							<div
								className="form__saving-button btn_action white"
								onclick={async () => {
									if (code.value.match(/^[\d\w]{5}$/)) {
										let encodedCode = this.esgst.modules.giveawaysGiveawayEncrypterDecrypter.ged_encryptCode(
											code.value
										);
										await this.cfh_formatLink('', `ESGST-${encodedCode}`);
										code.value = '';
										popout.close();
									} else {
										window.alert('Wrong format. The right format is XXXXX.');
									}
								}}
							>
								Add
							</div>
						</fragment>
					);
				},
				callback: (popout) => {
					let code = popout.firstElementChild;
					code.value = this.esgst.cfh.textArea.value.slice(
						this.esgst.cfh.textArea.selectionStart,
						this.esgst.cfh.textArea.selectionEnd
					);
					code.focus();
				},
			},
			{
				id: 'cfh_sr',
				icons: ['fa-floppy-o'],
				name: 'Saved Replies',
				setPopout: async (popout) => {
					let i, n, replies, savedReplies;
					this.esgst.cfh.deletedReplies = [];
					savedReplies = JSON.parse(Shared.common.getValue(this.savedRepliesId, '[]'));
					DOM.insert(
						popout.popout,
						'atinner',
						<fragment>
							<div>
								<input
									placeholder="Filter replies..."
									type="text"
									oninput={this.cfh_filterReplies.bind(this, replies)}
								/>
							</div>
							<div className="esgst-cfh-sr-container" ref={(ref) => (replies = ref)}></div>
							<div
								className="form__saving-button btn_action white"
								onclick={this.cfh_openReplyPopup.bind(this, null, null, replies, null)}
							>
								Add New Reply
							</div>
							<div
								className="form__saving-button btn_action white"
								onclick={() =>
									this.cfh_saveReply(
										this.esgst.cfh.textArea.value,
										null,
										'Untitled',
										null,
										null,
										replies,
										null
									)
								}
							>
								Save Reply
							</div>
							<div
								className="esgst-clickable esgst-hidden"
								ref={(ref) => (this.esgst.cfh.undoDelete = ref)}
								onclick={this.cfh_undoDelete.bind(this)}
							>
								<i className="fa fa-rotate-left"></i>
								<span>Undo Delete</span>
							</div>
						</fragment>
					);
					for (i = 0, n = savedReplies.length; i < n; ++i) {
						this.cfh_setReply(replies, savedReplies[i]);
					}
				},
				callback: (popout) => {
					popout.firstElementChild.firstElementChild.focus();
				},
			},
			{
				id: 'cfh_ghwsgi',
				icons: ['fa-github'],
				name: 'GitHub Wiki SteamGifts Integration',
				setPopout: (popout) => {
					let url;
					DOM.insert(
						popout.popout,
						'atinner',
						<fragment>
							<div>
								Wiki URL:
								<input
									placeholder="https://github.com/username/repository/wiki"
									type="text"
									ref={(ref) => (url = ref)}
								/>
							</div>
							<div
								className="form__saving-button btn_action white"
								onclick={async () => {
									const ghwsgiLink = `wiki-gh/${url.value.replace(
										/https?:\/\/(www\.)?github\.com\//,
										''
									)}`;
									await this.cfh_formatItem(
										`This thread contains a Wiki visible with the [GHWSGI userscript](https://www.steamgifts.com/discussion/fVwFM/). If you prefer to see it directly on GitHub instead, [click here](${url.value}).\n`
									);
									await this.cfh_formatLink('', ghwsgiLink);
									url.value = '';
									popout.close();
								}}
							>
								Add
							</div>
						</fragment>
					);
				},
				callback: (popout) => {
					let url = popout.firstElementChild.firstElementChild;
					url.focus();
				},
			},
			{
				addSpan: true,
				icons: ['fa-paste'],
				name: `Automatic Links / Images Paste Formatting: OFF`,
				callback: (context) => {
					this.esgst.cfh.alipf = context;
					this.cfh_setAlipf(Settings.get('cfh_pasteFormatting'), true);
				},
				onClick: () => this.cfh_setAlipf(),
			},
			{
				icons: ['fa-rotate-left'],
				name: 'Undo Formatting',
				callback: (context) => {
					this.esgst.cfh.undo = context.firstElementChild;
					this.esgst.cfh.undo.classList.add('esgst-faded');
				},
				onClick: () => {
					let end, value;
					if (this.esgst.cfh.history.length) {
						this.cfh_redo(this.esgst.cfh.textArea, this.esgst.cfh.textArea.value);
						value = this.esgst.cfh.history.pop();
						end =
							this.esgst.cfh.textArea.selectionEnd -
							(this.esgst.cfh.textArea.value.length - value.length);
						this.esgst.cfh.textArea.value = value;
						this.esgst.cfh.textArea.setSelectionRange(end, end);
						if (!this.esgst.cfh.history.length) {
							this.esgst.cfh.undo.classList.add('esgst-faded');
						}
						this.esgst.cfh.textArea.focus();
					}
				},
			},
			{
				icons: ['fa-rotate-right'],
				name: 'Redo Formatting',
				callback: (context) => {
					this.esgst.cfh.redo = context.firstElementChild;
					this.esgst.cfh.redo.classList.add('esgst-faded');
				},
				onClick: () => {
					let end, value;
					if (this.esgst.cfh.backup.length) {
						this.cfh_undo(this.esgst.cfh.textArea, this.esgst.cfh.textArea.value);
						value = this.esgst.cfh.backup.pop();
						end =
							this.esgst.cfh.textArea.selectionEnd +
							(value.length - this.esgst.cfh.textArea.value.length);
						this.esgst.cfh.textArea.value = value;
						this.esgst.cfh.textArea.setSelectionRange(end, end);
						if (!this.esgst.cfh.backup.length) {
							this.esgst.cfh.redo.classList.add('esgst-faded');
						}
						this.esgst.cfh.textArea.focus();
					}
				},
			},
		];
		for (let i = 0, n = items.length; i < n; i++) {
			let item = items[i];
			if (!item.id || Settings.get(item.id)) {
				let button;
				DOM.insert(
					this.esgst.cfh.panel,
					'beforeend',
					<div
						title={`${Shared.common.getFeatureTooltip(item.id || 'cfh', item.name)}`}
						ref={(ref) => (button = ref)}
					></div>
				);
				item.icons.forEach((icon) => {
					DOM.insert(button, 'beforeend', <i className={`fa ${icon}`}></i>);
				});
				if (item.addSpan) {
					DOM.insert(button, 'beforeend', <span></span>);
				}
				if (item.text) {
					button.insertAdjacentText('beforeend', item.text);
				}
				if (item.setPopout) {
					await item.setPopout(
						new Popout('esgst-cfh-popout', button, 0, true, null, item.callback)
					);
				} else if (item.setPopup) {
					let popup;
					button.addEventListener('click', () => {
						if (popup) {
							popup.open();
						} else {
							popup = new Popup({ addScrollable: true, icon: 'fa-table', title: `Add a table:` });
							item.setPopup(popup);
							popup.open();
						}
					});
				} else {
					if (item.callback) {
						item.callback(button);
					}
					button.addEventListener('click', async () => {
						if (item.onClick) {
							item.onClick();
						} else {
							await this.cfh_formatItem(item.prefix, item.suffix, item.multiline);
						}
					});
				}
			}
		}
		if (Settings.get('cfh_cf')) {
			DOM.insert(
				this.esgst.cfh.panel,
				'beforeend',
				<a
					href="/about/comment-formatting"
					title={Shared.common.getFeatureTooltip('cfh_cf', 'Comment Formatting')}
				>
					<i className="fa fa-question-circle"></i>
				</a>
			);
		}
		if (Settings.get('cfh_p') && !Settings.get('cfh_p_a')) {
			DOM.insert(
				this.esgst.cfh.panel,
				'beforeend',
				<div
					title={Shared.common.getFeatureTooltip('cfh_p', 'Preview')}
					onclick={async () => {
						DOM.insert(
							this.esgst.cfh.preview,
							'atinner',
							<fragment>
								{
									await Shared.common.parseMarkdown(
										this.esgst.cfh.textArea,
										this.esgst.cfh.textArea.value
									)
								}
							</fragment>
						);
						this.cfh_formatImages(this.esgst.cfh.preview);
					}}
				>
					<i className="fa fa-eye"></i>
				</div>
			);
		}
		this.esgst.cfh.preview.className = 'esgst-cfh-preview markdown';
	}

	async cfh_getEmojis() {
		let emojis = JSON.parse(Shared.common.getValue('emojis', '[]'));
		return emojis
			.map((emoji) => {
				const emojiData = EMOJIS.filter((x) => x.emoji === emoji || x.entity === emoji)[0];
				emoji = emojiData ? emojiData.emoji : emoji;
				return (
					<span data-draggable-id={emoji} title={emojiData ? emojiData.name : ''}>
						{emoji}
					</span>
				);
			})
			.filter((emoji) => emoji !== null);
	}

	cfh_setTextAreas(context, main, source, endless) {
		const elements = context.querySelectorAll(
			`${
				endless
					? `.esgst-es-page-${endless} textarea[name*="description"], .esgst-es-page-${endless}textarea[name*="description"]`
					: `textarea[name*="description"]`
			}`
		);
		let hasAdded = false;
		for (const element of elements) {
			element.onfocus = this.cfh_addPanel.bind(this, element);
			if (!hasAdded && !element.closest(`.is-hidden, .is_hidden, .esgst-hidden`)) {
				this.cfh_addPanel(element);
				hasAdded = true;
			}
		}
		const descriptionEdit = context.querySelector('.page__description__edit');
		if (descriptionEdit) {
			descriptionEdit.addEventListener(
				'click',
				this.cfh_addPanel.bind(
					this,
					descriptionEdit.closest('.page__description').querySelector('textarea')
				)
			);
		}
	}

	cfh_addPanel(textArea) {
		if (textArea === this.esgst.cfh.textArea) return;

		const isNotMain = textArea.closest(`.esgst-popup, .esgst-popout`);
		if (isNotMain) {
			this.esgst.cfh.panel.style.top = '0px';
		} else {
			this.esgst.cfh.panel.style.top = `${this.esgst.commentsTop}px`;
		}

		textArea.parentElement.insertBefore(this.esgst.cfh.panel, textArea);
		textArea.onfocus = this.cfh_addPanel.bind(this, textArea);
		textArea.onpaste = async (event) => {
			if (Settings.get('cfh_pasteFormatting')) {
				let clipboard, value;
				clipboard = event.clipboardData.getData('text/plain');
				if (clipboard.match(/^https?:/)) {
					event.preventDefault();
					value = textArea.value;
					this.cfh_undo(
						textArea,
						`${value.slice(0, textArea.selectionStart)}${clipboard}${value.slice(
							textArea.selectionEnd
						)}`
					);
					await this.cfh_formatLink(
						'',
						clipboard,
						clipboard.match(/\.(jpg|jpeg|gif|bmp|png)/i),
						true
					);
				}
			}
		};
		textArea.onclick = () => (Shared.esgst.cfh.recent = false);
		textArea.onkeydown = (event) => {
			if (event.key === 'Backspace' && this.esgst.cfh.recent) {
				event.preventDefault();
				this.esgst.cfh.undo.click();
			}
			this.esgst.cfh.recent = false;
			if (!event.ctrlKey) {
				return;
			}
			if (event.key === 'y' && (this.esgst.cfh.backup.length || this.esgst.cfh.history.length)) {
				event.preventDefault();
				this.esgst.cfh.redo.click();
			} else if (event.key === 'z' && this.esgst.cfh.history.length) {
				event.preventDefault();
				this.esgst.cfh.undo.click();
			}
		};
		if (Settings.get('cfh_p')) {
			this.esgst.cfh.preview.innerHTML = '';
			textArea.parentElement.insertBefore(this.esgst.cfh.preview, textArea.nextElementSibling);
			if (Settings.get('cfh_p_a')) {
				textArea.oninput = async () => {
					DOM.insert(
						this.esgst.cfh.preview,
						'atinner',
						<fragment>{await Shared.common.parseMarkdown(textArea, textArea.value)}</fragment>
					);
					this.cfh_formatImages(this.esgst.cfh.preview);
				};
			}
		}
		this.esgst.cfh.textArea = textArea;
	}

	cfh_undo(textArea, value) {
		this.esgst.cfh.history.push(value);
		this.esgst.cfh.undo.classList.remove('esgst-faded');
	}

	cfh_redo(textArea, value) {
		this.esgst.cfh.backup.push(value);
		this.esgst.cfh.redo.classList.remove('esgst-faded');
	}

	async cfh_formatItem(prefix = '', suffix = '', multiline) {
		let end, n, range, start, text, value;
		value = this.esgst.cfh.textArea.value;
		this.cfh_undo(this.esgst.cfh.textArea, value);
		start = this.esgst.cfh.textArea.selectionStart;
		end = this.esgst.cfh.textArea.selectionEnd;
		text = value.slice(start, end);
		range = text.length;
		if (multiline) {
			n = 0;
			text = text.replace(/^|\n/g, (match) => {
				n += 1;
				return `${match}${prefix.replace(/\[n]/, n)}`;
			});
		} else {
			text = `${prefix}${text}${suffix}`;
		}
		range += range > 0 ? start + text.length - range : start + text.length - range - suffix.length;
		this.esgst.cfh.textArea.value = `${value.slice(0, start)}${text}${value.slice(end)}`;
		this.esgst.cfh.textArea.setSelectionRange(range, range);
		this.esgst.cfh.textArea.focus();
		if (Settings.get('cfh_p') && Settings.get('cfh_p_a')) {
			DOM.insert(
				this.esgst.cfh.preview,
				'atinner',
				<fragment>
					{
						await Shared.common.parseMarkdown(
							this.esgst.cfh.textArea,
							this.esgst.cfh.textArea.value
						)
					}
				</fragment>
			);
			this.cfh_formatImages(this.esgst.cfh.preview);
		}
	}

	async cfh_formatLink(title, url, isImage, isPaste) {
		let end, start, value;
		if (isPaste) {
			this.esgst.cfh.recent = true;
		} else {
			this.cfh_undo(this.esgst.cfh.textArea, this.esgst.cfh.textArea.value);
		}
		start = this.esgst.cfh.textArea.selectionStart;
		end = this.esgst.cfh.textArea.selectionEnd;
		url = url
			.replace(/\[/g, '%5B')
			.replace(/\]/g, '%5D')
			.replace(/\(/g, '%28')
			.replace(/\)/g, '%29');
		value = isImage ? `![${title}](${url})` : `[${title}](${url})`;
		this.esgst.cfh.textArea.value = `${this.esgst.cfh.textArea.value.slice(
			0,
			start
		)}${value}${this.esgst.cfh.textArea.value.slice(end)}`;
		if (title) {
			this.esgst.cfh.textArea.setSelectionRange(end + value.length, end + value.length);
		} else {
			this.esgst.cfh.textArea.setSelectionRange(
				end + value.indexOf(`[`) + 1,
				end + value.indexOf(`[`) + 1
			);
		}
		this.esgst.cfh.textArea.focus();
		if (Settings.get('cfh_p') && Settings.get('cfh_p_a')) {
			DOM.insert(
				this.esgst.cfh.preview,
				'atinner',
				<fragment>
					{
						await Shared.common.parseMarkdown(
							this.esgst.cfh.textArea,
							this.esgst.cfh.textArea.value
						)
					}
				</fragment>
			);
			this.cfh_formatImages(this.esgst.cfh.preview);
		}
	}

	async cfh_checkImgur(popout, url) {
		let value = Shared.common.getValue('imgurToken');
		if (value) {
			this.cfh_uploadImage(`Bearer ${value}`, popout, url);
		} else {
			window.setTimeout(() => this.cfh_checkImgur(popout, url), 250);
		}
	}

	cfh_uploadImage(authorization, popout, url) {
		let input, popup, warning;
		popup = new Popup({
			addScrollable: true,
			icon: 'fa-upload',
			isTemp: true,
			title: 'Upload Image',
		});
		DOM.insert(popup.description, 'beforeend', <input type="file" ref={(ref) => (input = ref)} />);
		DOM.insert(
			popup.description,
			'beforeend',
			<div className="esgst-description esgst-warning" ref={(ref) => (warning = ref)}></div>
		);
		popup.description.appendChild(
			new ButtonSet({
				color1: 'green',
				color2: 'grey',
				icon1: 'fa-upload',
				icon2: 'fa-circle-o-notch fa-spin',
				title1: 'Upload',
				title2: 'Uploading...',
				callback1: () => {
					return new Promise((resolve) => {
						let file = input.files[0];
						if (file) {
							if (file.type.match(/^image/)) {
								if (file.size / 1024 / 1024 <= 10) {
									let reader = new FileReader();
									reader.onload = this.cfh_readImgur.bind(
										this,
										authorization,
										popout,
										popup,
										reader,
										url,
										warning,
										resolve
									);
									reader.readAsDataURL(file);
								} else {
									Shared.common.createFadeMessage(warning, 'Image is larger than 10 MB!');
									resolve();
								}
							} else {
								Shared.common.createFadeMessage(warning, 'File is not an image!');
								resolve();
							}
						} else {
							Shared.common.createFadeMessage(warning, 'No file was loaded!');
							resolve();
						}
					});
				},
			}).set
		);
		if (Settings.get('cfh_img_remember')) {
			popup.description.appendChild(
				new ButtonSet({
					color1: 'grey',
					color2: 'grey',
					icon1: 'fa-rotate-left',
					icon2: 'fa-circle-o-notch fa-spin',
					title1: 'Reset',
					title2: 'Resetting...',
					callback1: async () => {
						await Shared.common.setSetting('cfh_img_remember', false);
						popup.close();
					},
				}).set
			);
		}
		popup.open();
	}

	async cfh_readImgur(authorization, popout, popup, reader, url, warning, callback) {
		let responseJson = JSON.parse(
			(
				await Shared.common.request({
					data: `image=${encodeURIComponent(reader.result.match(/base64,(.+)/)[1])}`,
					headers: { authorization },
					method: 'POST',
					url: `https://api.imgur.com/3/image`,
				})
			).responseText
		);
		if (responseJson.success) {
			callback();
			popup.close();
			url.value = responseJson.data.link;
			popout.open();
		} else {
			Shared.common.createFadeMessage(warning, 'Could not upload image!');
			callback();
		}
	}

	cfh_insertTableRows(rows, table) {
		let deleteRow, i, j, n, row;
		while (rows > 0) {
			n = table.rows.length;
			row = table.insertRow(n);
			for (i = 0, j = table.rows[0].cells.length - 1; i < j; ++i) {
				DOM.insert(row.insertCell(0), 'atinner', <input placeholder="Value" type="text" />);
			}
			deleteRow = row.insertCell(0);
			if (n > 2) {
				DOM.insert(
					deleteRow,
					'atinner',
					<a>
						<i
							className="fa fa-times-circle"
							title="Delete row"
							onclick={() => {
								if (table.rows.length > 4) {
									deleteRow.remove();
									row.remove();
								} else {
									window.alert('A table must have a least one row and two columns.');
								}
							}}
						></i>
					</a>
				);
			}
			--rows;
		}
	}

	cfh_insertTableColumns(columns, table) {
		let column, i, j, n, rows;
		while (columns > 0) {
			rows = table.rows;
			n = rows[0].cells.length;
			for (i = 3, j = rows.length; i < j; ++i) {
				DOM.insert(rows[i].insertCell(n), 'atinner', <input placeholder="Value" type="text" />);
			}
			DOM.insert(
				rows[2].insertCell(n),
				'atinner',
				<select>
					<option value=":-">Left</option>
					<option value=":-:">Center</option>
					<option value="-:">Right</option>
				</select>
			);
			column = rows[1].insertCell(n);
			DOM.insert(column, 'atinner', <input placeholder="Header" type="text" />);
			DOM.insert(
				rows[0].insertCell(n),
				'atinner',
				<a>
					<i
						className="fa fa-times-circle"
						title="Delete column"
						onclick={() => {
							rows = table.rows;
							n = rows[1].cells.length;
							if (n > 3) {
								do {
									--n;
								} while (rows[1].cells[n] !== column);
								for (i = 0, j = rows.length; i < j; ++i) {
									rows[i].deleteCell(n);
								}
							} else {
								window.alert('A table must have at least one row and two columns.');
							}
						}}
					></i>
				</a>
			);
			--columns;
		}
	}

	cfh_setEmojis(emojis) {
		let emoji, i;
		for (i = emojis.children.length - 1; i > -1; --i) {
			emoji = emojis.children[i];
			this.cfh_setEmoji(emoji);
		}
	}

	cfh_setEmoji(emoji) {
		emoji.addEventListener('click', this.cfh_formatItem.bind(this, emoji.textContent, ''));
	}

	cfh_setReply(replies, savedReply) {
		let description, name, reply, summary;
		DOM.insert(
			replies,
			'beforeend',
			<div
				className="esgst-cfh-sr-box"
				draggable={true}
				ondragstart={this.cfh_setSource.bind(this, description, name, reply)}
				ondragenter={this.cfh_getSource.bind(this, reply, replies)}
				ondragend={this.cfh_saveSource.bind(this)}
				ref={(ref) => (reply = ref)}
			>
				<div
					className="esgst-cfh-sr-summary"
					ref={(ref) => (summary = ref)}
					onclick={() => {
						this.cfh_undo(this.esgst.cfh.textArea, this.esgst.cfh.textArea.value);
						let end, i, matches, n, value;
						end = this.esgst.cfh.textArea.selectionEnd;
						value = savedReply.description;
						matches = value.match(/\[ESGST-R][\s\S]+?\[\/ESGST-R]/g);
						if (matches) {
							n = matches.length;
							i = Math.floor(Math.random() * n);
							value = matches[i].match(/\[ESGST-R]([\s\S]+?)\[\/ESGST-R]/)[1];
						}
						this.esgst.cfh.textArea.value = `${this.esgst.cfh.textArea.value.slice(
							0,
							this.esgst.cfh.textArea.selectionStart
						)}${value}${this.esgst.cfh.textArea.value.slice(end)}`;
						this.esgst.cfh.textArea.dispatchEvent(new Event('input'));
						this.esgst.cfh.textArea.setSelectionRange(end + value.length, end + value.length);
						this.esgst.cfh.textArea.focus();
					}}
				>
					<div className="esgst-cfh-sr-name" ref={(ref) => (name = ref)}>
						{savedReply.name}
					</div>
					<div className="esgst-cfh-sr-description" ref={(ref) => (description = ref)}>
						{savedReply.description}
					</div>
				</div>
				<div className="esgst-cfh-sr-controls">
					<i
						className="esgst-clickable fa fa-retweet"
						title="Replace description with current reply"
						onclick={this.cfh_saveReply(
							savedReply.description,
							this.esgst.cfh.textArea,
							savedReply.name,
							null,
							null,
							replies,
							summary
						)}
					></i>
					<i
						className="esgst-clickable fa fa-edit"
						title="Edit reply"
						onclick={this.cfh_openReplyPopup.bind(
							this,
							savedReply.description,
							savedReply.name,
							replies,
							summary
						)}
					></i>
					<i
						className="esgst-clickable fa fa-trash"
						title="Delete reply"
						onclick={async () => {
							let savedReplies = JSON.parse(Shared.common.getValue(this.savedRepliesId, '[]'));
							let i;
							for (
								i = savedReplies.length - 1;
								i > -1 &&
								(savedReplies[i].name !== name.textContent ||
									savedReplies[i].description !== description.textContent);
								i--
							) {}
							if (i > -1) {
								savedReplies.splice(i, 1);
								Shared.common.setValue(this.savedRepliesId, JSON.stringify(savedReplies));
								reply.classList.add('esgst-hidden');
								this.esgst.cfh.deletedReplies.push({
									reply: reply,
									savedReply: savedReply,
								});
								this.esgst.cfh.undoDelete.classList.remove('esgst-hidden');
							}
						}}
					></i>
					<i className="fa fa-question-circle" title="Drag the reply to move it"></i>
				</div>
			</div>
		);
	}

	async cfh_setSource(description, name, reply, event) {
		let i, savedReplies;
		event.dataTransfer.setData('text/plain', '');
		this.esgst.cfh.source = reply;
		savedReplies = JSON.parse(Shared.common.getValue(this.savedRepliesId, '[]'));
		for (
			i = savedReplies.length - 1;
			i > -1 &&
			(savedReplies[i].name !== name.textContent ||
				savedReplies[i].description !== description.textContent);
			--i
		) {}
		if (i > -1) {
			this.esgst.cfh.sourceIndex = i;
		}
	}

	cfh_getSource(reply, replies) {
		let current, i;
		current = this.esgst.cfh.source;
		i = 0;
		do {
			current = current.previousElementSibling;
			if (current && current === reply) {
				this.esgst.cfh.sourceNewIndex = i;
				replies.insertBefore(this.esgst.cfh.source, reply);
				return;
			}
			++i;
		} while (current);
		this.esgst.cfh.sourceNewIndex = i - 1;
		replies.insertBefore(this.esgst.cfh.source, reply.nextElementSibling);
	}

	async cfh_saveSource() {
		let savedReplies = JSON.parse(Shared.common.getValue(this.savedRepliesId, '[]'));
		savedReplies.splice(
			this.esgst.cfh.sourceNewIndex,
			0,
			savedReplies.splice(this.esgst.cfh.sourceIndex, 1)[0]
		);
		Shared.common.setValue(this.savedRepliesId, JSON.stringify(savedReplies));
	}

	cfh_openReplyPopup(description, name, replies, summary) {
		let descriptionArea, nameArea, panel, popup;
		popup = new Popup({
			addScrollable: true,
			icon: 'fa-floppy-o',
			isTemp: true,
			title: summary ? `Edit reply:` : `Save new reply:`,
		});
		DOM.insert(
			popup.scrollable,
			'beforeend',
			<div className="esgst-description">
				You can save a defined list of replies to be picked at random when using it. To do so,
				enclose each option with <span className="esgst-bold">[ESGST-R][/ESGST-R]</span>. For
				example, a defined list that renders a random "thank you" comment when using it would look
				like this:
				<br />
				<br />
				[ESGST-R]Thanks![/ESGST-R]
				<br />
				[ESGST-R]Thank you![/ESGST-R]
				<br />
				[ESGST-R]Thank you so much!
				<br />
				<br />
				Can't wait to play this game![/ESGST-R]
			</div>
		);
		DOM.insert(
			popup.scrollable,
			'beforeend',
			<div ref={(ref) => (panel = ref)}>
				<div>
					<div>Name</div>
					<input type="text" value={name || ''} />
				</div>
				<div>
					<div>Description</div>
					<textarea>{description || ''}</textarea>
				</div>
			</div>
		);
		nameArea = panel.firstElementChild;
		descriptionArea = nameArea.nextElementSibling;
		nameArea = nameArea.lastElementChild;
		descriptionArea = descriptionArea.lastElementChild;
		if (Settings.get('cfh')) {
			this.cfh_addPanel(descriptionArea);
		}
		popup.description.appendChild(
			new ButtonSet({
				color1: 'green',
				color2: 'grey',
				icon1: 'fa-check',
				icon2: 'fa-circle-o-notch fa-spin',
				title1: 'Save',
				title2: 'Saving...',
				callback1: this.cfh_saveReply.bind(
					this,
					description,
					descriptionArea,
					name,
					nameArea,
					popup,
					replies,
					summary
				),
			}).set
		);
		popup.open();
	}

	async cfh_saveReply(description, descriptionArea, name, nameArea, popup, replies, summary) {
		let [descVal, nameVal] = [
			descriptionArea ? descriptionArea.value.trim() : description,
			nameArea ? nameArea.value.trim() : name,
		];
		if (descVal && nameVal) {
			let savedReplies = JSON.parse(Shared.common.getValue(this.savedRepliesId, '[]'));
			let savedReply = {
				description: descVal,
				name: nameVal,
			};
			if (summary) {
				let i;
				for (
					i = savedReplies.length - 1;
					i > -1 && (savedReplies[i].name !== name || savedReplies[i].description !== description);
					i--
				) {}
				if (i > -1) {
					savedReplies[i] = savedReply;
					summary.firstElementChild.textContent = nameVal;
					summary.lastElementChild.textContent = descVal;
				}
			} else {
				savedReplies.push(savedReply);
				this.cfh_setReply(replies, savedReply);
			}
			await Shared.common.setValue(this.savedRepliesId, JSON.stringify(savedReplies));
			if (popup) {
				popup.close();
			}
		} else if (popup) {
			Shared.common.createAlert('Both fields are required.');
		}
	}

	cfh_filterReplies(replies, event) {
		let i, reply, value;
		value = event.currentTarget.value;
		for (i = replies.children.length - 1; i > -1; --i) {
			reply = replies.children[i];
			if (reply.textContent.toLowerCase().match(value.toLowerCase())) {
				reply.classList.remove('esgst-hidden');
			} else {
				reply.classList.add('esgst-hidden');
			}
		}
	}

	async cfh_undoDelete() {
		let deleted, saved;
		deleted = this.esgst.cfh.deletedReplies.pop();
		deleted.reply.classList.remove('esgst-hidden');
		deleted.reply.parentElement.appendChild(deleted.reply);
		saved = JSON.parse(Shared.common.getValue(this.savedRepliesId, '[]'));
		saved.push(deleted.savedReply);
		Shared.common.setValue(this.savedRepliesId, JSON.stringify(saved));
		if (this.esgst.cfh.deletedReplies.length === 0) {
			this.esgst.cfh.undoDelete.classList.add('esgst-hidden');
		}
	}

	cfh_setAlipf(value, firstTime) {
		if (typeof value === 'undefined') {
			value = !Settings.get('cfh_pasteFormatting');
		}
		if (!firstTime) {
			Shared.common.setSetting('cfh_pasteFormatting', value);
		}
		if (value) {
			this.esgst.cfh.alipf.title = Shared.common.getFeatureTooltip(
				'cfh',
				`Automatic Links / Images Paste Formatting: ON`
			);
			this.esgst.cfh.alipf.classList.remove('esgst-faded');
			this.esgst.cfh.alipf.lastElementChild.textContent = 'ON';
		} else {
			this.esgst.cfh.alipf.title = Shared.common.getFeatureTooltip(
				'cfh',
				`Automatic Links / Images Paste Formatting: OFF`
			);
			this.esgst.cfh.alipf.classList.add('esgst-faded');
			this.esgst.cfh.alipf.lastElementChild.textContent = 'OFF';
		}
		if (this.esgst.cfh.textArea) {
			this.esgst.cfh.textArea.focus();
		}
	}

	cfh_formatImages(context) {
		let i, images, n;
		images = context.getElementsByTagName('img');
		for (i = 0, n = images.length; i < n; ++i) {
			const image = images[0];
			context.appendChild(image);
			image.classList.add('is-hidden', 'is_hidden');
			DOM.insert(
				image,
				'atouter',
				<div>
					<div className={`${this.esgst.sg ? 'comment__toggle-attached' : 'view_attached'}`}>
						View attached image.
					</div>
					<a
						href={image.getAttribute('src')}
						attrs={{ ref: 'nofollow noreferrer' }}
						target="_blank"
					>
						{image.cloneNode(true)}
					</a>
				</div>
			);
		}
	}
}

const commentsCommentFormattingHelper = new CommentsCommentFormattingHelper();

export { commentsCommentFormattingHelper };
