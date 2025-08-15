import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

const CreateCategory = () => {
    const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
    const { data, setData, post } = useForm({
        name: '',
    });

    const handleCreateNewCategory = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('categories.store'));
        setIsNewCategoryOpen(false);
    };
    return (
        <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> New
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleCreateNewCategory}>
                    <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Category Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsNewCategoryOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCategory;
