export type MarqueeDirection = 'left' | 'right' | 'up' | 'down';

export type MarqueeProps = {
	direction?: MarqueeDirection;
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
