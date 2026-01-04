import z from "zod";

export const SupportPokemonSchema = z.object({
  id: z.hex({error: "Hex encoded data of the support pokemon's QR code"}),
  pokemon: z.string(),
  type: z.string(),
  move: z.string(),
});
