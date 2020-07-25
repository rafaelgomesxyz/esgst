import { expect } from 'chai';
import { Session } from '../../src/class/Session';
import { Base, BaseNodes } from '../../src/components/Base';
import { ClassNames } from '../../src/constants/ClassNames';
import { Namespaces } from '../../src/constants/Namespaces';

interface TestClassNodes extends BaseNodes {}

interface TestClassData {}

class TestClass extends Base<TestClass, TestClassNodes, TestClassData> {
	build = (): TestClass => {
		this._nodes.outer = document.body;
		this._hasBuilt = true;
		return this;
	};

	insert = (): TestClass => this;

	destroy = (): TestClass => this;

	reset = (): TestClass => this;

	parse = (): TestClass => this;
}

let testClass: TestClass;

describe('Base', () => {
	beforeEach(() => {
		testClass = new TestClass();
	});

	describe('.getError()', () => {
		it('return correct error message', () => {
			expect(TestClass.getError('Test!').message).to.equal('TestClass: Test!');
		});
	});

	describe('#hasBuilt', () => {
		describe('when built', () => {
			beforeEach(() => {
				testClass.build();
			});

			it('be true', () => {
				expect(testClass.hasBuilt).to.be.true;
			});
		});

		describe('when not built', () => {
			it('be false', () => {
				expect(testClass.hasBuilt).to.be.false;
			});
		});
	});

	describe('#hide()', () => {
		describe('when built', () => {
			beforeEach(() => {
				testClass.build();
			});

			describe('when on SG', () => {
				beforeEach(() => {
					Session.namespace = Namespaces.SG;
				});

				it('succeed', () => {
					testClass.hide();
					expect(
						(testClass.nodes.outer as HTMLElement).classList.contains(
							ClassNames[Namespaces.SG].hidden
						)
					).to.be.true;
				});
			});

			describe('when on ST', () => {
				beforeEach(() => {
					Session.namespace = Namespaces.ST;
				});

				it('succeed', () => {
					testClass.hide();
					expect(
						(testClass.nodes.outer as HTMLElement).classList.contains(
							ClassNames[Namespaces.ST].hidden
						)
					).to.be.true;
				});
			});
		});

		describe('when not built', () => {
			it('fail', () => {
				expect(() => testClass.hide()).to.throw();
			});
		});
	});

	describe('#show()', () => {
		describe('when built', () => {
			beforeEach(() => {
				testClass.build();
			});

			describe('when on SG', () => {
				beforeEach(() => {
					Session.namespace = Namespaces.SG;
				});

				it('succeed', () => {
					testClass.show();
					expect(
						(testClass.nodes.outer as HTMLElement).classList.contains(
							ClassNames[Namespaces.SG].hidden
						)
					).to.be.false;
				});
			});

			describe('when on ST', () => {
				beforeEach(() => {
					Session.namespace = Namespaces.ST;
				});

				it('succeed', () => {
					testClass.show();
					expect(
						(testClass.nodes.outer as HTMLElement).classList.contains(
							ClassNames[Namespaces.ST].hidden
						)
					).to.be.false;
				});
			});
		});

		describe('when not built', () => {
			it('fail', () => {
				expect(() => testClass.show()).to.throw();
			});
		});
	});

	describe('#getError()', () => {
		it('return correct error message', () => {
			expect(testClass.getError('Test!').message).to.equal('TestClass: Test!');
		});
	});
});
