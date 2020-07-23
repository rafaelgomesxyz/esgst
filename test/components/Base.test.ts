import { expect } from 'chai';
import { Session } from '../../src/class/Session';
import { Base } from '../../src/components/Base';
import { ClassNames } from '../../src/constants/ClassNames';
import { Namespaces } from '../../src/constants/Namespaces';

class TestClass extends Base {
	get nodes() {
		return this._nodes;
	}

	build = (): void => {};

	insert = (): void => {};

	destroy = (): void => {};

	reset = (): void => {
		this._nodes.outer = null;
	};

	parse = (): void => {
		this._nodes.outer = document.body;
	};
}

const testClass = new TestClass();

describe('Base', () => {
	describe('on SG:', () => {
		before(() => {
			Session.namespace = Namespaces.SG;
		});

		it('static getError() should return correct error message', () => {
			expect(TestClass.getError('Test!').message).to.equal('TestClass: Test!');
		});

		it('getError() should return correct error message', () => {
			expect(testClass.getError('Test!').message).to.equal('TestClass: Test!');
		});

		describe('when parsed,', () => {
			before(() => {
				testClass.parse();
			});

			it('hide() should succeed', () => {
				testClass.hide();
				expect(
					(testClass.nodes.outer as HTMLElement).classList.contains(
						ClassNames[Namespaces.SG].hiddenClass
					)
				).to.be.true;
			});

			it('show() should succeed', () => {
				testClass.show();
				expect(
					(testClass.nodes.outer as HTMLElement).classList.contains(
						ClassNames[Namespaces.SG].hiddenClass
					)
				).to.be.false;
			});
		});

		describe('when not parsed,', () => {
			before(() => {
				testClass.reset();
			});

			it('hide() should fail', () => {
				expect(() => testClass.hide()).to.throw();
			});

			it('show() should fail', () => {
				expect(() => testClass.show()).to.throw();
			});
		});
	});

	describe('on ST:', () => {
		before(() => {
			Session.namespace = Namespaces.ST;
		});

		it('static getError() should return correct error message', () => {
			expect(TestClass.getError('Test!').message).to.equal('TestClass: Test!');
		});

		it('getError() should return correct error message', () => {
			expect(testClass.getError('Test!').message).to.equal('TestClass: Test!');
		});

		describe('when parsed,', () => {
			before(() => {
				testClass.parse();
			});

			it('hide() should succeed', () => {
				testClass.hide();
				expect(
					(testClass.nodes.outer as HTMLElement).classList.contains(
						ClassNames[Namespaces.ST].hiddenClass
					)
				).to.be.true;
			});

			it('show() should succeed', () => {
				testClass.show();
				expect(
					(testClass.nodes.outer as HTMLElement).classList.contains(
						ClassNames[Namespaces.ST].hiddenClass
					)
				).to.be.false;
			});
		});

		describe('when not parsed,', () => {
			before(() => {
				testClass.reset();
			});

			it('hide() should fail', () => {
				expect(() => testClass.hide()).to.throw();
			});

			it('show() should fail', () => {
				expect(() => testClass.show()).to.throw();
			});
		});
	});
});
