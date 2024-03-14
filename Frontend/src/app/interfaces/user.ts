import { Category } from "./category";
import { Note } from "./note";

export interface User {
    id: number;
    username: string;
    notes: Note[];
    categories: Category[];
}