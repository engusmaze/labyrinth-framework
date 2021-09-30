import { doc } from "shrtct";

type OptionalCSSStyles = {
	[P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P];
};

// declare type anyFunction = (...args: any[]) => any;
declare type createOptions = (
	| {
			text?: string;
			html?: string;
			[propertyName: string]: any;
			children?: Elem[];
			events?: Event<keyof HTMLElementEventMap>[];
			event?: Event<keyof HTMLElementEventMap>;
			style?: OptionalCSSStyles;
	  }
	| string
	| Event<keyof HTMLElementEventMap>
)[];

export function downloadURI(uri: string, filename: string) {
	var link = doc.createElement("a");
	link.download = filename;
	link.href = uri;
	link.click();
}

export function splitArrayIntoChunks<T>(array: T[], chunkSize: number): T[][] {
	let arr: T[][] = [];
	for (let i = 0; i < array.length; i += chunkSize)
		arr.push(array.slice(i, i + chunkSize));
	return arr;
}

export class Elem {
	/**
	 * HTML element that was passed to the constructor of this object
	 */
	element: HTMLElement;
	/**
	 * Style of html element
	 */
	style: CSSStyleDeclaration;
	parent?: Elem;
	children: Elem[] = [];
	constructor(element: HTMLElement) {
		this.element = element;
		this.style = this.element.style;
	}
	/**
	 * Makes element fullscreen
	 */
	fullscreen() {
		if (doc.fullscreenElement !== this.element)
			this.element.requestFullscreen();
	}
	/**
	 * Makes element fullscreen
	 */
	pointerLock() {
		if (doc.pointerLockElement !== this.element)
			this.element.requestPointerLock();
	}
	/**
	 * Equivalent to addEventListener, but looks like it's taken from node.js
	 */
	on<K extends keyof HTMLElementEventMap>(
		type: K,
		listener: (ev: HTMLElementEventMap[K], elem: Elem) => any,
		options?: boolean | AddEventListenerOptions
	): void {
		const self = this;
		return this.element.addEventListener(
			type,
			(ev: HTMLElementEventMap[K]) => {
				listener(ev, self);
			},
			options
		);
	}
	/**
	 * Inner text of the element
	 */
	get text(): string {
		return this.element.innerText;
	}
	set text(innerText: string) {
		this.element.innerText = innerText;
	}
	/**
	 * Inner html-code of the element
	 */
	get html(): string {
		return this.element.innerHTML;
	}
	set html(innerHTML: string) {
		this.element.innerHTML = innerHTML;
	}
	/**
	 * Element class name
	 */
	get class(): string {
		return this.element.className;
	}
	set class(className: string) {
		this.element.className = className;
	}
	/**
	 * Element class name
	 */
	get id(): string {
		return this.element.id;
	}
	set id(id: string) {
		this.element.id = id;
	}
	/**
	 * Removes an element from the document
	 */
	remove() {
		let els = this.parent?.children;
		if (els !== undefined) els.splice(els.indexOf(this), 1);
		this.element.remove();
	}
	/**
	 * Adds a node as a child to this node
	 */
	add(obj: Elem): Elem {
		obj.parent = this;
		this.children.push(obj);
		this.element.appendChild(obj.element);
		return obj;
	}
	/**
	 * Removes a child node from this node
	 */
	removeChild(obj: Elem): Elem {
		this.children.splice(this.children.indexOf(obj), 1);
		this.element.removeChild(obj.element);
		return obj;
	}
	/**
	 * Removes child nodes
	 */
	removeChildren() {
		this.children = [];
		this.element.innerHTML = ""; // Easiest way to remove all child nodes from document
	}
	/**
	 * Creates element and adds is to this element
	 */
	new<K extends keyof HTMLElementTagNameMap>(
		tagName: K,
		...options: createOptions
	): Elem {
		return this.add(c(tagName, ...options));
	}
}
export class Canvas extends Elem {
	ctx: CanvasRenderingContext2D;

