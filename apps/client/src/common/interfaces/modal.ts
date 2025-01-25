export interface ModalType {
    trigger: React.ReactNode;
    title: string;
    description?: string;
    children: React.ReactNode;
    onSave?: () => void;
    saveLabel?: string;
}
