# react-light-marquee
What goes around comes around! An ode to the HTML marquee element.

For most cases the number of elements in the dom is equal to number of children i.e it has ***no duplication***. Duplication is only done when it is absolutely necessary.

Lightweight in bundle size and dom footprint.

Marquee fills the parent container and renders the children by default.

Marquee generates a css class for every instance with specific styles and hence it requires a `id` value to passed in.

# Installation

    npm install react-light-marquee

or

    yarn install react-light-marquee

# How to use

	  import React from "react";
	  import ListItem from "../ui/ListItem";
	  import Marquee from "react-light-marquee";

	  const Page = () => (
	    <Marquee direction="right">
	      <ListItem />
	      <ListItem />
	      <ListItem />
	      <ListItem />
	    </Marquee>
	  );

      export default Page;


# API
Marquee prop list
| Property | Type | Default value | Details |
|:--|:--|:--|:--|
| direction | `left `&#124;`  right  `&#124;`  up  `&#124;` down` | `left` | direction of motion |
| id | string | null | unique identifier for a marquee instance on a page |
| play | boolean | true | plays if true else it is paused |
| speed | number | 50 | Pixel per second |
| pauseOnHover | boolean | `false` | `true` pauses the animation on hover |
| initialSlideIndex | number | 0 | starting slide index |
| children | React.ReactNode[] | null | slides to be rendered |


# Upcoming in next releases
- More features
- Automation tests


# Status
In beta