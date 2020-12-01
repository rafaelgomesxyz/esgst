import { DOM } from '../class/DOM';
import { Settings } from '../class/Settings';
import { Shared } from '../class/Shared';

class _Collapsible {
	create = (header: HTMLElement, body: HTMLElement, id?: string): HTMLElement => {
		const [collapseNode] = DOM.insert(
			header,
			'afterbegin',
			<fragment>
				<i className="fa fa-minus-square esgst-clickable" title="Collapse section"></i>{' '}
			</fragment>
		);
		const [expandNode] = DOM.insert(
			header,
			'afterbegin',
			<fragment>
				<i className="fa fa-plus-square esgst-clickable esgst-hidden" title="Expand section"></i>{' '}
			</fragment>
		);
		collapseNode.addEventListener('click', () => this.collapse(collapseNode, expandNode, body, id));
		expandNode.addEventListener('click', () => this.expand(collapseNode, expandNode, body, id));
		if (id && Settings.get(`${id}_collapsed`)) {
			this.collapse(collapseNode, expandNode, body);
		}
		return (
			<fragment>
				{header}
				{body}
			</fragment>
		);
	};

	collapse = async (
		collapseNode: HTMLElement,
		expandNode: HTMLElement,
		body: HTMLElement,
		id?: string
	): Promise<void> => {
		collapseNode.classList.add('esgst-hidden');
		expandNode.classList.remove('esgst-hidden');
		body.classList.add('esgst-hidden');
		if (id) {
			await Shared.common.setSetting(`${id}_collapsed`, true);
		}
	};

	expand = async (
		collapseNode: HTMLElement,
		expandNode: HTMLElement,
		body: HTMLElement,
		id?: string
	): Promise<void> => {
		expandNode.classList.add('esgst-hidden');
		collapseNode.classList.remove('esgst-hidden');
		body.classList.remove('esgst-hidden');
		if (id) {
			await Shared.common.setSetting(`${id}_collapsed`, false);
		}
	};
}

export const Collapsible = new _Collapsible();
