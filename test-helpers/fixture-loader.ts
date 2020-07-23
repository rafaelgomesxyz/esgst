const loadFixture = (fixture: string): Element => {
	document.body.insertAdjacentHTML('afterbegin', '<div></div>');
	const fixtureEl = document.body.children[0];
	fixtureEl.innerHTML = fixture;
	return fixtureEl;
};

export { loadFixture };
