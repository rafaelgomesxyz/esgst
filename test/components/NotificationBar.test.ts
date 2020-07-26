import { expect } from 'chai';
import * as sinon from 'sinon';
import { EventDispatcher } from '../../src/class/EventDispatcher';
import { Session } from '../../src/class/Session';
import {
	NotificationBar,
	NotificationBarData,
	SgNotificationBar,
	StNotificationBar,
} from '../../src/components/NotificationBar';
import { Namespaces } from '../../src/constants/Namespaces';
import { loadFixture } from '../../test-helpers/fixture-loader';
import sgNotificationBarFixture from '../fixtures/sg/notification-bar.html';
import stNotificationBarFixture from '../fixtures/st/notification-bar.html';

let sgNotificationBar: SgNotificationBar;
let stNotificationBar: StNotificationBar;
let sgFixtureNode: Element;
let stFixtureNode: Element;
const sgFixtureData: NotificationBarData = {
	color: 'green',
	icons: ['fa-check-circle'],
	message: 'Success. Synced with Steam.',
};
const stFixtureData: NotificationBarData = {
	color: 'green',
	icons: ['fa-star'],
	message: 'Thanks for helping! It looks like you voted on 1 review.',
};

describe('NotificationBar', () => {
	describe('.create()', () => {
		describe('when on SG', () => {
			beforeEach(() => {
				Session.namespace = Namespaces.SG;
			});

			it('succeed with default options', () => {
				sgNotificationBar = NotificationBar.create() as SgNotificationBar;
				expect(sgNotificationBar).to.be.instanceOf(SgNotificationBar);
				expect(sgNotificationBar.data).to.deep.equal(NotificationBar.getInitialData());
				expect(sgNotificationBar.nodes).to.deep.equal(SgNotificationBar.getInitialNodes());
			});

			it('succeed with provided options', () => {
				const options: Partial<NotificationBarData> = {
					color: 'blue',
					icons: ['fa-question-circle'],
					message: 'Is this a test?',
				};
				sgNotificationBar = NotificationBar.create(options) as SgNotificationBar;
				expect(sgNotificationBar).to.be.instanceOf(SgNotificationBar);
				expect(sgNotificationBar.data).to.deep.equal(options);
				expect(sgNotificationBar.nodes).to.deep.equal(SgNotificationBar.getInitialNodes());
			});
		});

		describe('when on ST', () => {
			beforeEach(() => {
				Session.namespace = Namespaces.ST;
			});

			it('succeed with default options', () => {
				stNotificationBar = NotificationBar.create() as StNotificationBar;
				expect(stNotificationBar).to.be.instanceOf(StNotificationBar);
				expect(stNotificationBar.data).to.deep.equal(NotificationBar.getInitialData());
				expect(stNotificationBar.nodes).to.deep.equal(StNotificationBar.getInitialNodes());
			});

			it('succeed with provided options', () => {
				const options: Partial<NotificationBarData> = {
					color: 'blue',
					icons: ['fa-question-circle'],
					message: 'Is this a test?',
				};
				stNotificationBar = NotificationBar.create(options) as StNotificationBar;
				expect(stNotificationBar).to.be.instanceOf(StNotificationBar);
				expect(stNotificationBar.data).to.deep.equal(options);
				expect(stNotificationBar.nodes).to.deep.equal(StNotificationBar.getInitialNodes());
			});
		});

		describe('when somewhere else', () => {
			beforeEach(() => {
				Session.namespace = -1;
			});

			it('fail', () => {
				expect(() => NotificationBar.create()).to.throw();
			});
		});
	});

	describe('.getAll()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			sgFixtureNode = loadFixture(sgNotificationBarFixture);
			stFixtureNode = loadFixture(stNotificationBarFixture);
		});

		afterEach(() => {
			sgFixtureNode.remove();
			stFixtureNode.remove();
		});

		it('return correct items', () => {
			const notificationBars = NotificationBar.getAll(document.body);
			expect(notificationBars.length).to.equal(1);
			expect(notificationBars[0].nodes.outer).to.equal(sgFixtureNode.children[0]);
			expect(notificationBars[0].data).to.deep.equal(sgFixtureData);
		});
	});

	describe('#setColor()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			sgNotificationBar = NotificationBar.create() as SgNotificationBar;
		});

		describe('when built', () => {
			beforeEach(() => {
				sgNotificationBar.build();
			});

			describe('when called with different color', () => {
				it('succeed', () => {
					const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
					const color = 'green';
					sgNotificationBar.setColor(color);
					expect(sgNotificationBar.data.color).to.equal(color);
					expect(outerNode.className).to.equal(
						`notification notification--success notification--margin-top-small`
					);
				});
			});

			describe('when called with same color', () => {
				it('do nothing', () => {
					const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
					outerNode.className = '';
					sgNotificationBar.setColor(NotificationBar.defaultColor);
					expect(outerNode.className).to.be.empty;
				});
			});
		});

		describe('when not built', () => {
			it('fail', () => {
				const color = 'green';
				expect(() => sgNotificationBar.setColor(color)).to.throw();
			});
		});
	});

	describe('#parse()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			sgNotificationBar = NotificationBar.create() as SgNotificationBar;
			sgFixtureNode = loadFixture(sgNotificationBarFixture);
			stFixtureNode = loadFixture(stNotificationBarFixture);
		});

		afterEach(() => {
			sgFixtureNode.remove();
			stFixtureNode.remove();
		});

		describe('when called with compatible node', () => {
			it('succeed', () => {
				const parseColorStub = sinon.stub(sgNotificationBar, 'parseColor');
				const parseIconsStub = sinon.stub(sgNotificationBar, 'parseIcons');
				const parseMessageStub = sinon.stub(sgNotificationBar, 'parseMessage');
				sgNotificationBar.parse(sgFixtureNode.children[0] as Element);
				expect(sgNotificationBar.nodes.outer).to.equal(sgFixtureNode.children[0]);
				expect(parseColorStub.callCount).to.equal(1);
				expect(parseIconsStub.callCount).to.equal(1);
				expect(parseMessageStub.callCount).to.equal(1);
				parseColorStub.restore();
				parseIconsStub.restore();
				parseMessageStub.restore();
			});
		});

		describe('when called with incompatible node', () => {
			it('fail', () => {
				expect(() => sgNotificationBar.parse(stFixtureNode.children[0])).to.throw();
			});
		});
	});

	describe('#parseColor()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			sgNotificationBar = NotificationBar.create() as SgNotificationBar;
			sgFixtureNode = loadFixture(sgNotificationBarFixture);
		});

		afterEach(() => {
			sgFixtureNode.remove();
		});

		describe('when outer node exists', () => {
			beforeEach(() => {
				sgNotificationBar.nodes.outer = sgFixtureNode.children[0] as HTMLDivElement;
			});

			it('succeed', () => {
				sgNotificationBar.parseColor();
				expect(sgNotificationBar.data.color).to.equal(sgFixtureData.color);
			});
		});

		describe('when outer node does not exist', () => {
			it('fail', () => {
				expect(() => sgNotificationBar.parseColor()).to.throw();
			});
		});
	});

	describe('#parseIcons()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			sgNotificationBar = NotificationBar.create() as SgNotificationBar;
			sgFixtureNode = loadFixture(sgNotificationBarFixture);
		});

		afterEach(() => {
			sgFixtureNode.remove();
		});

		describe('when outer node exists', () => {
			beforeEach(() => {
				sgNotificationBar.nodes.outer = sgFixtureNode.children[0] as HTMLDivElement;
			});

			it('succeed', () => {
				sgNotificationBar.parseIcons();
				expect(sgNotificationBar.data.icons).to.deep.equal(sgFixtureData.icons);
				expect(sgNotificationBar.nodes.icons.length).to.equal(1);
			});
		});

		describe('when outer node does not exist', () => {
			it('fail', () => {
				expect(() => sgNotificationBar.parseIcons()).to.throw();
			});
		});
	});
});

