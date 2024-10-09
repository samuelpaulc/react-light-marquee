export type MarqueeDirection = 'left' | 'right' | 'up' | 'down';

export type MarqueeProps = {
	id: string;
	direction?: MarqueeDirection;
	play?: boolean;
	speed?: number;
	pauseOnHover?: boolean;
	initialSlideIndex?: number;
	children: React.ReactNode[];
};

export type MarqueeAnimation = {
	from: string;
	to: string;
	duration: number;
	delay: number;
	count: 1 | 'infinite';
};
