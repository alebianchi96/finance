export  default class CategoryNature {
    static readonly C = "C";
    static readonly R = "R";
    static readonly F = "F";

    static get(valueAsString: string): string | null {
        if ('R' === valueAsString) return CategoryNature.R;
        if ('C' === valueAsString) return CategoryNature.C;
        if ('F' === valueAsString) return CategoryNature.F;
        return null;
    }
}