import { expect } from 'chai';
import * as sinon from 'sinon';
import { Session } from '../../src/class/Session';
import {
	NotificationBar,
	NotificationBarData,
	SgNotificationBar,
} from '../../src/components/NotificationBar';
import { Namespaces } from '../../src/constants/Namespaces';
import { loadFixture } from '../../test-helpers/fixture-loader';
import sgNotificationBarFixture from '../fixtures/sg/notification-bar.html';

let fixtureEl: Element;
let notificationBar1: NotificationBar;
let notificationBar2: NotificationBar;
let notificationBars: NotificationBar[];

describe('NotificationBar', () => {
	describe('on SG:', () => {
		before(() => {
			Session.namespace = Namespaces.SG;
		});

		it('create() should succeed with default options', () => {
			notificationBar1 = NotificationBar.create();
			expect(notificationBar1).to.be.instanceOf(SgNotificationBar);
			expect(notificationBar1.nodes).to.deep.equal(NotificationBar.getInitialNodes());
			expect(notificationBar1.data).to.deep.equal(NotificationBar.getInitialData());
		});

		it('create() should succeed with provided options', () => {
			const options: Partial<NotificationBarData> = {
				status: 'info',
				icons: ['fa-question-circle'],
				message: 'Is this a test?',
			};
			notificationBar2 = NotificationBar.create(options);
			expect(notificationBar2).to.be.instanceOf(SgNotificationBar);
			expect(notificationBar2.nodes).to.deep.equal(NotificationBar.getInitialNodes());
			expect(notificationBar2.data).to.deep.equal(options);
		});

		it('build() should succeed', () => {
			const setStatusStub = sinon.stub(notificationBar1, 'setStatus');
			const setContentStub = sinon.stub(notificationBar1, 'setContent');
			notificationBar1.build();
			expect(notificationBar1.nodes.outer).to.be.instanceOf(Node);
			expect(setStatusStub.callCount).to.equal(1);
			expect(setContentStub.callCount).to.equal(1);
			setStatusStub.restore();
			setContentStub.restore();
		});

		describe('when built,', () => {
			it('insert() should succeed', () => {
				const buildStub = sinon.stub(notificationBar1, 'build');
				notificationBar1.insert(document.body, 'afterbegin');
				expect(buildStub.callCount).to.equal(0);
				expect(document.body.children[0]).to.equal(notificationBar1.nodes.outer);
				buildStub.restore();
			});

			it('setStatus() should succeed', () => {
				const status = 'success';
				notificationBar1.setStatus(status);
				expect(notificationBar1.data.status).to.equal(status);
				expect((notificationBar1.nodes.outer as HTMLDivElement).className).to.equal(
					`notification notification--${status} notification--margin-top-small`
				);
			});

			it('setContent() should suceed', () => {
				const icons = ['fa-check-circle'];
				const message = 'Done!';
				notificationBar1.setContent(icons, message);
				expect(notificationBar1.nodes.icons.length).to.equal(1);
				expect(notificationBar1.data.icons).to.deep.equal(icons);
				expect(notificationBar1.data.message).to.equal(message);
			});

			it('setIcons() should succeed', () => {
				const setContentStub = sinon.stub(notificationBar1, 'setContent');
				const icons = ['fa-check-circle'];
				notificationBar1.setIcons(icons);
				expect(setContentStub.callCount).to.equal(1);
				expect(setContentStub.calledWith(icons, notificationBar1.data.message)).to.be.true;
				setContentStub.restore();
			});

			it('setMessage() should succeed', () => {
				const setContentStub = sinon.stub(notificationBar1, 'setContent');
				const message = 'Done!';
				notificationBar1.setMessage(message);
				expect(setContentStub.callCount).to.equal(1);
				expect(setContentStub.calledWith(notificationBar1.data.icons, message)).to.be.true;
				setContentStub.restore();
			});

			it('destroy() should succeed', () => {
				notificationBar1.destroy();
				expect(document.body.children[0]).not.to.equal(notificationBar1.nodes.outer);
				expect(notificationBar1.nodes).to.deep.equal(NotificationBar.getInitialNodes());
				expect(notificationBar1.data).to.deep.equal(NotificationBar.getInitialData());
			});

			it('reset() should succeed', () => {
				const buildStub = sinon.stub(notificationBar1, 'build');
				notificationBar1.reset();
				expect(notificationBar1.nodes).to.deep.equal(NotificationBar.getInitialNodes());
				expect(notificationBar1.data).to.deep.equal(NotificationBar.getInitialData());
				expect(buildStub.callCount).to.equal(1);
				buildStub.restore();
			});
		});

		describe('when not built,', () => {
			it('insert() should fail', () => {
				const buildStub = sinon.stub(notificationBar2, 'build');
				expect(() => notificationBar2.insert(document.body, 'afterbegin')).to.throw();
				expect(buildStub.callCount).to.equal(1);
				buildStub.restore();
			});

			it('setStatus() should fail', () => {
				const status = 'success';
				expect(() => notificationBar2.setStatus(status)).to.throw();
			});

			it('setContent() should fail', () => {
				const icons = ['fa-check-circle'];
				const message = 'Done!';
				expect(() => notificationBar2.setContent(icons, message)).to.throw();
			});

			it('destroy() should fail', () => {
				expect(() => notificationBar2.destroy()).to.throw();
			});
		});

		describe('when loading fixtures,', () => {
			before(() => {
				fixtureEl = loadFixture(sgNotificationBarFixture);
			});

			after(() => {
				fixtureEl.remove();
			});

			it('parse() should succeed with compatible element', () => {
				const parseStatusStub = sinon.stub(notificationBar1, 'parseStatus');
				const parseIconsStub = sinon.stub(notificationBar1, 'parseIcons');
				const parseMessageStub = sinon.stub(notificationBar1, 'parseMessage');
				notificationBar1.parse(fixtureEl.children[0] as Element);
				expect(notificationBar1.nodes.outer).to.equal(fixtureEl.children[0]);
				expect(parseStatusStub.callCount).to.equal(1);
				expect(parseIconsStub.callCount).to.equal(1);
				expect(parseMessageStub.callCount).to.equal(1);
				parseStatusStub.restore();
				parseIconsStub.restore();
				parseMessageStub.restore();
			});

			it('parse() should fail with incompatible element', () => {
				expect(() => notificationBar2.parse(fixtureEl)).to.throw();
			});

			describe('when parse() succeeds,', () => {
				it('parseStatus() should succeed', () => {
					notificationBar1.parseStatus();
					expect(notificationBar1.data.status).to.equal('warning');
				});

				it('parseIcons() should succeed', () => {
					notificationBar1.parseIcons();
					expect(notificationBar1.data.icons).to.deep.equal(['fa-info-circle']);
				});

				it('parseMessage() should succeed', () => {
					notificationBar1.parseMessage();
					expect(notificationBar1.data.message).to.equal(
						'Please remember, all games you receive need to be activated on your corresponding Steam account to remain in good standing. Users failing to do so will receive a suspension.'
					);
				});

				it('getAll() should return correct items', () => {
					notificationBars = NotificationBar.getAll(fixtureEl);
					expect(notificationBars.length).to.equal(1);
					expect(notificationBars[0].nodes).to.deep.equal(notificationBar1.nodes);
					expect(notificationBars[0].data).to.deep.equal(notificationBar1.data);
				});
			});

			describe('when parse() fails,', () => {
				it('parseStatus() should fail', () => {
					expect(() => notificationBar2.parseStatus()).to.throw();
				});

				it('parseIcons() should fail', () => {
					expect(() => notificationBar2.parseIcons()).to.throw();
				});

				it('parseMessage() should fail', () => {
					expect(() => notificationBar2.parseMessage()).to.throw();
				});
			});
		});
	});

	describe('on ST:', () => {
		before(() => {
			Session.namespace = Namespaces.ST;
		});

		it('create() should fail', () => {
			expect(() => NotificationBar.create()).to.throw();
		});
	});
});
