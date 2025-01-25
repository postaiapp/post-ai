'use client';

import { ModalType } from '@common/interfaces/modal';
import { Button } from '@components/ui/button';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

export function Modal({ trigger, title, description, children, onSave, saveLabel = 'Save' }: ModalType) {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-50">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <p className="text-sm text-gray-500">{description}</p>}
                </DialogHeader>
                <div className="py-4">{children}</div>
                <DialogFooter>
                    {onSave && (
                        <Button type="button" onClick={onSave}>
                            {saveLabel}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
