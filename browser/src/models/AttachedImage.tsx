import { DOM } from '../class/DOM';
import { Session } from '../class/Session';
import { Namespaces } from '../constants/Namespaces';

abstract class AttachedImage implements IAttachedImage {
  nodes: IAttachedImageNodes;
  data: IAttachedImageData;

  constructor() {
    this.nodes = AttachedImage.getDefaultNodes();
    this.data = AttachedImage.getDefaultData();
  }

  static getDefaultNodes(): IAttachedImageNodes {
    return {
      outer: null,
      button: null,
      link: null,
      image: null,
    };
  }

  static getDefaultData(): IAttachedImageData {
    return {
      title: '',
      url: '',
    };
  }

  static create(): IAttachedImage {
    switch (Session.namespace) {
      case Namespaces.SG: {
        return new SgAttachedImage();
      }
      case Namespaces.ST: {
        return new StAttachedImage();
      }
    }
    return null;
  }

  static parseAll(context: HTMLElement): IAttachedImage[] {
    switch (Session.namespace) {
      case Namespaces.SG: {
        return SgAttachedImage.parseAll(context);
      }
      case Namespaces.ST: {
        return StAttachedImage.parseAll(context);
      }
    }
    return null;
  }

	abstract parse(outer: HTMLElement): void;
	abstract parseNodes(outer: HTMLElement): void;
	abstract parseData(): void;
	abstract build(context: HTMLElement, position: string): void;
}

class SgAttachedImage extends AttachedImage {
  constructor() {
    super();
  }

  static parseAll(context: HTMLElement): SgAttachedImage[] {    
		const images: SgAttachedImage[] = [];
		const elements = context.querySelectorAll('.comment__toggle-attached');
		for (const element of elements) {
			const image = new SgAttachedImage();
			image.parse(element.parentElement as HTMLDivElement);
			images.push(image);
		}
		return images;
  }

  parse(outer: HTMLDivElement): void {
		this.parseNodes(outer);
		this.parseData();
  }

  parseNodes(outer: HTMLDivElement): void {
    const nodes: IAttachedImageNodes = AttachedImage.getDefaultNodes();
    nodes.outer = outer;
    nodes.button = nodes.outer.querySelector('.comment__toggle-attached');
    nodes.link = nodes.outer.querySelector('a');
    nodes.image = nodes.link.querySelector('img');
    this.nodes = nodes;
  }

  parseData(): void {
    const nodes = this.nodes;
    const data: IAttachedImageData = AttachedImage.getDefaultData();
    data.title = nodes.image.title;
    data.url = nodes.image.src;
    this.data = data;
  }

  build(context: HTMLElement, position: string): void {
    if (this.nodes.outer) {
      this.nodes.outer.remove();
    }
    const outer = DOM.insert(context, position, (
      <div>
        <div class="comment__toggle-attached">View attached image.</div>
        <a href={this.data.url} rel="nofollow noopener" target="_blank">
          <img alt={this.data.title} title={this.data.title} class="is-hidden" src={this.data.url}/>
        </a>
      </div>
    ));
    this.parseNodes(outer);
  }
}

class StAttachedImage extends AttachedImage {
  constructor() {
    super();
  }

  static parseAll(context: HTMLElement): StAttachedImage[] {    
		const images: StAttachedImage[] = [];
		const elements = context.querySelectorAll('.view_attached');
		for (const element of elements) {
			const image = new StAttachedImage();
			image.parse(element.parentElement as HTMLDivElement);
			images.push(image);
		}
		return images;
  }

  parse(outer: HTMLDivElement): void {
		this.parseNodes(outer);
		this.parseData();
  }

  parseNodes(outer: HTMLDivElement): void {
    const nodes: IAttachedImageNodes = AttachedImage.getDefaultNodes();
    nodes.outer = outer;
    nodes.button = nodes.outer.querySelector('.view_attached');
    nodes.link = nodes.outer.querySelector('a');
    nodes.image = nodes.link.querySelector('img');
    this.nodes = nodes;
  }

  parseData(): void {
    const nodes = this.nodes;
    const data: IAttachedImageData = AttachedImage.getDefaultData();
    data.title = nodes.image.title;
    data.url = nodes.image.src;
    this.data = data;
  }

  build(context: HTMLElement, position: string): void {
    if (this.nodes.outer) {
      this.nodes.outer.remove();
    }
    const outer = DOM.insert(context, position, (
      <div>
        <div class="view_attached">View attached image.</div>
        <a href={this.data.url}>
          <img alt={this.data.title} title={this.data.title} class="is_hidden" src={this.data.url}/>
        </a>
      </div>
    ));
    this.parseNodes(outer);
  }
}

export { AttachedImage };