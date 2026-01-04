import { SupportPokemonSchema } from "@/schemas/supportPokemon";
import { Store } from "@tanstack/store";
import z from "zod";

export const SupportPokemonRegistry = new Store({
    registry: {} as Record<string, z.infer<typeof SupportPokemonSchema>>,
})
