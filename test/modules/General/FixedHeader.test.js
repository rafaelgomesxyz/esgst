import { expect } from 'chai';
import { Shared } from '../../../src/class/Shared';
import { Header, IHeader } from '../../../src/components/Header';
import { Namespaces } from '../../../src/constants/Namespaces';
import { generalFixedHeader } from '../../../src/modules/General/FixedHeader';
import { loadFixture, unloadFixtures } from '../../../test-helpers/fixture-loader';
import sgHeaderFixture from '../../fixtures/sg/header.html';
import stHeaderFixture from '../../fixtures/st/header.html';

describe('Fixed Header', () => {
	describe('on SG', () => {
		describe('when there is a header', () => {
			before(() => {
				loadFixture(sgHeaderFixture);
				Shared.header = Header(Namespaces.SG);
				Shared.header.parse(document.body);
			});

			after(() => {
				unloadFixtures();
			});

			it('should load successfully', () => {
				expect(Shared.header).to.be.instanceOf(IHeader);
				generalFixedHeader.init();
				expect(Array.from(Shared.header.nodes.outer.classList)).to.include('esgst-fh');
			});
		});

		describe('when there is no header', () => {
			before(() => {
				Shared.header = Header(Namespaces.SG);
			});

			after(() => {
				unloadFixtures();
			});

			it('should silently fail to load', () => {
				expect(Shared.header.nodes.outer).to.be.null;
				generalFixedHeader.init();
			});
		});
	});

	describe('on ST', () => {
		describe('when there is a header', () => {
			before(() => {
				loadFixture(stHeaderFixture);
				Shared.header = Header(Namespaces.ST);
				Shared.header.parse(document.body);
			});

			after(() => {
				unloadFixtures();
			});

			it('should load successfully', () => {
				expect(Shared.header).to.be.instanceOf(IHeader);
				generalFixedHeader.init();
				expect(Array.from(Shared.header.nodes.outer.classList)).to.include('esgst-fh');
			});
		});

		describe('when there is no header', () => {
			before(() => {
				Shared.header = Header(Namespaces.SG);
			});

			after(() => {
				unloadFixtures();
			});

			it('should silently fail to load', () => {
				expect(Shared.header.nodes.outer).to.be.null;
				generalFixedHeader.init();
			});
		});
	});
});
