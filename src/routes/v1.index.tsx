import { db } from '@/data/dexie'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import type { TrainerId } from '@/data/dexie'
import { useIsMobile } from '@/hooks/use-mobile'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { AddTrainerForm } from '@/components/AddTrainerForm'
import { DeleteTrainerDialog } from '@/components/DeleteTrainerDialog'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/v1/')({
  component: RouteComponent,
  async loader() {
    return {
      trainerIds: await db.trainerIds.toArray(),
    }
  },
})

function RouteComponent() {
  const { trainerIds: initialTrainerIds } = Route.useLoaderData() as { trainerIds: TrainerId[] };
  const [trainerIds, setTrainerIds] = useState(initialTrainerIds);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<TrainerId | null>(null);
  const isMobile = useIsMobile();

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      window.alert('Failed to copy to clipboard');
    }
  };

  const handleAddSuccess = async () => {
    // Reload trainer IDs from database
    const updated = await db.trainerIds.toArray();
    setTrainerIds(updated);
  };

  const handleDeleteClick = (trainer: TrainerId) => {
    setSelectedForDelete(trainer);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedForDelete?.id) return;

    try {
      await db.trainerIds.delete(selectedForDelete.id);
      const updated = await db.trainerIds.toArray();
      setTrainerIds(updated);
      setSelectedForDelete(null);
    } catch (err) {
      console.error('Failed to delete trainer ID', err);
      throw err;
    }
  };

  const FormContent = () => (
    <AddTrainerForm onSuccess={handleAddSuccess} onOpenChange={setIsAddOpen} />
  );

  return (
    <div className='min-h-screen bg-linear-to-b from-purple-600 via-blue-500 to-cyan-500'>
      {/* Header */}
      <div className="text-center py-8 px-4 border-b-4 border-yellow-300">
        <h1 className="text-4xl font-black text-white drop-shadow-lg" style={{ textShadow: '2px 2px 0px #000' }}>
          YOUR TRAINER IDs
        </h1>
      </div>

      <div className='max-w-4xl mx-auto p-4 pb-24'>
        {trainerIds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white text-xl font-bold drop-shadow-lg">No trainer IDs saved yet.</p>
            <p className="text-white/80 mt-2">Add your first trainer ID to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trainerIds.map((trainer) => (
              <div
                key={trainer.id ?? trainer.trainerId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-4 border-black bg-white rounded shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 sm:mb-0 flex-1">
                  <p className="font-black text-lg" style={{ color: '#FF6B6B' }}>{trainer.alias || "Unnamed"}</p>
                  <p className="text-sm text-gray-600 font-mono">{trainer.trainerId.slice(0,24)}...</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link to="/v1/$trainerId" params={ { trainerId: trainer.trainerId } } className="flex-1 sm:flex-none">
                  <Button variant="outline" size="sm" className="w-full border-2 border-black font-bold bg-blue-400 hover:bg-blue-500 text-white">
                    View
                  </Button>
                  </Link>
                  <Button
                    variant={copiedId === trainer.trainerId ? 'secondary' : 'default'}
                    size="sm"
                    className={`flex-1 sm:flex-none border-2 border-black font-bold ${copiedId === trainer.trainerId ? 'bg-green-400 text-black' : 'bg-yellow-300 text-black hover:bg-yellow-400'}`}
                    onClick={() => handleCopy(trainer.trainerId)}
                  >
                    {copiedId === trainer.trainerId ? '✓ Copied' : 'Copy'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 sm:flex-none border-2 border-black font-bold bg-red-500 hover:bg-red-600"
                    onClick={() => handleDeleteClick(trainer)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t-4 border-yellow-300 bg-linear-to-r from-blue-600 to-purple-600 p-4 flex gap-2">
        {isMobile ? (
          <Drawer open={isAddOpen} onOpenChange={setIsAddOpen}>
            <Button onClick={() => setIsAddOpen(true)} className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold border-2 border-black" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Trainer ID
            </Button>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="font-black text-lg">Add New Trainer ID</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <FormContent />
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <>
            <Button onClick={() => setIsAddOpen(true)} className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold border-2 border-black" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Trainer ID
            </Button>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogContent className="border-4 border-black">
                <DialogHeader>
                  <DialogTitle className="font-black text-lg">Add New Trainer ID</DialogTitle>
                </DialogHeader>
                <FormContent />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  )
}