	constructor() {
		super(doc.createElement("canvas"));
		let ctx = this.context("2d");
		if (ctx !== null) {
			this.ctx = ctx;
		} else {
			throw "Unable to get context";
		}
		// this.ctx?.strokeStyle =
	}
	get width() {
		return (<HTMLCanvasElement>this.element).width;
	}
	set width(n: number) {
		(<HTMLCanvasElement>this.element).width = n;
	}
	get height() {
		return (<HTMLCanvasElement>this.element).height;
	}
	set height(n: number) {
		(<HTMLCanvasElement>this.element).height = n;
	}
	/**
	 * Equivalent to strokeStyle at context
	 */
	get strokeStyle(): string | CanvasGradient | CanvasPattern {
		return this.ctx.strokeStyle;
	}
	set strokeStyle(style: string | CanvasGradient | CanvasPattern) {
		this.ctx.strokeStyle = style;
	}
	/**
	 * Equivalent to fillStyle at context
	 */
	get fillStyle(): string | CanvasGradient | CanvasPattern {
		return this.ctx.fillStyle;
	}
	set fillStyle(style: string | CanvasGradient | CanvasPattern) {
		this.ctx.fillStyle = style;
	}
	context(
		contextId: "2d",
		options?: CanvasRenderingContext2DSettings
	): CanvasRenderingContext2D | null {
		return (<HTMLCanvasElement>this.element).getContext(contextId, options);
	}
}
export class Property {
	apply(element: Elem) {}
}
export class ClassName extends Property {
	name: string;
	constructor(name: string) {
		super();
		this.name = name;
	}
	apply(element: Elem) {
		element.class = this.name;
	}
}
export class ID extends Property {
	id: string;
	constructor(id: string) {
		super();
		this.id = id;
	}
	apply(element: Elem) {
		element.id = this.id;
	}
}
export function Class(name: string): ClassName {
	return new ClassName(name);
}
export function id(id: string): ID {
	return new ID(id);
}

export class Event<K extends keyof HTMLElementEventMap> {
	type: K;
	listener: (ev: HTMLElementEventMap[K], elem: Elem) => any;
	options?: boolean | AddEventListenerOptions;
	constructor(
		type: K,
		listener: (ev: HTMLElementEventMap[K], elem: Elem) => any,
		options?: boolean | AddEventListenerOptions
	) {
		this.type = type;
		this.listener = listener;
		this.options = options;
	}
}
export const body = new Elem(doc.body);
export const head = new Elem(doc.head);
/**
 * Gets already created element from doc and returs as Elem object
 */
export function g(text: string) {
	var e = null;
	switch (text[0]) {
		case "#":
			e = doc.getElementById(text.substr(1));
			break;
		case ".":
			e = doc.getElementsByClassName(text.substr(1))[0];
			break;
		default:
			e = doc.getElementsByTagName(text)[0];
			break;
	}
	if (e instanceof HTMLElement) return new Elem(e);
	throw new Error("Unable to find element: " + text);
}
/**
 * Creates html element and returns Elem object
 * You can pass in setting something like class: "anyclass" and it will automatically apply the setting
 */
export function c<K extends keyof HTMLElementTagNameMap>(
	tagName: K,
	...options: createOptions
): Elem {
	let el = new Elem(doc.createElement(tagName));
	for (const option of options) {
		if (typeof option === "string") {
			el.element.innerHTML = option;
		} else if (option instanceof Event) {
			el.on(option.type, option.listener, option.options);
		} else if (option instanceof Property) {
			option.apply(el);
		} else {
			for (const [key, value] of Object.entries(option)) {
				switch (key) {
					case "style":
						Object.assign(el.element.style, value);
						break;
					case "text":
						el.element.innerText = value;
						break;
					case "html":
						el.element.innerHTML = value;
						break;
					case "html":
						el.element.innerHTML = value;
						break;
					case "children":
						for (const child of value) el.add(child);
						break;
					case "events":
						for (const event of value)
							el.on(event.type, event.listener, event.options);
						break;
					case "event":
						el.on(value.type, value.listener, value.options);
						break;
					default:
						el.element.setAttribute(key, value);
						break;
				}
			}
		}
	}
	return el;
}
/**
 * Creates style element with cssText inside.
 * @param cssText
 * @returns Elem
 */
export function addCSS(cssText: string): Elem {
	return head.new("style", cssText);
}
export function loadCSS(src: string): Elem {
	return head.new("link", {
		rel: "stylesheet",
		type: "text/css",
		href: src,
	});
}
export function on<K extends keyof HTMLElementEventMap>(
	type: K,
	listener: (ev: HTMLElementEventMap[K], elem: Elem) => any,
	options?: boolean | AddEventListenerOptions
): Event<K> {
	return new Event(type, listener, options);
}