describe('SgNotificationBar', () => {
	describe('#build()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			sgNotificationBar = NotificationBar.create() as SgNotificationBar;
		});

		describe('when called for the first time', () => {
			it('succeed', () => {
				const setColorStub = sinon.stub(sgNotificationBar, 'setColor');
				const setContentStub = sinon.stub(sgNotificationBar, 'setContent');
				const dispatchStub = sinon.stub(EventDispatcher, 'dispatch');
				sgNotificationBar.build();
				expect(sgNotificationBar.nodes.outer).to.be.instanceOf(Node);
				expect(setColorStub.callCount).to.equal(1);
				expect(setContentStub.callCount).to.equal(1);
				expect(sgNotificationBar.hasBuilt).to.be.true;
				expect(dispatchStub.callCount).to.equal(1);
				setColorStub.restore();
				setContentStub.restore();
				dispatchStub.restore();
			});
		});

		describe('when called again', () => {
			it('rebuild using same outer node', () => {
				const setColorStub = sinon.stub(sgNotificationBar, 'setColor');
				const setContentStub = sinon.stub(sgNotificationBar, 'setContent');
				const dispatchStub = sinon.stub(EventDispatcher, 'dispatch');
				sgNotificationBar.build();
				const outerNode = sgNotificationBar.nodes.outer;
				sgNotificationBar.build();
				expect(sgNotificationBar.nodes.outer).to.equal(outerNode);
				expect(setColorStub.callCount).to.equal(2);
				expect(setContentStub.callCount).to.equal(2);
				expect(sgNotificationBar.hasBuilt).to.be.true;
				expect(dispatchStub.callCount).to.equal(2);
				setColorStub.restore();
				setContentStub.restore();
				dispatchStub.restore();
			});
		});
	});

	describe('#reset()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			sgNotificationBar = NotificationBar.create() as SgNotificationBar;
		});

		describe('when built', () => {
			beforeEach(() => {
				sgNotificationBar.build();
			});

			it('rebuild', () => {
				const outerNode = sgNotificationBar.nodes.outer;
				const buildStub = sinon.stub(sgNotificationBar, 'build');
				sgNotificationBar.reset();
				expect(sgNotificationBar.data).to.deep.equal(NotificationBar.getInitialData());
				expect(sgNotificationBar.nodes).to.deep.equal({
					...SgNotificationBar.getInitialNodes(),
					outer: outerNode,
				});
				expect(sgNotificationBar.hasBuilt).to.be.false;
				expect(buildStub.callCount).to.equal(1);
				buildStub.restore();
			});
		});

		describe('when not built', () => {
			it('do not rebuild', () => {
				const buildStub = sinon.stub(sgNotificationBar, 'build');
				sgNotificationBar.reset();
				expect(sgNotificationBar.data).to.deep.equal(NotificationBar.getInitialData());
				expect(sgNotificationBar.nodes).to.deep.equal(SgNotificationBar.getInitialNodes());
				expect(sgNotificationBar.hasBuilt).to.be.false;
				expect(buildStub.callCount).to.equal(0);
				buildStub.restore();
			});
		});
	});

	describe('#setContent()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			sgNotificationBar = NotificationBar.create() as SgNotificationBar;
		});

		describe('when built', () => {
			beforeEach(() => {
				sgNotificationBar.build();
			});

			describe('when called with different content', () => {
				it('clear current content', () => {
					const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
					const icons = ['fa-check-circle'];
					const message = 'Done!';
					const setIconsStub = sinon.stub(sgNotificationBar, 'setIcons');
					const setMessageStub = sinon.stub(sgNotificationBar, 'setMessage');
					sgNotificationBar.setContent(icons, message);
					expect(outerNode.innerHTML).to.be.empty;
					expect(sgNotificationBar.data.icons.length).to.equal(0);
					expect(sgNotificationBar.data.message).to.be.null;
					expect(sgNotificationBar.nodes.icons.length).to.equal(0);
					expect((sgNotificationBar.nodes.message as ChildNode[]).length).to.equal(0);
					expect(setIconsStub.callCount).to.equal(1);
					expect(setMessageStub.callCount).to.equal(1);
					setIconsStub.restore();
					setMessageStub.restore();
				});
			});

			describe('when called with same content', () => {
				const icons = ['fa-check-circle'];
				const message = 'Done!';

				beforeEach(() => {
					sgNotificationBar.setContent(icons, message);
				});

				it('do nothing', () => {
					const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
					const setIconsStub = sinon.stub(sgNotificationBar, 'setIcons');
					const setMessageStub = sinon.stub(sgNotificationBar, 'setMessage');
					sgNotificationBar.setContent(icons, message);
					expect(outerNode.innerHTML).not.to.be.empty;
					expect(sgNotificationBar.data.icons).to.deep.equal(icons);
					expect(sgNotificationBar.data.message).to.equal(message);
					expect(sgNotificationBar.nodes.icons.length).to.equal(1);
					expect((sgNotificationBar.nodes.message as ChildNode[]).length).to.equal(1);
					expect(setIconsStub.callCount).to.equal(1);
					expect(setMessageStub.callCount).to.equal(1);
					setIconsStub.restore();
					setMessageStub.restore();
				});
			});
		});

		describe('when not built', () => {
			it('fail', () => {
				const icons = ['fa-check-circle'];
				const message = 'Done!';
				expect(() => sgNotificationBar.setContent(icons, message)).to.throw();
			});
		});
	});

	describe('#setIcons()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			sgNotificationBar = NotificationBar.create() as SgNotificationBar;
		});

		describe('when built', () => {
			beforeEach(() => {
				sgNotificationBar.build();
			});

			describe('when called with different icons', () => {
				it('succeed', () => {
					const removeIconsStub = sinon.stub(sgNotificationBar, 'removeIcons');
					const icons = ['fa-check-circle'];
					sgNotificationBar.setIcons(icons);
					expect(removeIconsStub.callCount).to.equal(1);
					expect(sgNotificationBar.data.icons).to.deep.equal(icons);
					expect(sgNotificationBar.nodes.icons.length).to.equal(1);
					removeIconsStub.restore();
				});
			});

			describe('when called with same icons', () => {
				it('do nothing', () => {
					const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
					outerNode.innerHTML = '';
					const removeIconsStub = sinon.stub(sgNotificationBar, 'removeIcons');
					const { icons } = NotificationBar.getInitialData();
					sgNotificationBar.setIcons(icons);
					expect(removeIconsStub.callCount).to.equal(0);
					expect(outerNode.innerHTML).to.be.empty;
					removeIconsStub.restore();
				});
			});
		});

		describe('when not built', () => {
			it('fail', () => {
				const icons = ['fa-check-circle'];
				expect(() => sgNotificationBar.setIcons(icons)).to.throw();
			});
		});
	});

	describe('#setMessage()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			sgNotificationBar = NotificationBar.create() as SgNotificationBar;
		});

		describe('when built', () => {
			beforeEach(() => {
				sgNotificationBar.build();
			});

			describe('when called with different message', () => {
				it('succeed', () => {
					const removeMessageStub = sinon.stub(sgNotificationBar, 'removeMessage');
					const message = 'Done!';
					sgNotificationBar.setMessage(message);
					expect(removeMessageStub.callCount).to.equal(1);
					expect(sgNotificationBar.data.message).to.equal(message);
					expect((sgNotificationBar.nodes.message as ChildNode[]).length).to.equal(1);
					removeMessageStub.restore();
				});
			});

			describe('when called with same message', () => {
				it('do nothing', () => {
					const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
					outerNode.innerHTML = '';
					const removeMessageStub = sinon.stub(sgNotificationBar, 'removeMessage');
					const { message } = NotificationBar.getInitialData();
					sgNotificationBar.setMessage(message);
					expect(removeMessageStub.callCount).to.equal(0);
					expect(outerNode.innerHTML).to.be.empty;
					removeMessageStub.restore();
				});
			});
		});

		describe('when not built', () => {
			it('fail', () => {
				const message = 'Done!';
				expect(() => sgNotificationBar.setMessage(message)).to.throw();
			});
		});
	});

	describe('#removeIcons()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
		});

		describe('when built', () => {
			beforeEach(() => {
				sgNotificationBar = NotificationBar.create().build() as SgNotificationBar;
			});

			describe('when there are icons with space separator', () => {
				beforeEach(() => {
					const icons = ['fa-check-circle'];
					sgNotificationBar.setIcons(icons);
				});

				describe('when there is a message', () => {
					const message = 'Done!';

					beforeEach(() => {
						sgNotificationBar.setMessage(message);
					});

					it('remove current icons', () => {
						const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
						sgNotificationBar.removeIcons();
						expect(outerNode.innerHTML).to.equal(message);
						expect(sgNotificationBar.data.icons.length).to.equal(0);
						expect(sgNotificationBar.nodes.icons.length).to.equal(0);
					});
				});

				describe('when there is no message', () => {
					it('clear current content', () => {
						const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
						sgNotificationBar.removeIcons();
						expect(outerNode.innerHTML).to.be.empty;
						expect(sgNotificationBar.data.icons.length).to.equal(0);
						expect(sgNotificationBar.nodes.icons.length).to.equal(0);
					});
				});
			});

			describe('when there are icons with no space separator', () => {
				beforeEach(() => {
					const icons = ['fa-check-circle'];
					sgNotificationBar.setIcons(icons);
					const separatorNode = sgNotificationBar.nodes.icons[0].nextSibling as ChildNode;
					separatorNode.remove();
				});

				describe('when there is a message', () => {
					const message = 'Done!';

					beforeEach(() => {
						sgNotificationBar.setMessage(message);
					});

					it('remove current icons', () => {
						const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
						sgNotificationBar.removeIcons();
						expect(outerNode.innerHTML).to.equal(message);
						expect(sgNotificationBar.data.icons.length).to.equal(0);
						expect(sgNotificationBar.nodes.icons.length).to.equal(0);
					});
				});

				describe('when there is no message', () => {
					it('clear current content', () => {
						const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
						sgNotificationBar.removeIcons();
						expect(outerNode.innerHTML).to.be.empty;
						expect(sgNotificationBar.data.icons.length).to.equal(0);
						expect(sgNotificationBar.nodes.icons.length).to.equal(0);
					});
				});
			});

			describe('when there are no icons', () => {
				it('do nothing', () => {
					const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
					outerNode.innerHTML = 'Test';
					sgNotificationBar.removeIcons();
					expect(outerNode.innerHTML).to.equal('Test');
				});
			});
		});

		describe('when not built', () => {
			beforeEach(() => {
				sgNotificationBar = NotificationBar.create({
					icons: ['fa-check-circle'],
				}) as SgNotificationBar;
			});

			it('fail', () => {
				expect(() => sgNotificationBar.removeIcons()).to.throw();
			});
		});
	});

	describe('#removeMessage()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
		});

		describe('when built', () => {
			beforeEach(() => {
				sgNotificationBar = NotificationBar.create().build() as SgNotificationBar;
			});

			describe('when there is a message', () => {
				beforeEach(() => {
					const message = 'Done!';
					sgNotificationBar.setMessage(message);
				});

				describe('when there are icons', () => {
					const icons = ['fa-check-circle'];

					beforeEach(() => {
						sgNotificationBar.setIcons(icons);
					});

					it('remove current message', () => {
						const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
						sgNotificationBar.removeMessage();
						expect(outerNode.innerHTML).to.equal('<i class="fa fa-check-circle"></i> ');
						expect(sgNotificationBar.data.message).to.be.null;
						expect((sgNotificationBar.nodes.message as ChildNode[]).length).to.equal(0);
					});
				});

				describe('when there are no icons', () => {
					it('clear current content', () => {
						const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
						sgNotificationBar.removeMessage();
						expect(outerNode.innerHTML).to.be.empty;
						expect(sgNotificationBar.data.message).to.be.null;
						expect((sgNotificationBar.nodes.message as ChildNode[]).length).to.equal(0);
					});
				});
			});

			describe('when there is no message', () => {
				it('do nothing', () => {
					const outerNode = sgNotificationBar.nodes.outer as HTMLDivElement;
					outerNode.innerHTML = 'Test';
					sgNotificationBar.removeMessage();
					expect(outerNode.innerHTML).to.equal('Test');
				});
			});
		});

		describe('when not built', () => {
			beforeEach(() => {
				sgNotificationBar = NotificationBar.create({
					message: 'Done!',
				}) as SgNotificationBar;
			});

			it('fail', () => {
				expect(() => sgNotificationBar.removeMessage()).to.throw();
			});
		});
	});

	describe('#parseMessage()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			sgNotificationBar = NotificationBar.create() as SgNotificationBar;
			sgFixtureNode = loadFixture(sgNotificationBarFixture);
		});

		afterEach(() => {
			sgFixtureNode.remove();
		});

		describe('when outer node exists', () => {
			beforeEach(() => {
				sgNotificationBar.nodes.outer = sgFixtureNode.children[0] as HTMLDivElement;
			});

			describe('when there are icons with space separator', () => {
				beforeEach(() => {
					sgFixtureNode.children[0].children[0].insertAdjacentText('afterend', ' ');
					sgNotificationBar.parseIcons();
				});

				it('succeed', () => {
					sgNotificationBar.parseMessage();
					expect(sgNotificationBar.data.message).to.equal(sgFixtureData.message);
					expect((sgNotificationBar.nodes.message as ChildNode[]).length).to.equal(1);
				});
			});

			describe('when there are icons with no space separator', () => {
				beforeEach(() => {
					sgNotificationBar.parseIcons();
				});

				it('succeed', () => {
					sgNotificationBar.parseMessage();
					expect(sgNotificationBar.data.message).to.equal(sgFixtureData.message);
					expect((sgNotificationBar.nodes.message as ChildNode[]).length).to.equal(1);
				});
			});

			describe('when there are no icons', () => {
				beforeEach(() => {
					sgFixtureNode.children[0].children[0].remove();
				});

				it('succeed', () => {
					sgNotificationBar.parseMessage();
					expect(sgNotificationBar.data.message).to.equal(sgFixtureData.message);
					expect((sgNotificationBar.nodes.message as ChildNode[]).length).to.equal(1);
				});
			});
		});

		describe('when outer node does not exist', () => {
			it('fail', () => {
				expect(() => sgNotificationBar.parseMessage()).to.throw();
			});
		});
	});
});

