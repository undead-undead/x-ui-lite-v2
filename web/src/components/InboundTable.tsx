import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Inbound } from '../types/inbound';
import { formatTraffic } from '../utils/format';
import { Switch } from './ui/Switch';
import { useInboundStore } from '../store/useInboundStore';
import { useModalStore } from '../store/useModalStore';
import { useDialogStore } from '../store/useDialogStore';
import { useQRCodeStore } from '../store/useQRCodeStore';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { QrCode, RefreshCw, Edit3, Trash2, Copy } from 'lucide-react';
import { generateShareLink, copyToClipboard } from '../utils/linkUtils';
import { toast } from 'react-hot-toast';

interface InboundTableProps {
    inbounds: Inbound[];
    isEmbedded?: boolean;
}

interface InboundRowProps {
    item: Inbound;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onReset: (id: string) => void;
    onEdit: (item: Inbound) => void;
    onQRCode: (item: Inbound) => void;
    onCopy: (item: Inbound) => void;
}

const InboundRow = memo<InboundRowProps>(({ item, onToggle, onDelete, onReset, onEdit, onQRCode, onCopy }) => {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <tr className={`group hover:bg-gray-50 transition-colors ${isMenuOpen ? 'relative z-50' : ''}`}>
            <td className="px-8 py-6">
                <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-gray-900 tracking-tight">{item.remark}</span>
                </div>
            </td>
            <td className="px-8 py-6">
                <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-bold uppercase tracking-tight">
                    {item.protocol}
                </span>
            </td>
            <td className="px-8 py-6 text-[14px] font-bold text-gray-700 tabular-nums">{item.port}</td>
            <td className="px-8 py-6">
                <div className="flex items-center gap-2 text-[13px] font-bold tabular-nums">
                    <div className="flex items-center gap-1.5 text-gray-900">
                        <span className="text-gray-400">↑</span>
                        <span className="text-gray-600">{formatTraffic(item.up || 0)}</span>
                        <span className="text-gray-400 ml-1">↓</span>
                        <span className="text-gray-600">{formatTraffic(item.down || 0)}</span>
                        <span className="text-gray-300 ml-1">/</span>
                        <span className={`ml-1 ${item.total > 0 ? 'text-blue-500' : 'text-gray-400'}`}>
                            {item.total > 0 ? formatTraffic(item.total) : '∞'}
                        </span>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6">
                <div className="flex justify-center">
                    <Switch
                        checked={item.enable}
                        onChange={() => onToggle(item.id)}
                    />
                </div>
            </td>
            <td className="px-8 py-6 text-right">
                <div className="flex justify-end pr-2">
                    <Dropdown onOpenChange={setIsMenuOpen}>
                        <DropdownItem
                            onClick={() => onCopy(item)}
                            icon={<Copy size={16} strokeWidth={2.5} />}
                        >
                            {t('inbound.actions.copy_link')}
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => onQRCode(item)}
                            icon={<QrCode size={16} strokeWidth={2.5} />}
                        >
                            {t('inbound.actions.qrcode')}
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => onReset(item.id)}
                            icon={<RefreshCw size={16} strokeWidth={2.5} />}
                        >
                            {t('inbound.actions.reset')}
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => onEdit(item)}
                            icon={<Edit3 size={16} strokeWidth={2.5} />}
                        >
                            {t('inbound.actions.edit')}
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => onDelete(item.id)}
                            variant="danger"
                            icon={<Trash2 size={16} strokeWidth={2.5} />}
                        >
                            {t('inbound.actions.delete')}
                        </DropdownItem>
                    </Dropdown>
                </div>
            </td>
        </tr>
    );
});

InboundRow.displayName = 'InboundRow';

export const InboundTable: React.FC<InboundTableProps> = memo(({ inbounds, isEmbedded }) => {
    const { t } = useTranslation();
    const toggleEnable = useInboundStore(s => s.toggleEnable);
    const deleteInbound = useInboundStore(s => s.deleteInbound);
    const resetTraffic = useInboundStore(s => s.resetTraffic);
    const { openModal } = useModalStore();

    const handleToggle = useCallback((id: string) => {
        toggleEnable(id);
    }, [toggleEnable]);

    const handleDelete = useCallback((id: string) => {
        useDialogStore.getState().showConfirm(
            t('inbound.confirm.delete_msg'),
            async () => {
                await deleteInbound(id);
                toast.success(t('inbound.confirm.delete_success'));
            },
            t('inbound.confirm.delete_title')
        );
    }, [deleteInbound, t]);

    const handleReset = useCallback((id: string) => {
        useDialogStore.getState().showConfirm(
            t('inbound.confirm.reset_msg'),
            async () => {
                await resetTraffic(id);
                toast.success(t('inbound.confirm.reset_success'));
            },
            t('inbound.confirm.reset_title')
        );
    }, [resetTraffic, t]);

    const handleEdit = useCallback((item: Inbound) => {
        openModal(item);
    }, [openModal]);

    const handleQRCode = useCallback((item: Inbound) => {
        useQRCodeStore.getState().open(item);
    }, []);

    const handleCopy = useCallback((item: Inbound) => {
        const link = generateShareLink(item);
        copyToClipboard(link).then(success => {
            if (success) toast.success(t('inbound.confirm.copy_success'));
            else toast.error(t('inbound.confirm.copy_failed'));
        });
    }, [t]);

    const containerStyles = isEmbedded
        ? "w-full"
        : "bg-white border border-gray-200 rounded-5xl shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-1000";

    return (
        <div className={containerStyles}>
            <div className="overflow-x-auto overflow-y-visible min-h-[450px]">
                <table className="w-full min-w-[1000px] text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-8 py-5 text-[13px] font-bold tracking-tight text-gray-500">{t('inbound.table.remark')}</th>
                            <th className="px-8 py-5 text-[13px] font-bold tracking-tight text-gray-500">{t('inbound.table.type')}</th>
                            <th className="px-8 py-5 text-[13px] font-bold tracking-tight text-gray-500">{t('inbound.table.port')}</th>
                            <th className="px-8 py-5 text-[13px] font-bold tracking-tight text-gray-500">{t('inbound.table.traffic')}</th>
                            <th className="px-8 py-5 text-[13px] font-bold tracking-tight text-gray-500 text-center">{t('inbound.table.status')}</th>
                            <th className="px-8 py-5 text-[13px] font-bold tracking-tight text-gray-500">
                                <div className="flex justify-end pr-2">
                                    <div className="w-10 flex items-center justify-center">
                                        {t('inbound.table.actions')}
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {inbounds.map((item) => (
                            <InboundRow
                                key={item.id}
                                item={item}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                                onReset={handleReset}
                                onEdit={handleEdit}
                                onQRCode={handleQRCode}
                                onCopy={handleCopy}
                            />
                        ))}
                    </tbody>
                </table>
                {inbounds.length === 0 && (
                    <div className="p-20 text-center">
                        <p className="text-gray-400 font-bold tracking-tight text-[15px]">{t('inbound.no_nodes')}</p>
                    </div>
                )}
            </div>
        </div>
    );
});

InboundTable.displayName = 'InboundTable';