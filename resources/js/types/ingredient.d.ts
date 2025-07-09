export interface Unit {
    id: number;
    name: string;
    abbreviation: string;
}

export interface Ingredient {
    id: number;
    name: string;
    unit_id: number;
    reason:string;
}