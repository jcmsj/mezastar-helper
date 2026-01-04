import { db } from '@/data/dexie';
import { createFileRoute, Link } from '@tanstack/react-router'
import { QRCodeCanvas } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SupportPokemonRegistry } from '@/data/registry';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useStore } from '@tanstack/react-store';
import { SupportPokemonSchema } from '@/schemas/supportPokemon';
import { getPokemonTypeColor } from '@/data/pokemon-type-colors';
import z from 'zod';
export const Route = createFileRoute('/v1/$trainerId')({
  component: RouteComponent,
  async loader(ctx) {
    const { trainerId } = ctx.params;
    const trainer = await db.trainerIds.where('trainerId').equals(trainerId).first();
    if (!trainer) {
      throw new Response('Trainer ID not found', { status: 404 });
    }

    const response = await fetch('/supports.registry.json')
    const data: object = await response.json();
    const parsed = SupportPokemonSchema.array().safeParse(Object.entries(data).map(([key, value]) => ({ id: key, ...value })));
    if (!parsed.success) {
      console.error('Failed to parse support pokemon registry:', parsed.error);
      throw new Response('Failed to load support pokemon registry', { status: 500 });
    }
    const registry = {} as Record<string, z.infer<typeof SupportPokemonSchema>>;
    parsed.data.forEach((item) => {
      registry[item.id] = item;
    })
    SupportPokemonRegistry.setState({
      registry,
    });
    return { trainer };
  },
})

function RouteComponent() {
  const { trainer } = Route.useLoaderData();
  const pokemonArray = useStore(SupportPokemonRegistry, (state) => Object.entries(state.registry).map(([code, data]) => ({
    code,
    ...data,
  })));

  return <div className='min-h-screen bg-linear-to-b from-red-600 via-orange-500 to-yellow-500'>
    {/* Header */}
    <div className="text-center py-8 px-4 border-b-4 border-yellow-300">
      <h1 className="text-4xl font-black text-white drop-shadow-lg" style={{ textShadow: '2px 2px 0px #000' }}>
        {trainer.alias}
      </h1>
    </div>

    <div className='max-w-3xl mx-auto p-4 space-y-6 pb-8'>
    <Card className="border-4 border-black shadow-xl">
      <CardHeader className="bg-linear-to-r from-yellow-300 to-orange-300 border-b-4 border-black">
        <CardTitle className="font-black text-black text-center">TRAINER ID</CardTitle>
      </CardHeader>
      <CardContent className='flex justify-center pt-8 pb-8'>
        <div className="border-4 border-black p-4 bg-white">
          <QRCodeCanvas
            size={256}
            value={trainer.trainerId}
            level='H'
          />
        </div>
      </CardContent>
    </Card>

    <Card className="border-4 border-black shadow-xl">
      <CardHeader className="bg-linear-to-r from-cyan-400 to-blue-500 border-b-4 border-black">
        <CardTitle className="text-white font-black text-lg">SUPPORT POKÉMON</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 bg-white">
        {pokemonArray && pokemonArray.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {pokemonArray.map((pokemon) => (
              <AccordionItem key={pokemon.code} value={`pokemon-${pokemon.code}`} className="border-b-2 border-gray-300">
                <AccordionTrigger className="hover:bg-gray-100 px-2 rounded transition-colors">
                  <div className='flex gap-4 text-left items-center w-full'>
                    <span className='font-black text-base'>{pokemon.pokemon}</span>
                    <div 
                      className='h-6 w-6 rounded border-2 border-black flex items-center justify-center p-1 shrink-0'
                      style={{ backgroundColor: getPokemonTypeColor(pokemon.type) }}
                    >
                      <img 
                        src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/refs/heads/master/icons/${pokemon.type.toLowerCase()}.svg`}
                        alt={pokemon.type}
                        className='h-full w-full'
                      />
                    </div>
                    <span className='text-sm font-semibold text-gray-700'>{pokemon.move}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-gray-50 rounded p-4">
                  <div className='flex justify-center pt-2'>
                    <div className="border-4 border-black p-3 bg-white">
                      <QRCodeCanvas
                        size={200}
                        value={pokemon.code}
                        level='H'
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className='text-center text-gray-600 font-bold py-8'>No support pokemon added yet</div>
        )}
      </CardContent>
    </Card>

    <div className='pt-4 flex gap-2'>
      <Link to="/v1" className='w-full'>
        <Button className='w-full bg-yellow-300 hover:bg-yellow-400 text-black border-4 border-black font-black text-lg py-6'>← BACK TO TRAINER IDs</Button>
      </Link>
    </div>
  </div>
  </div>
}
