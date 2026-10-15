export type EquationLabel = { tag: string; anchor: string };
export type NumberedEquation = { source: string; anchors: string[] };

export declare function equationAnchor(key: string): string;
export declare function numberEquations(sources: string[]): {
	equations: NumberedEquation[];
	labels: Map<string, EquationLabel>;
};
export declare function prepareFormula(source: string, labels?: Map<string, EquationLabel>): string;
export declare function resolveReferences(source: string, labels: Map<string, EquationLabel>): string;
