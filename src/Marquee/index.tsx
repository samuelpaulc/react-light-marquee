import { useEffect, useRef, useState } from 'react';

import { MarqueeAnimation, MarqueeProps } from './interface';
import {
	generateSlideStyles,
	getPlayStateVariable,
	getRotateYInDeg,
	getTranslateProp,
	getWrapperClassName,
	handleInitialSlide,
	handleReplication,
} from './utils';

export const Marquee = ({
	speed = 50,
	children = [],
	direction = 'left',
	initialSlideIndex = 0,
	pauseOnHover = false,
}: MarqueeProps) => {
	const wrapperRef = useRef<HTMLUListElement>(null);
	const [marqueeId, setMarqueeId] = useState('');
	const [slides, setSlides] = useState<React.ReactNode[]>(() =>
		handleInitialSlide(initialSlideIndex, children),
	);

	useEffect(() => {
		setMarqueeId(`marquee_${crypto?.randomUUID() || new Date().getTime()}`);
	}, []);

	useEffect(() => {
		const wrapper = wrapperRef?.current;
		if (!wrapper || !marqueeId) return;

		var styleElement = document.createElement('style');
		styleElement.setAttribute('type', 'text/css');
		styleElement.setAttribute('id', marqueeId);

		document.head.appendChild(styleElement);

		const styleSheet = styleElement.sheet;
		const playStateVariable = getPlayStateVariable(marqueeId);
		const wrapperClassName = getWrapperClassName(marqueeId);
		const rotateYInDeg = getRotateYInDeg(direction);
		const insertRule = (rule: string) =>
			!!rule && styleSheet?.insertRule?.(rule, 0);

		[
			`
			.${wrapperClassName} {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: ${
					direction === 'left' || direction === 'right'
						? 'row'
						: 'column'
				};
				overflow: hidden;
				${playStateVariable}: running;
				transform: ${rotateYInDeg};
			}
			`,
			pauseOnHover
				? `
				.${wrapperClassName}:hover {
					${playStateVariable}: paused;
				}
			`
				: '',
		].forEach(insertRule);

		const translateProp = getTranslateProp(direction);
		const { slideEdges, finalSlides, contentSize } = handleReplication(
			wrapper,
			direction,
			slides,
		);
		const totalAnimationDuration = ((contentSize / speed) * 1000) | 0;

		setSlides(finalSlides);

		slideEdges.forEach((slideEndingEdge, index) => {
			const firstAnimationDuration =
				((slideEndingEdge / speed) * 1000) | 0;
			const animationConfigs: MarqueeAnimation[] = [
				{
					from: '0px',
					to: `${-slideEndingEdge}px`,
					delay: 0,
					duration: firstAnimationDuration,
					count: 1,
				},
				{
					from: `${contentSize - slideEndingEdge}px`,
					to: `${-slideEndingEdge}px`,
					delay: firstAnimationDuration,
					duration: totalAnimationDuration,
					count: 'infinite',
				},
			];
			generateSlideStyles(
				wrapperClassName,
				marqueeId,
				index,
				translateProp,
				rotateYInDeg,
				animationConfigs,
			).forEach(insertRule);
		});

		return () => {
			document.head.removeChild(styleElement);
		};
	}, [marqueeId]);

	if (!children.length) {
		return null;
	}

	return (
		<ul ref={wrapperRef} className={getWrapperClassName(marqueeId)}>
			{slides.map((slide, slideIndex) => (
				<li key={slideIndex}>{slide}</li>
			))}
		</ul>
	);
};

Marquee.displayName = 'Marquee';

export default Marquee;
