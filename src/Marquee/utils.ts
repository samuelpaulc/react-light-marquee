import { MarqueeAnimation, MarqueeDirection } from './interface';

export const getWrapperClassName = (marqueeId: string): string => {
	return `${marqueeId}_wrapper`;
};

export const getPlayStateVariable = (marqueeId: string): string => {
	return `--${marqueeId}_play_state`;
};

export const handleInitialSlide = (
	initialSlideIndex: number,
	slides: React.ReactNode[],
) => {
	if (!initialSlideIndex) return slides;

	return slides
		.slice(initialSlideIndex)
		.concat(slides.slice(0, initialSlideIndex));
};

export const generateSlideStyles = (
	wrapperClassName: string,
	marqueeId: string,
	slideIndex: number,
	translateProp: string,
	rotateYInDeg: string,
	animationConfigs: MarqueeAnimation[],
): string[] => {
	const animations: string[] = [];
	const styles: string[] = [];

	animationConfigs.forEach((animation, index) => {
		const keyFrameId = `${marqueeId}_keyframe_slide${slideIndex}_${index}`;

		styles.push(`@keyframes ${keyFrameId}  {
        0% { transform: ${translateProp}(${animation.from}) ${rotateYInDeg}; }
        100% { transform: ${translateProp}(${animation.to}) ${rotateYInDeg}; }
      }
    `);
		animations.push(
			`${animation.duration}ms linear ${animation.delay}ms ${animation.count} ${keyFrameId}`,
		);
	});

	styles.push(`.${wrapperClassName} > :nth-child(${slideIndex + 1}) {
		animation: ${animations.join(',')};
		animation-play-state: var(${getPlayStateVariable(marqueeId)});
	}`);

	return styles;
};

export const getTranslateProp = (direction: MarqueeDirection): string => {
	return direction === 'left' || direction === 'right'
		? 'translateX'
		: 'translateY';
};

export const getRotateYInDeg = (direction: MarqueeDirection): string => {
	let deg = 0;
	let rotateStyle = '';

	if (direction === 'right') {
		deg = 180;
		rotateStyle = 'rotateY';
	}

	if (direction === 'down') {
		deg = 180;
		rotateStyle = 'rotateX';
	}

	return deg ? `${rotateStyle}(${deg}deg)` : '';
};

const getDistanceBetweenEdges = (direction: MarqueeDirection, startRect: DOMRect, endRect: DOMRect): number => {
	let distance = startRect.bottom - endRect.top; // down

	if (direction === 'left') distance = endRect.right - startRect.left;
  else if (direction === 'right') distance = startRect.right - endRect.left;
  else if (direction === 'up') distance = endRect.bottom - startRect.top;

	return distance;
}

export const getContentSize = (
	children: HTMLElement[],
	direction: MarqueeDirection,
) => {
	const firstChildRect = children[0].getBoundingClientRect();
	const lastChildRect = children[children.length - 1].getBoundingClientRect();

	return getDistanceBetweenEdges(direction, firstChildRect, lastChildRect);
};

export const getSlideEndingEdge = (
	parentElement: HTMLUListElement,
	slideElement: HTMLUListElement,
	direction: MarqueeDirection,
): number => {
	const parentRect = parentElement.getBoundingClientRect();
	const slideRect = slideElement.getBoundingClientRect();

	return getDistanceBetweenEdges(direction, parentRect, slideRect);
};

const getNodeSize = (
	node: HTMLElement,
	direction: MarqueeDirection,
): number => {
	const rect = node.getBoundingClientRect();
	return direction === 'left' || direction === 'right'
		? rect.right - rect.left
		: rect.bottom - rect.top;
};

export const handleReplication = (
	wrapper: HTMLUListElement,
	direction: MarqueeDirection,
	children: React.ReactNode[],
): {
	slideEdges: number[];
	finalSlides: React.ReactNode[];
	contentSize: number;
} => {
	const wrapperSize = getNodeSize(wrapper, direction);
	const finalSlides = [...children];
	const slideEdges: number[] = [];
	const initialSlidesCount = slideEdges.length;
	const childElements = Array.from(wrapper.children) as HTMLUListElement[];
	let contentSize = getContentSize(childElements, direction);
	let needsReplication = false;

	childElements.forEach(slide => {
		slideEdges.push(getSlideEndingEdge(wrapper, slide, direction));
		needsReplication ||=
			contentSize - getNodeSize(slide, direction) < wrapperSize;
	});

	if (needsReplication) {
		let replicationCount = 1;
		if (contentSize <= wrapperSize) {
			replicationCount = Math.floor(wrapperSize / contentSize + 1);
		}

		for (let i = 1; i <= replicationCount; i++) {
			finalSlides.push(...children);

			const offset = contentSize * i;
			for (let j = 0; j < initialSlidesCount; j++) {
				slideEdges.push(slideEdges[j] + offset);
			}
		}

		// update after using it to calculate offsets above
		contentSize = (replicationCount + 1) * contentSize;
	}

	return {
		finalSlides,
		slideEdges,
		contentSize,
	};
};
