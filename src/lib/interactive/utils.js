import {
	isNotDefined,
	isDefined,
	mapObject,
	// find,
} from "../utils";

export function getValueFromOverride(override, index, key, defaultValue) {
	if (isDefined(override) && override.index === index)
		return override[key];
	return defaultValue;
}

export function terminate() {
	this.setState({
		current: null,
		override: null,
	});
}

export function saveNodeType(type) {
	return node => {
		if (isNotDefined(node) && isDefined(this.nodes[type])) {
			delete this.nodes[type];
		} else {
			this.nodes[type] = node;
		}
		// console.error(this.nodes)
	};
}
export function isHoverForInteractiveType(interactiveType) {
	return function(moreProps) { // this has to be function as it is bound to this

		if (isDefined(this.nodes)) {
			const selecedNodes = this.nodes
				.map(node => node.isHover(moreProps));
            return this.props[interactiveType].map((t, idx) => {
				return {
					...t,
					selected: selecedNodes[idx]
				};
			});
		}
	};
}

export function isHover(moreProps) {
    return mapObject(this.nodes, node => node.isHover(moreProps))
		.reduce((a, b) => {
			return a || b;
		});
}

function getMouseXY(moreProps, [ox, oy]) {
	if (Array.isArray(moreProps.mouseXY)) {
		const { mouseXY: [x, y] } = moreProps;
        return [
			x - ox,
			y - oy
		];

	}
	return moreProps.mouseXY;
}

const getChartConfig = (allProps, chartId) => {
    const { chartConfig } = allProps;

    if (Array.isArray(chartConfig)) {
        return { ...chartConfig.find(conf => conf.id === chartId) };
    }
    return chartConfig;
};

export function getMorePropsForChart(moreProps, chartId) {
    const chartConfig = getChartConfig(moreProps, chartId);

	const { origin } = chartConfig;
	const mouseXY = getMouseXY(moreProps, origin);
	return {
		...moreProps,
		chartConfig,
		mouseXY,
	};
}

export function getSelected(interactives) {
    return interactives
		.map(each => {
			const objects = each.objects.filter(obj => {
				return obj.selected;
			});
			return {
				...each,
				objects,
			};
		})
		.filter(each => each.objects.length > 0);
}
