import { useState } from 'react';

export interface ExpandableListState<T> {
    visibleItems: T[];
    expanded: boolean;
    toggleExpanded: () => void;
    canToggle: boolean;
    toggle: () => void;
}

export function useExpandableList<T>(items: T[], initialLimit: number): ExpandableListState<T> {
    const [expanded, setExpanded] = useState(false);

    const visibleItems = expanded ? items : items.slice(0, initialLimit);
    const canToggle = items.length > initialLimit;

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return {
        visibleItems,
        expanded,
        toggleExpanded,
        canToggle,
        toggle: toggleExpanded,
    };
}
