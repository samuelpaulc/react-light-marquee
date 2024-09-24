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

export const getContentSize = (
	children: HTMLElement[],
	direction: MarqueeDirection,
) => {
	const firstChildRect = children[0].getBoundingClientRect();
	const lastChildRect = children[children.length - 1].getBoundingClientRect();
	if (!firstChildRect || !lastChildRect) return 0;

	if (direction === 'left') {
		return lastChildRect.right - firstChildRect.left;
	}
	if (direction === 'right') {
		return firstChildRect.right - lastChildRect.left;
	}
	if (direction === 'up') {
		return lastChildRect.bottom - firstChildRect.top;
	}
	return firstChildRect.bottom - lastChildRect.top;
};

export const getSlideEndingEdge = (
	node: HTMLUListElement,
	direction: MarqueeDirection,
): number => {
	const parentRect = (
		node.parentNode as HTMLUListElement
	)?.getBoundingClientRect();
	if (!parentRect) return 0;

	const slideRect = node.getBoundingClientRect();

	if (direction === 'left') {
		return slideRect.right - parentRect.left;
	}
	if (direction === 'right') {
		return parentRect.right - slideRect.left;
	}
	if (direction === 'up') {
		return slideRect.bottom - parentRect.top;
	}
	return parentRect.bottom - slideRect.top;
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
		slideEdges.push(getSlideEndingEdge(slide, direction));
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
