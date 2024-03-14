import { Note } from "./note";

export interface Category {
    id: number;
    name: string;
    notes: Note[];
}

export interface CreateCategoryDto extends Omit<Category, 'id' | 'notes'>{
    name: string;
    user: {id: number};
}