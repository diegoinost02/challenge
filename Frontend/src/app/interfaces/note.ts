import { Category } from "./category";
import { User } from "./user";

export interface Note {
    id: number;
    description: string;
    user: User;
    categories: Category[];
    enabled: boolean;
}

export interface CreateNoteDto extends Omit<Note, 'id' | 'user' | 'description' | 'categories'>{
    user: {id: number};
    description: string;
}