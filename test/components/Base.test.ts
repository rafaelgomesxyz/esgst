import { expect } from 'chai';
import * as sinon from 'sinon';
import { Base, BaseNodes } from '../../src/components/Base';
import { ClassNames } from '../../src/constants/ClassNames';
import { Namespaces } from '../../src/constants/Namespaces';

interface TestClassData {}

interface TestClassNodes extends BaseNodes {}

class TestClass extends Base<TestClass, TestClassData, TestClassNodes> {
	build = (): TestClass => {
		this._nodes.outer = document.createElement('div');
		this._hasBuilt = true;
		return this;
	};

	reset = (): TestClass => this;

	parse = (): TestClass => this;
}

let testClass: TestClass;

describe('Base', () => {
	describe('.getError()', () => {
		it('return correct error message', () => {
			expect(TestClass.getError('Test!').message).to.equal('TestClass: Test!');
		});
	});

	describe('#insert()', () => {
		beforeEach(() => {
			testClass = new TestClass(Namespaces.SG);
		});

		describe('when built', () => {
			beforeEach(() => {
				testClass.build();
			});

			afterEach(() => {
				testClass.destroy();
			});

			it('succeed', () => {
				const buildSpy = sinon.spy(testClass, 'build');
				testClass.insert(document.body, 'afterbegin');
				expect(buildSpy.callCount).to.equal(0);
				expect(document.body.children[0]).to.equal(testClass.nodes.outer);
				buildSpy.restore();
			});
		});

		describe('when not built', () => {
			describe('when build succeeds', () => {
				afterEach(() => {
					testClass.destroy();
				});

				it('succeed', () => {
					const buildSpy = sinon.spy(testClass, 'build');
					testClass.insert(document.body, 'afterbegin');
					expect(buildSpy.callCount).to.equal(1);
					expect(document.body.children[0]).to.equal(testClass.nodes.outer);
					buildSpy.restore();
				});
			});

			describe('when build fails', () => {
				it('fail', () => {
					const buildStub = sinon.stub(testClass, 'build');
					expect(() => testClass.insert(document.body, 'afterbegin')).to.throw();
					expect(buildStub.callCount).to.equal(1);
					buildStub.restore();
				});
			});
		});
	});

	describe('#destroy()', () => {
		beforeEach(() => {
			testClass = new TestClass(Namespaces.SG);
		});

		describe('when built', () => {
			beforeEach(() => {
				testClass.insert(document.body, 'afterbegin');
			});

			it('succeed', () => {
				const resetStub = sinon.stub(testClass, 'reset');
				const outerNode = testClass.nodes.outer;
				testClass.destroy();
				expect(document.body.children[0]).not.to.equal(outerNode);
				expect(testClass.nodes.outer).to.be.null;
				expect(testClass.hasBuilt).to.be.false;
				expect(resetStub.callCount).to.equal(1);
				resetStub.restore();
			});
		});

		describe('when not built', () => {
			it('fail', () => {
				expect(() => testClass.destroy()).to.throw();
			});
		});
	});

	describe('#namespace', () => {
		beforeEach(() => {
			testClass = new TestClass(Namespaces.SG);
		});

		it('be correct', () => {
			expect(testClass.namespace).to.equal(Namespaces.SG);
		});
	});

	describe('#hasBuilt', () => {
		beforeEach(() => {
			testClass = new TestClass(Namespaces.SG);
		});

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
			describe('when on SG', () => {
				beforeEach(() => {
					testClass = new TestClass(Namespaces.SG).build();
				});

				it('succeed', () => {
					const outerNode = testClass.nodes.outer as HTMLElement;
					testClass.hide();
					expect(outerNode.classList.contains(ClassNames[Namespaces.SG].hidden)).to.be.true;
				});
			});

			describe('when on ST', () => {
				beforeEach(() => {
					testClass = new TestClass(Namespaces.ST).build();
				});

				it('succeed', () => {
					const outerNode = testClass.nodes.outer as HTMLElement;
					testClass.hide();
					expect(outerNode.classList.contains(ClassNames[Namespaces.ST].hidden)).to.be.true;
				});
			});
		});

		describe('when not built', () => {
			beforeEach(() => {
				testClass = new TestClass(Namespaces.SG);
			});

			it('fail', () => {
				expect(() => testClass.hide()).to.throw();
			});
		});
	});

	describe('#show()', () => {
		describe('when built', () => {
			describe('when on SG', () => {
				beforeEach(() => {
					testClass = new TestClass(Namespaces.SG).build();
				});

				it('succeed', () => {
					const outerNode = testClass.nodes.outer as HTMLElement;
					testClass.show();
					expect(outerNode.classList.contains(ClassNames[Namespaces.SG].hidden)).to.be.false;
				});
			});

			describe('when on ST', () => {
				beforeEach(() => {
					testClass = new TestClass(Namespaces.ST).build();
				});

				it('succeed', () => {
					const outerNode = testClass.nodes.outer as HTMLElement;
					testClass.show();
					expect(outerNode.classList.contains(ClassNames[Namespaces.ST].hidden)).to.be.false;
				});
			});
		});

		describe('when not built', () => {
			beforeEach(() => {
				testClass = new TestClass(Namespaces.SG);
			});

			it('fail', () => {
				expect(() => testClass.show()).to.throw();
			});
		});
	});

	describe('#getError()', () => {
		beforeEach(() => {
			testClass = new TestClass(Namespaces.SG);
		});

		it('return correct error message', () => {
			expect(testClass.getError('Test!').message).to.equal('TestClass: Test!');
		});
	});
});
