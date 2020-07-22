const loadedFixtures = [];

const loadFixture = (fixture) => {
	document.body.insertAdjacentHTML('afterbegin', fixture);
	const fixtureEl = document.body.firstElementChild;
	loadedFixtures.push(fixtureEl);
};

const unloadFixtures = () => {
	loadedFixtures.forEach((fixtureEl) => fixtureEl.remove());
};

export { loadFixture, unloadFixtures };
