import dexie, { Dexie,EntityTable } from "dexie";

export interface TrainerId {
    id?: number;
    trainerId: string;
    alias: string;
    createdAt: number;
}

export interface SupportPokemon {
    id?: number;
    code: string;
    pokemon: string;
    move: string;
    type: string;
    addedAt: number;
}

export const db = new dexie("PokemonMezastarHelper") as Dexie & {
    trainerIds: EntityTable<TrainerId, 'id'>;
    supportPokemon: EntityTable<SupportPokemon, 'id'>;
}

db.version(1).stores({
    trainerIds: "++id, trainerId, alias",
    supportPokemon: "++id, code",
});