describe('StNotificationBar', () => {
	describe('#build()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.ST;
			stNotificationBar = NotificationBar.create() as StNotificationBar;
		});

		describe('when called for the first time', () => {
			it('succeed', () => {
				const setColorStub = sinon.stub(stNotificationBar, 'setColor');
				const setContentStub = sinon.stub(stNotificationBar, 'setContent');
				const dispatchStub = sinon.stub(EventDispatcher, 'dispatch');
				stNotificationBar.build();
				expect(stNotificationBar.nodes.outer).to.be.instanceOf(Node);
				expect(setColorStub.callCount).to.equal(1);
				expect(setContentStub.callCount).to.equal(1);
				expect(stNotificationBar.hasBuilt).to.be.true;
				expect(dispatchStub.callCount).to.equal(1);
				setColorStub.restore();
				setContentStub.restore();
				dispatchStub.restore();
			});
		});

		describe('when called again', () => {
			it('rebuild using same outer node', () => {
				const setColorStub = sinon.stub(stNotificationBar, 'setColor');
				const setContentStub = sinon.stub(stNotificationBar, 'setContent');
				const dispatchStub = sinon.stub(EventDispatcher, 'dispatch');
				stNotificationBar.build();
				const outerNode = stNotificationBar.nodes.outer;
				stNotificationBar.build();
				expect(stNotificationBar.nodes.outer).to.equal(outerNode);
				expect(setColorStub.callCount).to.equal(2);
				expect(setContentStub.callCount).to.equal(2);
				expect(stNotificationBar.hasBuilt).to.be.true;
				expect(dispatchStub.callCount).to.equal(2);
				setColorStub.restore();
				setContentStub.restore();
				dispatchStub.restore();
			});
		});
	});

	describe('#reset()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.ST;
			stNotificationBar = NotificationBar.create() as StNotificationBar;
		});

		describe('when built', () => {
			beforeEach(() => {
				stNotificationBar.build();
			});

			it('rebuild', () => {
				const outerNode = stNotificationBar.nodes.outer;
				const messageNode = stNotificationBar.nodes.message;
				const buildStub = sinon.stub(stNotificationBar, 'build');
				stNotificationBar.reset();
				expect(stNotificationBar.data).to.deep.equal(NotificationBar.getInitialData());
				expect(stNotificationBar.nodes).to.deep.equal({
					...StNotificationBar.getInitialNodes(),
					outer: outerNode,
					message: messageNode,
				});
				expect(stNotificationBar.hasBuilt).to.be.false;
				expect(buildStub.callCount).to.equal(1);
				buildStub.restore();
			});
		});

		describe('when not built', () => {
			it('do not rebuild', () => {
				const buildStub = sinon.stub(stNotificationBar, 'build');
				stNotificationBar.reset();
				expect(stNotificationBar.data).to.deep.equal(NotificationBar.getInitialData());
				expect(stNotificationBar.nodes).to.deep.equal(StNotificationBar.getInitialNodes());
				expect(stNotificationBar.hasBuilt).to.be.false;
				expect(buildStub.callCount).to.equal(0);
				buildStub.restore();
			});
		});
	});

	describe('#setContent()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.ST;
			stNotificationBar = NotificationBar.create() as StNotificationBar;
		});

		it('succeed', () => {
			const icons = ['fa-check-circle'];
			const message = 'Done!';
			const setIconsStub = sinon.stub(stNotificationBar, 'setIcons');
			const setMessageStub = sinon.stub(stNotificationBar, 'setMessage');
			stNotificationBar.setContent(icons, message);
			expect(setIconsStub.callCount).to.equal(1);
			expect(setMessageStub.callCount).to.equal(1);
			setIconsStub.restore();
			setMessageStub.restore();
		});
	});

	describe('#setIcons()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.ST;
			stNotificationBar = NotificationBar.create() as StNotificationBar;
		});

		describe('when built', () => {
			beforeEach(() => {
				stNotificationBar.build();
			});

			describe('when called with different icons', () => {
				it('succeed', () => {
					const removeIconsStub = sinon.stub(stNotificationBar, 'removeIcons');
					const icons = ['fa-check-circle'];
					stNotificationBar.setIcons(icons);
					expect(removeIconsStub.callCount).to.equal(1);
					expect(stNotificationBar.data.icons).to.deep.equal(icons);
					expect(stNotificationBar.nodes.icons.length).to.equal(1);
					removeIconsStub.restore();
				});
			});

			describe('when called with same icons', () => {
				it('do nothing', () => {
					const outerNode = stNotificationBar.nodes.outer as HTMLDivElement;
					outerNode.innerHTML = '';
					const removeIconsStub = sinon.stub(stNotificationBar, 'removeIcons');
					const { icons } = NotificationBar.getInitialData();
					stNotificationBar.setIcons(icons);
					expect(removeIconsStub.callCount).to.equal(0);
					expect(outerNode.innerHTML).to.be.empty;
					removeIconsStub.restore();
				});
			});
		});

		describe('when not built', () => {
			it('fail', () => {
				const icons = ['fa-check-circle'];
				expect(() => stNotificationBar.setIcons(icons)).to.throw();
			});
		});
	});

	describe('#setMessage()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.ST;
			stNotificationBar = NotificationBar.create() as StNotificationBar;
		});

		describe('when built', () => {
			beforeEach(() => {
				stNotificationBar.build();
			});

			describe('when called with different message', () => {
				it('succeed', () => {
					const message = 'Done!';
					stNotificationBar.setMessage(message);
					expect(stNotificationBar.data.message).to.equal(message);
					expect((stNotificationBar.nodes.message as HTMLElement).innerHTML).not.to.be.empty;
				});
			});

			describe('when called with same message', () => {
				it('do nothing', () => {
					const messageNode = stNotificationBar.nodes.message as HTMLElement;
					messageNode.innerHTML = '';
					const { message } = NotificationBar.getInitialData();
					stNotificationBar.setMessage(message);
					expect(messageNode.innerHTML).to.be.empty;
				});
			});
		});

		describe('when not built', () => {
			it('fail', () => {
				const message = 'Done!';
				expect(() => stNotificationBar.setMessage(message)).to.throw();
			});
		});
	});

	describe('#removeIcons()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.ST;
			stNotificationBar = NotificationBar.create().build() as StNotificationBar;
		});

		describe('when there are icons', () => {
			beforeEach(() => {
				const icons = ['fa-check-circle'];
				stNotificationBar.setIcons(icons);
			});

			it('succeed', () => {
				const outerNode = stNotificationBar.nodes.outer as HTMLDivElement;
				stNotificationBar.removeIcons();
				expect(outerNode.childNodes[0]).to.equal(stNotificationBar.nodes.message);
				expect(stNotificationBar.data.icons.length).to.equal(0);
				expect(stNotificationBar.nodes.icons.length).to.equal(0);
			});
		});

		describe('when there are no icons', () => {
			it('do nothing', () => {
				const outerNode = stNotificationBar.nodes.outer as HTMLDivElement;
				outerNode.insertAdjacentText('afterbegin', 'Test');
				stNotificationBar.removeIcons();
				expect(outerNode.childNodes[0]).not.to.equal(stNotificationBar.nodes.message);
			});
		});
	});

	describe('#removeMessage()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.ST;
		});

		describe('when built', () => {
			beforeEach(() => {
				stNotificationBar = NotificationBar.create().build() as StNotificationBar;
			});

			describe('when there is a message', () => {
				beforeEach(() => {
					const message = 'Done!';
					stNotificationBar.setMessage(message);
				});

				it('succeed', () => {
					const messageNode = stNotificationBar.nodes.message as HTMLElement;
					stNotificationBar.removeMessage();
					expect(messageNode.innerHTML).to.be.empty;
					expect(stNotificationBar.data.message).to.be.null;
				});
			});

			describe('when there is no message', () => {
				it('do nothing', () => {
					const messageNode = stNotificationBar.nodes.message as HTMLElement;
					messageNode.innerHTML = 'Test';
					stNotificationBar.removeMessage();
					expect(messageNode.innerHTML).to.equal('Test');
				});
			});
		});

		describe('when not built', () => {
			beforeEach(() => {
				stNotificationBar = NotificationBar.create({
					message: 'Done!',
				}) as StNotificationBar;
			});

			it('fail', () => {
				expect(() => stNotificationBar.removeMessage()).to.throw();
			});
		});
	});

	describe('#parseMessage()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.ST;
			stNotificationBar = NotificationBar.create() as StNotificationBar;
			stFixtureNode = loadFixture(stNotificationBarFixture);
		});

		afterEach(() => {
			stFixtureNode.remove();
		});

		describe('when outer and message nodes exist', () => {
			beforeEach(() => {
				stNotificationBar.nodes.outer = stFixtureNode.children[0] as HTMLDivElement;
			});

			it('succeed', () => {
				stNotificationBar.parseMessage();
				expect(stNotificationBar.data.message).to.equal(stFixtureData.message);
				expect((stNotificationBar.nodes.message as HTMLElement).innerHTML).not.to.be.empty;
			});
		});

		describe('when outer node does not exist', () => {
			it('fail', () => {
				expect(() => stNotificationBar.parseMessage()).to.throw();
			});
		});

		describe('when message node does not exist', () => {
			beforeEach(() => {
				stNotificationBar.nodes.outer = stFixtureNode.children[0] as HTMLDivElement;
				stNotificationBar.nodes.outer.innerHTML = '';
			});

			it('fail', () => {
				expect(() => stNotificationBar.parseMessage()).to.throw();
			});
		});
	});
});
