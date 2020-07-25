import { expect } from 'chai';
import * as sinon from 'sinon';
import { EventDispatcher } from '../../src/class/EventDispatcher';
import { Session } from '../../src/class/Session';
import {
	NotificationBar,
	NotificationBarData,
	SgNotificationBar,
} from '../../src/components/NotificationBar';
import { Namespaces } from '../../src/constants/Namespaces';
import { loadFixture } from '../../test-helpers/fixture-loader';
import sgNotificationBarFixture from '../fixtures/sg/notification-bar.html';

let notificationBar: NotificationBar;
let fixtureEl: Element;
const fixtureData = {
	status: 'warning',
	icons: ['fa-info-circle'],
	message:
		'Please remember, all games you receive need to be activated on your corresponding Steam account to remain in good standing. Users failing to do so will receive a suspension.',
};

describe('NotificationBar', () => {
	describe('.create()', () => {
		describe('when on SG', () => {
			beforeEach(() => {
				Session.namespace = Namespaces.SG;
			});

			it('succeed with default options', () => {
				notificationBar = NotificationBar.create();
				expect(notificationBar).to.be.instanceOf(SgNotificationBar);
				expect(notificationBar.nodes).to.deep.equal(NotificationBar.getInitialNodes());
				expect(notificationBar.data).to.deep.equal(NotificationBar.getInitialData());
			});

			it('succeed with provided options', () => {
				const options: Partial<NotificationBarData> = {
					status: 'info',
					icons: ['fa-question-circle'],
					message: 'Is this a test?',
				};
				notificationBar = NotificationBar.create(options);
				expect(notificationBar).to.be.instanceOf(SgNotificationBar);
				expect(notificationBar.nodes).to.deep.equal(NotificationBar.getInitialNodes());
				expect(notificationBar.data).to.deep.equal(options);
			});
		});

		describe('when on ST', () => {
			beforeEach(() => {
				Session.namespace = Namespaces.ST;
			});

			it('fail', () => {
				expect(() => NotificationBar.create()).to.throw();
			});
		});
	});

	describe('.getAll()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			fixtureEl = loadFixture(sgNotificationBarFixture);
		});

		afterEach(() => {
			fixtureEl.remove();
		});

		it('return correct items', () => {
			const notificationBars = NotificationBar.getAll(fixtureEl);
			expect(notificationBars.length).to.equal(1);
			expect(notificationBars[0].nodes.outer).to.equal(fixtureEl.children[0]);
			expect(notificationBars[0].data).to.deep.equal(fixtureData);
		});
	});

	describe('#build()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			notificationBar = NotificationBar.create();
		});

		describe('when called for the first time', () => {
			it('succeed', () => {
				const setStatusStub = sinon.stub(notificationBar, 'setStatus');
				const setContentStub = sinon.stub(notificationBar, 'setContent');
				const dispatchStub = sinon.stub(EventDispatcher, 'dispatch');
				notificationBar.build();
				expect(notificationBar.nodes.outer).to.be.instanceOf(Node);
				expect(setStatusStub.callCount).to.equal(1);
				expect(setContentStub.callCount).to.equal(1);
				expect(notificationBar.hasBuilt).to.be.true;
				expect(dispatchStub.callCount).to.equal(1);
				setStatusStub.restore();
				setContentStub.restore();
				dispatchStub.restore();
			});
		});

		describe('when called again', () => {
			it('rebuild using same outer element', () => {
				const setStatusStub = sinon.stub(notificationBar, 'setStatus');
				const setContentStub = sinon.stub(notificationBar, 'setContent');
				const dispatchStub = sinon.stub(EventDispatcher, 'dispatch');
				notificationBar.build();
				const outerEl = notificationBar.nodes.outer;
				notificationBar.build();
				expect(notificationBar.nodes.outer).to.equal(outerEl);
				expect(setStatusStub.callCount).to.equal(2);
				expect(setContentStub.callCount).to.equal(2);
				expect(notificationBar.hasBuilt).to.be.true;
				expect(dispatchStub.callCount).to.equal(2);
				setStatusStub.restore();
				setContentStub.restore();
				dispatchStub.restore();
			});
		});
	});

	describe('#reset()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			notificationBar = NotificationBar.create();
		});

		describe('when built', () => {
			beforeEach(() => {
				notificationBar.build();
			});

			it('rebuild', () => {
				const outerEl = notificationBar.nodes.outer;
				const buildStub = sinon.stub(notificationBar, 'build');
				notificationBar.reset();
				expect(notificationBar.nodes).to.deep.equal({
					...NotificationBar.getInitialNodes(),
					outer: outerEl,
				});
				expect(notificationBar.data).to.deep.equal(NotificationBar.getInitialData());
				expect(notificationBar.hasBuilt).to.be.false;
				expect(buildStub.callCount).to.equal(1);
				buildStub.restore();
			});
		});

		describe('when not built', () => {
			it('do not rebuild', () => {
				const buildStub = sinon.stub(notificationBar, 'build');
				notificationBar.reset();
				expect(notificationBar.nodes).to.deep.equal(NotificationBar.getInitialNodes());
				expect(notificationBar.data).to.deep.equal(NotificationBar.getInitialData());
				expect(notificationBar.hasBuilt).to.be.false;
				expect(buildStub.callCount).to.equal(0);
				buildStub.restore();
			});
		});
	});

	describe('#setStatus()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			notificationBar = NotificationBar.create();
		});

		describe('when built', () => {
			beforeEach(() => {
				notificationBar.build();
			});

			describe('when called with different status', () => {
				it('succeed', () => {
					const outerEl = notificationBar.nodes.outer as HTMLDivElement;
					const status = 'success';
					notificationBar.setStatus(status);
					expect(notificationBar.data.status).to.equal(status);
					expect(outerEl.className).to.equal(
						`notification notification--${status} notification--margin-top-small`
					);
				});
			});

			describe('when called with same status', () => {
				it('do nothing', () => {
					const outerEl = notificationBar.nodes.outer as HTMLDivElement;
					outerEl.className = '';
					notificationBar.setStatus(NotificationBar.defaultStatus);
					expect(outerEl.className).to.be.empty;
				});
			});
		});

		describe('when not built', () => {
			it('fail', () => {
				const status = 'success';
				expect(() => notificationBar.setStatus(status)).to.throw();
			});
		});
	});

	describe('#setContent()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			notificationBar = NotificationBar.create();
		});

		describe('when built', () => {
			beforeEach(() => {
				notificationBar.build();
			});

			describe('when called with different content', () => {
				it('clear current content', () => {
					const outerEl = notificationBar.nodes.outer as HTMLDivElement;
					const icons = ['fa-check-circle'];
					const message = 'Done!';
					const setIconsStub = sinon.stub(notificationBar, 'setIcons');
					const setMessageStub = sinon.stub(notificationBar, 'setMessage');
					notificationBar.setContent(icons, message);
					expect(outerEl.innerHTML).to.be.empty;
					expect(notificationBar.nodes.icons.length).to.equal(0);
					expect(notificationBar.data.icons.length).to.equal(0);
					expect(notificationBar.data.message).to.be.null;
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
					notificationBar.setContent(icons, message);
				});

				it('do nothing', () => {
					const outerEl = notificationBar.nodes.outer as HTMLDivElement;
					const setIconsStub = sinon.stub(notificationBar, 'setIcons');
					const setMessageStub = sinon.stub(notificationBar, 'setMessage');
					notificationBar.setContent(icons, message);
					expect(outerEl.innerHTML).not.to.be.empty;
					expect(notificationBar.nodes.icons.length).to.equal(1);
					expect(notificationBar.data.icons).to.deep.equal(icons);
					expect(notificationBar.data.message).to.equal(message);
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
				expect(() => notificationBar.setContent(icons, message)).to.throw();
			});
		});
	});

	describe('#setIcons()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			notificationBar = NotificationBar.create();
		});

		describe('when built', () => {
			beforeEach(() => {
				notificationBar.build();
			});

			describe('when called with different icons', () => {
				it('succeed', () => {
					const removeIconsStub = sinon.stub(notificationBar, 'removeIcons');
					const icons = ['fa-check-circle'];
					notificationBar.setIcons(icons);
					expect(removeIconsStub.callCount).to.equal(1);
					expect(notificationBar.nodes.icons.length).to.equal(1);
					expect(notificationBar.data.icons).to.deep.equal(icons);
					removeIconsStub.restore();
				});
			});

			describe('when called with same icons', () => {
				it('do nothing', () => {
					const outerEl = notificationBar.nodes.outer as HTMLDivElement;
					outerEl.innerHTML = '';
					const removeIconsStub = sinon.stub(notificationBar, 'removeIcons');
					const { icons } = NotificationBar.getInitialData();
					notificationBar.setIcons(icons);
					expect(removeIconsStub.callCount).to.equal(0);
					expect(outerEl.innerHTML).to.be.empty;
					removeIconsStub.restore();
				});
			});
		});

		describe('when not built', () => {
			it('fail', () => {
				const icons = ['fa-check-circle'];
				expect(() => notificationBar.setIcons(icons)).to.throw();
			});
		});
	});

	describe('#setMessage()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			notificationBar = NotificationBar.create();
		});

		describe('when built', () => {
			beforeEach(() => {
				notificationBar.build();
			});

			describe('when called with different message', () => {
				it('succeed', () => {
					const removeMessageStub = sinon.stub(notificationBar, 'removeMessage');
					const message = 'Done!';
					notificationBar.setMessage(message);
					expect(removeMessageStub.callCount).to.equal(1);
					expect(notificationBar.data.message).to.equal(message);
					removeMessageStub.restore();
				});
			});

			describe('when called with same message', () => {
				it('do nothing', () => {
					const outerEl = notificationBar.nodes.outer as HTMLDivElement;
					outerEl.innerHTML = '';
					const removeMessageStub = sinon.stub(notificationBar, 'removeMessage');
					const { message } = NotificationBar.getInitialData();
					notificationBar.setMessage(message);
					expect(removeMessageStub.callCount).to.equal(0);
					expect(outerEl.innerHTML).to.be.empty;
					removeMessageStub.restore();
				});
			});
		});

		describe('when not built', () => {
			it('fail', () => {
				const message = 'Done!';
				expect(() => notificationBar.setMessage(message)).to.throw();
			});
		});
	});

	describe('#removeIcons()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
		});

		describe('when built', () => {
			beforeEach(() => {
				notificationBar = NotificationBar.create().build();
			});

			describe('when there are icons', () => {
				beforeEach(() => {
					const icons = ['fa-check-circle'];
					notificationBar.setIcons(icons);
				});

				describe('when there is a message', () => {
					const message = 'Done!';

					beforeEach(() => {
						notificationBar.setMessage(message);
					});

					it('remove current icons', () => {
						const outerEl = notificationBar.nodes.outer as HTMLDivElement;
						notificationBar.removeIcons();
						expect(outerEl.innerHTML).to.equal(message);
						expect(notificationBar.nodes.icons.length).to.equal(0);
						expect(notificationBar.data.icons.length).to.equal(0);
					});
				});

				describe('when there is no message', () => {
					it('clear current content', () => {
						const outerEl = notificationBar.nodes.outer as HTMLDivElement;
						notificationBar.removeIcons();
						expect(outerEl.innerHTML).to.be.empty;
						expect(notificationBar.nodes.icons.length).to.equal(0);
						expect(notificationBar.data.icons.length).to.equal(0);
					});
				});
			});

			describe('when there are no icons', () => {
				it('do nothing', () => {
					const outerEl = notificationBar.nodes.outer as HTMLDivElement;
					outerEl.innerHTML = 'Test';
					notificationBar.removeIcons();
					expect(outerEl.innerHTML).to.equal('Test');
				});
			});
		});

		describe('when not built', () => {
			beforeEach(() => {
				notificationBar = NotificationBar.create({
					icons: ['fa-check-circle'],
				});
			});

			it('fail', () => {
				expect(() => notificationBar.removeIcons()).to.throw();
			});
		});
	});

	describe('#removeMessage()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
		});

		describe('when built', () => {
			beforeEach(() => {
				notificationBar = NotificationBar.create().build();
			});

			describe('when there is a message', () => {
				beforeEach(() => {
					const message = 'Done!';
					notificationBar.setMessage(message);
				});

				describe('when there are icons', () => {
					const icons = ['fa-check-circle'];

					beforeEach(() => {
						notificationBar.setIcons(icons);
					});

					it('remove current message', () => {
						const outerEl = notificationBar.nodes.outer as HTMLDivElement;
						notificationBar.removeMessage();
						expect(outerEl.innerHTML).to.equal('<i class="fa fa-check-circle"></i> ');
						expect(notificationBar.data.message).to.be.null;
					});
				});

				describe('when there are no icons', () => {
					it('clear current content', () => {
						const outerEl = notificationBar.nodes.outer as HTMLDivElement;
						notificationBar.removeMessage();
						expect(outerEl.innerHTML).to.be.empty;
						expect(notificationBar.data.message).to.be.null;
					});
				});
			});

			describe('when there is no message', () => {
				it('do nothing', () => {
					const outerEl = notificationBar.nodes.outer as HTMLDivElement;
					outerEl.innerHTML = 'Test';
					notificationBar.removeMessage();
					expect(outerEl.innerHTML).to.equal('Test');
				});
			});
		});

		describe('when not built', () => {
			beforeEach(() => {
				notificationBar = NotificationBar.create({
					message: 'Done!',
				});
			});

			it('fail', () => {
				expect(() => notificationBar.removeMessage()).to.throw();
			});
		});
	});

	describe('#parse()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			notificationBar = NotificationBar.create();
			fixtureEl = loadFixture(sgNotificationBarFixture);
		});

		afterEach(() => {
			fixtureEl.remove();
		});

		describe('when called with compatible element', () => {
			it('succeed', () => {
				const parseStatusStub = sinon.stub(notificationBar, 'parseStatus');
				const parseIconsStub = sinon.stub(notificationBar, 'parseIcons');
				const parseMessageStub = sinon.stub(notificationBar, 'parseMessage');
				notificationBar.parse(fixtureEl.children[0] as Element);
				expect(notificationBar.nodes.outer).to.equal(fixtureEl.children[0]);
				expect(parseStatusStub.callCount).to.equal(1);
				expect(parseIconsStub.callCount).to.equal(1);
				expect(parseMessageStub.callCount).to.equal(1);
				parseStatusStub.restore();
				parseIconsStub.restore();
				parseMessageStub.restore();
			});
		});

		describe('when called with incompatible element', () => {
			it('fail', () => {
				expect(() => notificationBar.parse(fixtureEl)).to.throw();
			});
		});
	});

	describe('#parseStatus()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			notificationBar = NotificationBar.create();
			fixtureEl = loadFixture(sgNotificationBarFixture);
		});

		afterEach(() => {
			fixtureEl.remove();
		});

		describe('when outer element exists', () => {
			beforeEach(() => {
				notificationBar.nodes.outer = fixtureEl.children[0] as HTMLDivElement;
			});

			it('succeed', () => {
				notificationBar.parseStatus();
				expect(notificationBar.data.status).to.equal(fixtureData.status);
			});
		});

		describe('when outer element does not exist', () => {
			it('fail', () => {
				expect(() => notificationBar.parseStatus()).to.throw();
			});
		});
	});

	describe('#parseIcons()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			notificationBar = NotificationBar.create();
			fixtureEl = loadFixture(sgNotificationBarFixture);
		});

		afterEach(() => {
			fixtureEl.remove();
		});

		describe('when outer element exists', () => {
			beforeEach(() => {
				notificationBar.nodes.outer = fixtureEl.children[0] as HTMLDivElement;
			});

			it('succeed', () => {
				notificationBar.parseIcons();
				expect(notificationBar.data.icons).to.deep.equal(fixtureData.icons);
			});
		});

		describe('when outer element does not exist', () => {
			it('fail', () => {
				expect(() => notificationBar.parseIcons()).to.throw();
			});
		});
	});

	describe('#parseMessage()', () => {
		beforeEach(() => {
			Session.namespace = Namespaces.SG;
			notificationBar = NotificationBar.create();
			fixtureEl = loadFixture(sgNotificationBarFixture);
		});

		afterEach(() => {
			fixtureEl.remove();
		});

		describe('when outer element exists', () => {
			beforeEach(() => {
				notificationBar.nodes.outer = fixtureEl.children[0] as HTMLDivElement;
			});

			it('succeed', () => {
				notificationBar.parseMessage();
				expect(notificationBar.data.message).to.equal(fixtureData.message);
			});
		});

		describe('when outer element does not exist', () => {
			it('fail', () => {
				expect(() => notificationBar.parseMessage()).to.throw();
			});
		});
	});
});
